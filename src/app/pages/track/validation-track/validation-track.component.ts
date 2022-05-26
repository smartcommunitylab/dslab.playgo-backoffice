import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Track } from "src/app/shared/classes/track-class";
import {
  LIST_STATES_TRACK,
  MY_DATE_FORMATS,
  TERRITORY_ID_LOCAL_STORAGE_KEY,
  VALIDATIONJSON,
} from "src/app/shared/constants/constants";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import {
  GeolocationClass,
  PageTrackedInstanceClass,
  TrackedInstanceConsoleClass,
} from "src/app/shared/classes/PageTrackedInstance-class";
import { Moment } from "moment";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
} from "../../../shared/constants/constants";
import { latLng, Map, MapOptions, tileLayer } from "leaflet"; // Draw
import * as L from "leaflet";
import { means } from "src/app/shared/constants/means";
import * as moment from "moment";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { ConsoleControllerInternalService } from "src/app/shared/services/console-controller.service";
import { MatDialog } from "@angular/material/dialog";
import { StatusDialogComponent } from "../status-dialog/status-dialog.component";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";

@Component({
  selector: "app-validation-track",
  templateUrl: "./validation-track.component.html",
  styleUrls: ["./validation-track.component.scss"],
  animations: [
    trigger("bodyExpansion", [
      state("collapsed, void", style({ height: "0px", visibility: "hidden" })),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed, void => collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class ValidationTrackComponent implements OnInit {
  territoryId: string;
  mapOptions: MapOptions;
  map: Map;
  stateValidationTrack: string = "collapsed";
  size: number[] = [15];
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  dataSourceInfoTrack: MatTableDataSource<any[]>; //GeolocationClass 
  displayedColumnsTrack: string[] = ["index","lat","long", "date", "accuracy", "activity","activityConfidence","isMoving","speed"];
  dataSource: MatTableDataSource<TrackedInstanceConsoleClass>;
  displayedColumns: string[] = ["tracks"];
  selectedTrack: TrackedInstanceConsoleClass;
  selectedRowIndex: string;
  currentPageNumber: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listTrack: TrackedInstanceConsoleClass[];
  listSorting = ["ascending", "descending"];
  listModelType = means;
  listStates = LIST_STATES_TRACK;
  validationJson = VALIDATIONJSON;
  layerGroup: L.Layer;
  markerLayers: any[];
  displayedColumnsDevice: string[] = ["available","platform","version","manufacturer","isVirtual","appVersion"];//];
  deviceInfo: any;
  listCampaings: string[] = [];

  validatingForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private trackingService: ConsoleControllerService,
    private territoryService: TerritoryControllerService,
    private trackingServiceInternal: ConsoleControllerInternalService,
    private campaignService: CampaignControllerService,
    private dialogStatus: MatDialog,
    private dialogDistance: MatDialog,
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.initializaValidatingForm();
    var dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value, true); 
    console.log("ng init from: ",dateFromString);
    var dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value, true);
    console.log("ng init to: ",dateToString); 
    this.trackingServiceInternal
      .searchTrackedInstanceUsingGET(
        this.currentPageNumber,
        this.size[0],
        this.territoryId,
        this.validatingForm.get("sort").value ? this.validatingForm.get("sort").value : undefined,
        this.validatingForm.get("trackId").value ? this.validatingForm.get("trackId").value : undefined ,
        this.validatingForm.get("playerId").value ? this.validatingForm.get("playerId").value : undefined,
        this.validatingForm.get("modeType").value ? this.validatingForm.get("modeType").value : undefined,
        dateFromString,
        dateToString,
        this.validatingForm.get("campaignId").value ? this.validatingForm.get("campaignId").value : undefined,
        this.validatingForm.get("status").value ? this.validatingForm.get("status").value.toUpperCase() : undefined
      )
      .subscribe((res) => {
        this.paginatorData = res;
        this.listTrack = res.content;
        this.setTableData();
        this.dataSource.paginator = this.paginator;
      });
    this.initializeMapOptions();
    this.territoryService.getTerritoryUsingGET(this.territoryId).subscribe((territory)=>{
      this.listModelType = territory.territoryData.means;
    });
    this.campaignService.getCampaignsUsingGET(this.territoryId).subscribe((campaigns)=>{
      campaigns.forEach((item)=>{this.listCampaings.push(item.campaignId)});
    })
  }

  initializaValidatingForm() {
    this.validatingForm = this.formBuilder.group({
      sort: new FormControl(""),
      trackId: new FormControl(""),
      playerId: new FormControl(""),
      modeType: new FormControl(""),
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      campaignId: new FormControl(""),
      status: new FormControl(""),
    });
    const monday = this.getPreviousMonday();
    const sunday = this.getNextSunday();
    this.validatingForm.patchValue({
      dateFrom: moment(monday, "YYYY-MM-DD"),
      dateTo: moment(sunday, "YYYY-MM-DD"),
      sort: 'asc'
    });
  }

  getPreviousMonday() {
    var date = new Date();
    var day = date.getDay();
    var prevMonday = new Date();
    if (date.getDay() == 0) {
      prevMonday.setDate(date.getDate() - 14);
    } else {
      prevMonday.setDate(date.getDate() - (day - 1) - 7);
    }

    return prevMonday;
  }

  getNextSunday() {
    var date = new Date();
    var day = date.getDay();
    var nextSunday = new Date();
    if (date.getDay() == 7) {
      nextSunday.setDate(date.getDate() + 7);
    } else {
      nextSunday.setDate(date.getDate() + (7 - day));
    }

    return nextSunday;
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.listTrack);
  }

  private initializeMapOptions(): void {
    this.mapOptions = {
      center: latLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
      zoom: 7,
      layers: [
        tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "Map data © OpenStreetMap contributors",
        }),
      ],
    };
  }

  getDateFromTimeStamp(timestamp: any) {
    var date = new Date(timestamp);
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes()
    );
  }

  searchSubmit() {
    if (this.validatingForm.valid) {
      var dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,true); 
      var dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,true);
      dateToString = dateToString ? dateToString :this.transformDateToString(moment());  
      this.trackingServiceInternal
        .searchTrackedInstanceUsingGET(
          this.currentPageNumber,
          this.size[0],
          this.territoryId,
          this.validatingForm.get("sort").value ? this.validatingForm.get("sort").value : undefined,
          this.validatingForm.get("trackId").value ? this.validatingForm.get("trackId").value : undefined ,
          this.validatingForm.get("playerId").value ? this.validatingForm.get("playerId").value : undefined,
          this.validatingForm.get("modeType").value ? this.validatingForm.get("modeType").value : undefined,
          dateFromString,
          dateToString,
          this.validatingForm.get("campaignId").value ? this.validatingForm.get("campaignId").value : undefined,
          this.validatingForm.get("status").value ? this.validatingForm.get("status").value.toUpperCase() : undefined
        )
        .subscribe((res) => {
          this.paginatorData = res;
          this.listTrack = res.content;
          this.setTableData();
          this.dataSource.paginator = this.paginator;
        });
    }
  }

  toggle() {
    if (this.stateValidationTrack === "collapsed") {
      this.stateValidationTrack = "expanded";
    } else {
      this.stateValidationTrack = "collapsed";
    }
  }

  showTrack(row: TrackedInstanceConsoleClass) {
    this.trackingService.getTrackedInstanceDetailUsingGET(this.territoryId,row.trackedInstance.id).subscribe((fullDetails)=>{
      this.selectedTrack = fullDetails;
      this.orderPoints();
      this.selectedRowIndex = this.selectedTrack.trackedInstance.id;
      this.dataSourceInfoTrack = new MatTableDataSource<any>(
        this.selectedTrack.trackedInstance.geolocationEvents
      );
      this.deviceInfo = this.obejectFromString(this.selectedTrack.trackedInstance.deviceInfo);
      this.drawPolyline(this.selectedTrack.trackedInstance.geolocationEvents);
      this.markerLayers = [];
      for (let i = 0; i < this.selectedTrack.trackedInstance.geolocationEvents.length; i++) {
        this.markerLayers.push(undefined);
      }
    });
  }

  orderPoints(){
    this.selectedTrack.trackedInstance.geolocationEvents.sort((a: any,b: any)=>
      (a.recorded_at >b.recorded_at ? 1 : -1)
    );
  }

  resetSearchFields() {
    this.validatingForm = this.formBuilder.group({
      sort: new FormControl(""),
      trackId: new FormControl(""),
      playerId: new FormControl(""),
      modeType: new FormControl(""),
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      campaignId: new FormControl(""),
      status: new FormControl(""),
    });
    this.validatingForm.patchValue({
      sort: '',
      trackId: '',
      playerId: '',
      modeType: '',
      dateFrom: '',
      dateTo: '',
      campaignId: '',
      status: '',
    });
  }

  selectedPageSize(event: any) {
    if (!!event) {
      const pageIndex = event.pageIndex;
      this.currentPageNumber = pageIndex;
      try {
        const list: Track[] = [];
        var dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value); 
        var dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value);
        dateToString = dateToString ? dateToString :this.transformDateToString(moment());  
        this.trackingServiceInternal
          .searchTrackedInstanceUsingGET(
            this.currentPageNumber,
            this.size[0],
            this.territoryId,
            this.validatingForm.get("sort").value ? this.validatingForm.get("sort").value : undefined,
            this.validatingForm.get("trackId").value ? this.validatingForm.get("trackId").value : undefined ,
            this.validatingForm.get("playerId").value ? this.validatingForm.get("playerId").value : undefined,
            this.validatingForm.get("modeType").value ? this.validatingForm.get("modeType").value : undefined,
            dateFromString,
            dateToString,
            this.validatingForm.get("campaignId").value ? this.validatingForm.get("campaignId").value : undefined,
            this.validatingForm.get("status").value ? this.validatingForm.get("status").value.toUpperCase() : undefined
          )
          .subscribe((res) => {
            this.listTrack = res.content;
            this.setTableData();
          });
      } catch (error) {
        console.error(error);
      }
    }
  }

  formatDate(datee: Moment): string {
    var day = (+datee.toObject().date.toString()).toString();
    if (day.length === 1) {
      day = "0" + day;
    }
    var month = (+datee.toObject().months.toString() + 1).toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    const year = datee.toObject().years.toString();
    return year + "-" + month + "-" + day;
  }

  drawPolyline(arrayPoints: any[]) { // any[] = GeolocationClass
    var latlngs = [];
    try {
      if (this.layerGroup) {
        this.map.removeLayer(this.layerGroup);
        this.layerGroup = undefined;
        this.markerLayers.forEach((item)=>{
          if(!!item)
            this.map.removeLayer(item["layer"]);
        });
      }
    } catch (error) {}
    for (let element of arrayPoints) {
      latlngs.push([element.geocoding[1], element.geocoding[0]]);
    }
    var polyline = L.polyline(latlngs, { color: "blue" });
    this.layerGroup = new L.LayerGroup([polyline]);
    this.layerGroup.addTo(this.map);
    this.map.setView(latlngs[0], 15);
  }

  public initializeMap(map: Map): void {
    this.map = map;
  }

  showPoint(index: number, row: any) { //row => GeolocationClass
    var icon = L.divIcon({
      className: "number-icon",
      iconSize: [25, 41],
      iconAnchor: [12, 43],
      html: (index+1).toString()
    });  

    if (!!this.markerLayers[index]){
      //defined
      try {
        this.map.removeLayer(this.markerLayers[index]["layer"]);
        this.markerLayers[index] = undefined;
      } catch {}
    } else {
      //undefined
      const popup = "<h3>point number: "+ (index+1)+ "</h3></br><h4>lat: " + row.geocoding[1] + " - long: " + row.geocoding[0]+"</h4>";
      var marker = L.marker([row.geocoding[1], row.geocoding[0]], { icon: icon });
      const markers = this.markerLayers[index] ? this.markerLayers[index]["markers"].push(marker) : [marker];
      this.markerLayers[index] = {"layer": new L.LayerGroup(markers),"markers": markers, "popup": popup  };
      this.markerLayers[index]["layer"].addTo(this.map);
    }

  }

  changeStatus(){
      const dialogRef = this.dialogStatus.open(StatusDialogComponent, {
        width: "60%",
        height: "50%",
      });
      let instance = dialogRef.componentInstance;
      instance.selectedTrack = this.selectedTrack;
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
        }
      });
  }

  selectedRowOnTrack(index: number): boolean {
    if(this.markerLayers){
      if(!!this.markerLayers[index]){
        return true;
      }
    }
    return false;
  }

  obejectFromString(s: string) :any{
    if(s==='null'){
      return {'available':false,'platform':'-','version':'-','uuid':'-','cordova':'-','model':'-','manufacturer':'-','isVirtual':false,'serial':'-','appVersion':'-'};
    }

    try{
      if(!!s && s!== null)
        return JSON.parse(s);
    }
    catch{}
    return {'available':true,'platform':'-','version':'-','uuid':'-','cordova':'-','model':'-','manufacturer':'-','isVirtual':false,'serial':'-','appVersion':'-'};
  }

  transformDateToString(date: Moment,startDay? :boolean): string{
    const dateFormat: Date = date ? date.toDate() : undefined;
    var dateString = dateFormat?  dateFormat.toISOString().replace('Z','').replace('T', ' ') : undefined;
    console.log(dateString);
    if(startDay){
      if(dateString)
        return dateString.substring(0,dateString.length-'00:00:00.000'.length) + '00:00:00'
      else
        return undefined;
      }
      if(dateString)
        return dateString.substring(0,dateString.length-'00:00:00.000'.length) + '23:59:59';
      else
        return undefined;
  }

  createDate(timestamp : number) : string{
    const date = new Date(timestamp);
    const midDate = date.toISOString().replace('Z','').replace('T', ' ')
    return midDate.substring(0,midDate.length-4);
  }


}
