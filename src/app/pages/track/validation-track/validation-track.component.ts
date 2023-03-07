import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { GeoLocationEvent, Track } from "src/app/shared/classes/track-class";
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
import { FeatureGroup, latLng, Map, MapOptions, tileLayer,Control } from "leaflet"; // Draw
import * as L from "leaflet";
import { means } from "src/app/shared/constants/means";
import * as moment from "moment";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { ConsoleControllerInternalService } from "src/app/shared/services/console-controller.service";
import { MatDialog } from "@angular/material/dialog";
import { StatusDialogComponent } from "../status-dialog/status-dialog.component";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { TranslateService } from "@ngx-translate/core";
import { TrackedInstance } from "src/app/core/api/generated/model/trackedInstance";
import { Geolocation } from "src/app/core/api/generated/model/geolocation";
import { GameArea } from "src/app/shared/classes/map-point";
import { TableVirtualScrollDataSource } from "ng-table-virtual-scroll";
import { ReportControllerService } from "src/app/core/api/generated/controllers/reportController.service";
import { CampaignPlacing } from "src/app/core/api/generated/model/campaignPlacing";
import { decode, polylineEncodeLine } from "@googlemaps/polyline-codec";
import { CampaignTripInfo } from "src/app/core/api/generated/model/campaignTripInfo";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";
import { DateTime, Settings } from "luxon";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { fullScreenMap } from "src/app/shared/full-screen/fullScreen";

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
  day = 60 * 60 * 24 * 1000;
  territoryId: string;
  mapOptions: MapOptions;
  map: Map;
  stateValidationTrack: string = "expanded";
  size: number[] = [50];
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  dataSourceInfoTrack: TableVirtualScrollDataSource<any[]>; //GeolocationClass
  displayedColumnsTrack: string[] = [
    "index",
    "date",
    "accuracy",
    "activity",
    "activityConfidence",
    "lat",
    "long",
    "isMoving",
    "speed",
  ];
  dataSource: TableVirtualScrollDataSource<any>;//TrackedInstanceConsoleClass
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
  startMarker: L.Layer;
  stopMarker: L.Layer;
  circleLayer: FeatureGroup;
  markerLayers: any[];
  deviceInfo: any;
  listCampaings: string[] = [];
  listCampaingsClean: string[] = [];
  dateFromModified = false;
  dateToModified = false;
  resetSearchFieldsComponents = false;
  SORTING = "startTime,desc";
  selectedLanguage: string;
  selectedTerritoryArea: GameArea;
  statisticsTracks: StatisticsTracks = { invalid: 0, valid: 0, pending: 0 };
  statisticsSelectedTrack: SelectedTrackStatistic = {
    start: "",
    end: "",
    distance: 0,
    validity: "",
    avrgSpeed: 0,
    maxSpeed: 0,
  };
  showAllPoints = true;
  innerHtmlValidation = "";
  restoreMap: Map;
  showTierFilter = false;
  dataSourceRankingUsersList: TableVirtualScrollDataSource<any>;
  rankingUsersList:CampaignPlacing[] =[];
  displayedColumnsRankingUsers= ["position","nickname","playerId"];
  selectedRankingUser: CampaignPlacing;
  publicTransportTracks: any[];
  layerPublicTransportTracks: any[];
  territorySelected: TerritoryClass;
  current_moving_pointer_leaflet_id: number;
  save_button_new_poly: boolean= false;
  toCheckForm: FormGroup;
  polylineHighligthLayer;
  highligthTrackCheck= false;
  selectAllCheckbox= false;

  validatingFormRanking: FormGroup;
  validatingForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private trackingService: ConsoleControllerService,
    private territoryService: TerritoryControllerService,
    private trackingServiceInternal: ConsoleControllerService,
    private campaignService: CampaignControllerService,
    private rankingService: ReportControllerService,
    private dialogStatus: MatDialog,
    private translate: TranslateService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.initializaValidatingForm();
    this.initializaValidatingFormRanking();
    this.initToCheckForm();
    // var dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value, true);
    // var dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value, true);
    this.trackingServiceInternal
      .searchTrackedInstanceUsingGET({
        page: this.currentPageNumber,
        size: this.size[0],
        territoryId: this.territoryId,
        sort: this.SORTING,
        trackId: this.validatingForm.get("trackId").value
          ? this.validatingForm.get("trackId").value
          : undefined,
        playerId: this.validatingForm.get("playerId").value
          ? this.validatingForm.get("playerId").value
          : undefined,
        modeType: this.validatingForm.get("modeType").value
          ? this.validatingForm.get("modeType").value
          : undefined,
        dateFrom: this.validatingForm.get("dateFrom").value.valueOf(),
        dateTo: this.validatingForm.get("dateTo").value.valueOf(),
        campaignId: this.validatingForm.get("campaignId").value
          ? this.validatingForm.get("campaignId").value
          : undefined,
        status: this.validatingForm.get("status").value
          ? this.validatingForm.get("status").value.toUpperCase()
          : undefined,
      })
      .subscribe((res) => {
        this.paginatorData = res;
        this.listTrack = res.content;
        this.setTableData();
        this.dataSource.paginator = this.paginator;
      });
    this.initializeMapOptions();
    this.territoryService
      .getTerritoryUsingGET(this.territoryId)
      .subscribe((territory) => {
        this.territorySelected = territory;
        this.listModelType = territory.territoryData.means;
        this.listModelType.push("all");
      });
    this.campaignService
      .getCampaignsUsingGET({ territoryId: this.territoryId })
      .subscribe((campaigns) => {
        campaigns.forEach((item) => {
          this.listCampaings.push(item.campaignId);
          this.listCampaingsClean.push(item.campaignId);
        });
        this.listCampaings.push("all");
      });
    this.selectedLanguage = this.translate.currentLang;
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
      toCheck: new FormControl("")
    });
    const monday = this.getPreviousMonday();
    const sunday = this.getNextSunday();
    this.validatingForm.patchValue({
      dateFrom: moment(monday, "YYYY-MM-DD"),
      dateTo: moment(sunday, "YYYY-MM-DD"),
    });
  }

  initToCheckForm(){
    this.toCheckForm = this.formBuilder.group({
      toCheck: new FormControl(""),
    });
  }

  initializaValidatingFormRanking() {
    this.validatingFormRanking = this.formBuilder.group({
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      campaignId: new FormControl("",[Validators.required]),
    });
    const monday = this.getPreviousMonday();
    const sunday = this.getNextSunday();
    this.validatingFormRanking.patchValue({
      dateFrom: moment(monday, "YYYY-MM-DD"),
      dateTo: moment(sunday, "YYYY-MM-DD"),
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
    this.dataSource = new TableVirtualScrollDataSource<any>(this.listTrack);
    this.setStatisticsListTracks();
  }

  setTableDataRankingUsers() {
    this.dataSourceRankingUsersList = new TableVirtualScrollDataSource<any>(this.rankingUsersList);
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

  searchSubmitRanking(){
    if (this.validatingFormRanking.valid) {
      if (this.resetSearchFieldsComponents) {
        this.allowResetOnsearch();
        this.resetSearchFieldsComponents = false;
      }
      const today: number = new Date().getTime();
      this.rankingService.
        getCampaingPlacingByGameUsingGET({
          page: this.currentPageNumber,
          size: this.size[0],
          campaignId: this.validatingFormRanking.get("campaignId").value,
          sort: this.SORTING,
          dateFrom: this.validatingFormRanking.get("dateFrom").value,
          dateTo: this.validatingFormRanking.get("dateTo").value
        })
        .subscribe((res) => {
          this.rankingUsersList = res.content;
          //TODO replace sample data with real data delete the ones below
          // this.rankingUsersList =[];
          // let k:CampaignPlacing[] =[
          //   {'position':1,'nickname':'spartan','playerId':'u_fe939cab-1638-45b3-a604-80a3fb018e54'},
          //   {'position':2,'nickname':'mino','playerId':'u_b061c167-0054-4a00-878e-3278b7ec5e9c'},
          //   {'position':3,'nickname':'matteochini','playerId':'u_c2016c30-20a4-47bd-8c7a-266995c0ff9e'},
          //   {'position':4,'nickname':'alattaruolo','playerId':'u_f74b1e34-463e-45af-a940-0c87a6d21838'},
          //   {'position':5,'nickname':'urca','playerId':'u_78dbd97d-5136-460c-a1a7-c67210236745'},
          //   {'position':6,'nickname':'chin8','playerId':'u_5eae76b8-2828-4932-a821-a16a4811a9c7'},
          //   {'position':7,'nickname':'udhfuhdf','playerId':'u_765393ce-c502-418a-a10d-000eb2c901d7'},
          //   {'position':8,'nickname':'blubla81','playerId':'u_6c5b5cd2-4e15-4267-9991-546d81829ef5'},
          //   {'position':9,'nickname':'tania','playerId':'u_f3c61cdea7254ae3bc5581c822b374d0'},
          //   {'position':10,'nickname':'Taty','playerId':'u_6ffd65deab654f0ab19985154f3939ae'},
          //   {'position':11,'nickname':'mau','playerId':'u_d995fe2ae909486399d89861aef2f450'}];
          // this.rankingUsersList = k;
          //delete till here
          this.setTableDataRankingUsers();
        });
    }
  }

  searchSubmit() {
    this.selectedRowIndex = undefined;
    if (this.validatingForm.valid) {
      if (this.resetSearchFieldsComponents) {
        this.allowResetOnsearch();
        this.resetSearchFieldsComponents = false;
      }
      // var dateFromString;
      // if(this.dateFromModified){
      //   dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,false);
      // }else{
      //   dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,true);
      // }
      // var dateToString;
      // if(this.dateToModified){
      //   dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,false);
      // }else{
      //   dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,true);
      // }
      // dateToString = dateToString ? dateToString :this.transformDateToString(moment());
      const today: number = new Date().getTime();
      this.trackingServiceInternal
        .searchTrackedInstanceUsingGET({
          page: this.currentPageNumber,
          size: this.size[0],
          territoryId: this.territoryId,
          sort: this.SORTING,
          trackId: this.validatingForm.get("trackId").value
            ? this.validatingForm.get("trackId").value
            : undefined,
          playerId: this.validatingForm.get("playerId").value
            ? this.validatingForm.get("playerId").value
            : undefined,
          modeType: this.validatingForm.get("modeType").value
            ? this.validatingForm.get("modeType").value === "all"
              ? undefined
              : this.validatingForm.get("modeType").value
            : undefined,
          dateFrom: this.validatingForm.get("dateFrom").value
            ? this.validatingForm.get("dateFrom").value.valueOf()
            : undefined,
          dateTo: this.validatingForm.get("dateTo").value
            ? this.validatingForm.get("dateTo").value.valueOf() + this.day
            : today,
          campaignId: this.validatingForm.get("campaignId").value
            ? this.validatingForm.get("campaignId").value === "all"
              ? undefined
              : this.validatingForm.get("campaignId").value
            : undefined,
          status: this.validatingForm.get("status").value
            ? this.validatingForm.get("status").value === "all"
              ? undefined
              : this.validatingForm.get("status").value.toUpperCase()
            : undefined,
            toCheck: this.validatingForm.get("toCheck").value === false || this.validatingForm.get("toCheck").value === true 
            ? this.validatingForm.get("toCheck").value
            : undefined
        })
        .subscribe((res) => {
          this.paginatorData = res;
          this.listTrack = res.content;
          this.selectedTrack = undefined;
          try {
            if (this.layerGroup) {
              this.map.removeLayer(this.layerGroup);
              this.map.removeLayer(this.startMarker);
              this.map.removeLayer(this.stopMarker);
              this.map.flyTo(latLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE), 7);
              this.layerGroup = undefined;
              this.markerLayers.forEach((item) => {
                if (!!item) this.map.removeLayer(item["layer"]);
              });
            }
          } catch (error) {}

          this.setTableData();
          //this.dataSource.paginator = this.paginator;
        });
    }
  }

  setStatisticsListTracks() {
    var invalid = 0;
    var valid = 0;
    var pending = 0;
    if (this.listTrack.length > 0) {
      this.listTrack.forEach((item) => {
        if (
          item.trackedInstance.validationResult.travelValidity ===
          TrackedInstance.ChangedValidityEnum.INVALID
        ) {
          invalid++;
        }
        if (
          item.trackedInstance.validationResult.travelValidity ===
          TrackedInstance.ChangedValidityEnum.VALID
        ) {
          valid++;
        }
        if (
          item.trackedInstance.validationResult.travelValidity ===
          TrackedInstance.ChangedValidityEnum.PENDING
        ) {
          pending++;
        }
      });
    }
    this.statisticsTracks = {
      invalid: invalid,
      valid: valid,
      pending: pending,
    };
  }

  setStatisticsSelectedTrack() {
    var maxSpeed = 0;
    var avrgSpeed = 0;
    var geolocations: any[] =
      this.selectedTrack.trackedInstance.geolocationEvents; //assume already ordered
    if (geolocations.length > 0) {
      this.statisticsSelectedTrack.validity =
        this.selectedTrack.trackedInstance.validationResult.travelValidity;
      for (let item of geolocations) {
        avrgSpeed += item.speed;
        if (maxSpeed < item.speed) {
          maxSpeed = item.speed;
        }
      }
      this.statisticsSelectedTrack.avrgSpeed = avrgSpeed / geolocations.length;
      this.statisticsSelectedTrack.maxSpeed = maxSpeed;
      this.statisticsSelectedTrack.start = this.createDate(
        geolocations[0].recorded_at
      );
      this.statisticsSelectedTrack.end = this.createDate(
        geolocations[geolocations.length - 1].recorded_at
      );
      this.statisticsSelectedTrack.distance =
        this.selectedTrack.trackedInstance.validationResult.validationStatus.distance;
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
    this.cleanPublicTrack();
    this.trackingService
      .getTrackedInstanceDetailUsingGET({
        territoryId: this.territoryId,
        trackId: row.trackedInstance.id,
      })
      .subscribe((fullDetails) => {
        this.selectedTrack = new TrackedInstanceConsoleClass();
        this.selectedTrack = fullDetails;
        this.toCheckForm.patchValue({
          toCheck: this.selectedTrack.trackedInstance.toCheck
        });
        if(this.selectedTrack.routesPolylines){
          const keys = Object.keys(this.selectedTrack.routesPolylines);
          this.publicTransportTracks = [];
          this.layerPublicTransportTracks = [];
          if (keys.length > 0) {
            const mapTracks = this.selectedTrack.routesPolylines[keys[0]];
            const tracksNumbers = Object.keys(mapTracks);
            let i=0;
            for (let trackNumber of tracksNumbers) {
              const currentTrack = {
                id: trackNumber,
                index: i,
                visualize: false,
                polyline: this.decodePoliline(mapTracks[trackNumber]),
              };
              this.publicTransportTracks.push(currentTrack);
              this.layerPublicTransportTracks.push(undefined);
              i++;
            }
          }
        }
        this.setInnerHtmlvalidation(
          this.selectedTrack.trackedInstance.validationResult.validationStatus
        );
        this.orderPoints();
        this.setStatisticsSelectedTrack(); // always after orderPoints
        this.selectedRowIndex = this.selectedTrack.trackedInstance.id;
        var events: GeolocationEventsClass[] = [];
        let i=0;
        for(let item of this.selectedTrack.trackedInstance.geolocationEvents){
          var event: GeolocationEventsClass = item;
          event.index = i;
          events.push(event);
          i++;

        } 
        this.dataSourceInfoTrack = new TableVirtualScrollDataSource<any>(
          events
        );
        this.deviceInfo = this.obejectFromString(
          this.selectedTrack.trackedInstance.deviceInfo
        );
        try {
          this.drawRayOnMap();
          this.drawPolyline(
            this.selectedTrack.trackedInstance.geolocationEvents
          );
          this.markerLayers = [];
          for (
            let i = 0;
            i < this.selectedTrack.trackedInstance.geolocationEvents.length;
            i++
          ) {
            this.markerLayers.push(undefined);
          }
          var start = [
            this.selectedTrack.trackedInstance.geolocationEvents[0]
              .geocoding[1],
            this.selectedTrack.trackedInstance.geolocationEvents[0]
              .geocoding[0],
          ];
          this.addStartMarker(start);
          const length =
            this.selectedTrack.trackedInstance.geolocationEvents.length;
          if (length > 1) {
            var end = [
              this.selectedTrack.trackedInstance.geolocationEvents[length - 1]
                .geocoding[1],
              this.selectedTrack.trackedInstance.geolocationEvents[length - 1]
                .geocoding[0],
            ];
            this.addEndMarker(end);
          }else{
            if(this.stopMarker)
              this.map.removeLayer(this.stopMarker);
          }
        } catch {}
      });
  }
  
  decodePoliline(polylinEncoded: string): any[]{
    return decode(polylinEncoded);
  }

  setInnerHtmlvalidation(obj: any) {
    this.innerHtmlValidation = this.setInnerHtmlvalidationRecursive(obj, 0);
  }

  setInnerHtmlvalidationRecursive(obj: any, depth: number): string {
    const keys = Object.keys(obj);
    var res = "";
    for (let key of keys) {
      if (obj[key]) {
        if (typeof obj[key] === "object") {
          res +=
            key +
            ": {<br />&emsp;" +
            this.setInnerHtmlvalidationRecursive(obj[key], depth + 1) +
            "}<br />";
        } else {
          for (let i = 0; i < depth; i++) {
            res += "&emsp;";
          }
          if (key === "startTime") {
            res += key + ": " + this.createDate(obj[key]) + ",<br />";
          } else if (key === "endTime") {
            res += key + ": " + this.createDate(obj[key]) + ",<br />";
          } else if (key === "error") {
            res +=
              '<span style="colod:red";>' +
              key +
              ": " +
              obj[key].toString() +
              "</span>,<br />";
          } else {
            res += key + ": " + obj[key].toString() + ",<br />";
          }
        }
      }
    }
    return res;
  }

  orderPoints() {
    this.selectedTrack.trackedInstance.geolocationEvents.sort(
      (a: any, b: any) => (a.recorded_at > b.recorded_at ? 1 : -1)
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
      toCheck: new FormControl(""),
    });
    this.validatingForm.patchValue({
      sort: "",
      trackId: "",
      playerId: "",
      modeType: "",
      dateFrom: "",
      dateTo: "",
      campaignId: "",
      status: "",
      toCheck: null,
    });
    this.resetPageNumber();
  }

  resetSearchFieldsRanking() {
    this.validatingFormRanking = this.formBuilder.group({
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      campaignId: new FormControl("",[Validators.required]),
    });
    this.validatingForm.patchValue({
      dateFrom: '',
      dateTo: '',
      campaignId: '',
    });
    this.resetPageNumber();
  }

  selectedPageSize(event: any) {
    if (!!event) {
      const pageIndex = event.pageIndex;
      this.currentPageNumber = pageIndex;
      try {
        const list: Track[] = [];
        // var dateFromString;
        // if(this.dateFromModified){
        //   dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,false);
        // }else{
        //   dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,true);
        // }
        // var dateToString;
        // if(this.dateToModified){
        //   dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,false);
        // }else{
        //   dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,true);
        // }
        // dateToString = dateToString ? dateToString :this.transformDateToString(moment());
        const today: number = new Date().getTime();
        this.trackingServiceInternal
          .searchTrackedInstanceUsingGET({
            page: this.currentPageNumber,
            size: this.size[0],
            territoryId: this.territoryId,
            sort: this.SORTING,
            trackId: this.validatingForm.get("trackId").value
              ? this.validatingForm.get("trackId").value
              : undefined,
            playerId: this.validatingForm.get("playerId").value
              ? this.validatingForm.get("playerId").value
              : undefined,
            modeType: this.validatingForm.get("modeType").value
              ? this.validatingForm.get("modeType").value
              : undefined,
            dateFrom: this.validatingForm.get("dateFrom").value
              ? this.validatingForm.get("dateFrom").value.valueOf()
              : undefined,
            dateTo: this.validatingForm.get("dateTo").value
              ? this.validatingForm.get("dateTo").value.valueOf() + this.day
              : today,
            campaignId: this.validatingForm.get("campaignId").value
              ? this.validatingForm.get("campaignId").value
              : undefined,
            status: this.validatingForm.get("status").value
              ? this.validatingForm.get("status").value.toUpperCase()
              : undefined,
            toCheck: this.validatingForm.get("toCheck").value === false || this.validatingForm.get("toCheck").value === true
            ? this.validatingForm.get("toCheck").value
            : undefined
          })
          .subscribe((res) => {
            this.listTrack = res.content;
            this.setTableData();
          });
      } catch (error) {
        console.error(error);
      }
    }
  }

  changeDateFrom() {
    this.resetPageNumber();
    this.dateFromModified = true;
  }
  changeDateTo() {
    this.resetPageNumber();
    this.dateToModified = true;
  }

  resetPageNumber() {
    this.resetSearchFieldsComponents = true;
  }

  allowResetOnsearch() {
    this.currentPageNumber = 0;
    this.dataSource.paginator = this.paginator;
  }

  onSelectUserFromRankingList(row: any){
    this.selectedRankingUser = row;
    //set search fields;
    this.validatingForm.patchValue({
      trackId: undefined,
      playerId: row.playerId,
      modeType: undefined,
      dateFrom: this.validatingFormRanking.get('dateFrom').value,
      dateTo: this.validatingFormRanking.get('dateTo').value,
      campaignId: this.validatingFormRanking.get('campaignId').value,
      status: undefined,
    });
    this.currentPageNumber = 0;
    this.searchSubmit();
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

  drawPolyline(arrayPoints: any[]) {
    // any[] = GeolocationClass
    var latlngs = [];
    try {
      if (this.layerGroup) {
        this.map.removeLayer(this.layerGroup);
        this.layerGroup = undefined;
        this.markerLayers.forEach((item) => {
          if (!!item) this.map.removeLayer(item["layer"]);
        });
      }
    } catch (error) {}
    for (let element of arrayPoints) {
      latlngs.push([element.geocoding[1], element.geocoding[0]]);
    }
    var polyline = L.polyline(latlngs, { color: "blue" }); // ,weight:10
    this.layerGroup = new L.LayerGroup([polyline]);
    this.layerGroup.addTo(this.map);
    this.map.fitBounds(latlngs);
    //this.map.setView(latlngs[0], 15);
  }

  highlightTrack(toDraw: boolean){
    var latlngs = [];
    this.highligthTrackCheck = toDraw;
    try{
      if (this.polylineHighligthLayer) {
        this.map.removeLayer(this.polylineHighligthLayer);
        this.polylineHighligthLayer = undefined;
      }
    }catch(error){}
    if(toDraw){
      for (let element of  this.selectedTrack.trackedInstance.geolocationEvents) {
        latlngs.push([element.geocoding[1], element.geocoding[0]]);
      }
      var polyline = L.polyline(latlngs, { color: "blue",weight:10 }); // ,weight:10
      this.polylineHighligthLayer = new L.LayerGroup([polyline]);
      this.polylineHighligthLayer.addTo(this.map);
    }
  }

  public initializeMap(map: Map): void {
    this.restoreMap = map;
    this.map = map;
    fullScreenMap({ id: 'map', position: 'topleft' }).addTo(this.map);
    this.drawRayOnMap();
    this.drawPolyline(this.selectedTrack.trackedInstance.geolocationEvents);
    this.markerLayers = [];
    for (
      let i = 0;
      i < this.selectedTrack.trackedInstance.geolocationEvents.length;
      i++
    ) {
      this.markerLayers.push(undefined);
    }
    var start = [
      this.selectedTrack.trackedInstance.geolocationEvents[0].geocoding[1],
      this.selectedTrack.trackedInstance.geolocationEvents[0].geocoding[0],
    ];
    this.addStartMarker(start);
    const length = this.selectedTrack.trackedInstance.geolocationEvents.length;
    if (length > 1) {
      var end = [
        this.selectedTrack.trackedInstance.geolocationEvents[length - 1]
          .geocoding[1],
        this.selectedTrack.trackedInstance.geolocationEvents[length - 1]
          .geocoding[0],
      ];
      this.addEndMarker(end);
    }
  }

  showPoint( row: GeolocationEventsClass) {
    //row => GeolocationClass
    var icon = L.divIcon({
      className: "number-icon",
      iconSize: [25, 41],
      iconAnchor: [12, 43],
      html: (row.index + 1).toString(),
    });

    if (!!this.markerLayers[row.index]) {
      //defined
      try {
        this.map.removeLayer(this.markerLayers[row.index]["layer"]);
        this.markerLayers[row.index] = undefined;
      } catch {}
    } else {
      //undefined
      const popup =
        "<h3>point number: " +
        (row.index + 1) +
        "</h3></br><h4>lat: " +
        row.geocoding[1] +
        " - long: " +
        row.geocoding[0] +
        "</h4>";
      var marker = L.marker([row.geocoding[1], row.geocoding[0]], {
        icon: icon,
        // draggable: true,
      });
      marker.on('dragstart', (e)=>{this.current_moving_pointer_leaflet_id=marker["_leaflet_id"]; })
      .on('drag', (e)=>{this.movePolylineOnMarkerMove(e["latlng"])})
      .on('dragend', (e)=>{this.save_button_new_poly = true;});
      const markers = this.markerLayers[row.index]
        ? this.markerLayers[row.index]["markers"].push(marker)
        : [marker];
      this.markerLayers[row.index] = {
        layer: new L.LayerGroup(markers),
        markers: markers,
        popup: popup,
      };
      this.markerLayers[row.index]["layer"].addTo(this.map);
    }
  }

  addStartMarker(point: any) {
    var icon = L.icon({
      iconUrl: "/../../../assets/images/start-marker.png", // /dslab.playgo-backoffice/src/assets/images/start-marker.png
      iconSize: [25, 41],
      iconAnchor: [12, 43],
    });
    if (!!this.startMarker) {
      //defined
      try {
        this.map.removeLayer(this.startMarker);
        var marker = L.marker([point[0], point[1]], { icon: icon });
        this.startMarker = new L.LayerGroup([marker]);
        this.startMarker.addTo(this.map);
      } catch {}
    } else {
      var marker = L.marker([point[0], point[1]], { icon: icon });
      this.startMarker = new L.LayerGroup([marker]);
      this.startMarker.addTo(this.map);
    }
  }

  addEndMarker(point: any) {
    var icon = L.icon({
      iconUrl: "/../../../assets/images/stop-marker.png", // /dslab.playgo-backoffice/src/assets/images/stop-marker.png
      iconSize: [25, 41],
      iconAnchor: [12, 43],
    });
    if (!!this.stopMarker) {
      //defined
      try {
        this.map.removeLayer(this.stopMarker);
        var marker = L.marker([point[0], point[1]], { icon: icon });
        this.stopMarker = new L.LayerGroup([marker]);
        this.stopMarker.addTo(this.map);
      } catch {}
    } else {
      var marker = L.marker([point[0], point[1]], { icon: icon });
      this.stopMarker = new L.LayerGroup([marker]);
      this.stopMarker.addTo(this.map);
    }
  }

  showAllDataOnMap() {
    this.showAllPoints = !this.showAllPoints;
    if(this.someComplete()){
      if(this.showAllPoints){
        this.restShowedPoints();
        this.showAllPoints = true; 
        var i = 0;
        for (let item of this.selectedTrack.trackedInstance.geolocationEvents) {
          this.showPoint(item);
          i++;
        }
        this.restShowedPoints();
      }else{
        this.restShowedPoints();
        this.showAllPoints = false; 
        var i = 0;
        for (let item of this.selectedTrack.trackedInstance.geolocationEvents) {
          this.showPoint(item);
          i++;
        }
      }
    }else{
      var i = 0;
      for (let item of this.selectedTrack.trackedInstance.geolocationEvents) {
        this.showPoint(item);
        i++;
      }
    }
  }

  restShowedPoints() {
    this.showAllPoints = true;
    let i = 0;
    for (let item of this.selectedTrack.trackedInstance.geolocationEvents) {
      try {
        if (this.markerLayers[i]) {
          this.map.removeLayer(this.markerLayers[i]["layer"]);
          this.markerLayers[i] = undefined;
        }
        i++;
      } catch {i++;}
    }
  }

  someComplete(): boolean {
    let i = 0;
    let someComplete = false;
    let allComplete = true;
    for (let item of this.selectedTrack.trackedInstance.geolocationEvents) {
      try {
        if (this.markerLayers[i]) {
          someComplete = true;
        }else{
          allComplete = false;
        }
        i++;
      } catch {}
    }
    if(allComplete){
      return false
    }
    return someComplete;
  }

  changeStatus() {
    const dialogRef = this.dialogStatus.open(StatusDialogComponent, {
      width: "60%",
    });
    let instance = dialogRef.componentInstance;
    instance.selectedTrack = this.selectedTrack;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.trackingService
          .getTrackedInstanceDetailUsingGET({
            territoryId: this.territoryId,
            trackId: this.selectedTrack.trackedInstance.id,
          })
          .subscribe((fullDetails) => {
            this.selectedTrack = fullDetails;
          });
      }
    });
  }

  changeToCheck(){
    if(this.toCheckForm.get("toCheck").value != null){
      this.trackingService.modifyToCheckUsingPUT({
        toCheck: this.toCheckForm.get("toCheck").value,
        trackId: this.selectedTrack.trackedInstance.id,
      }).subscribe(()=>{this.selectedTrack.trackedInstance.toCheck = this.toCheckForm.get("toCheck").value});
    }
  }

  translateForToCheckValue(value): string{
    if(value === null){
      return "nullToCheckValue";
    }
    if(value){
      return "trueToCheck";
    }else{
      return "falseToCheck";
    }
    
  }

  selectedRowOnTrack(index: number): boolean {
    if (this.markerLayers) {
      if (!!this.markerLayers[index]) {
        return true;
      }
    }
    return false;
  }

  obejectFromString(s: string): any {
    if (s === "null") {
      return {
        available: false,
        platform: "-",
        version: "-",
        uuid: "-",
        cordova: "-",
        model: "-",
        manufacturer: "-",
        isVirtual: false,
        serial: "-",
        codePushLabel: '-',
        osVersion: '-'
      };
    }

    try {
      if (!!s && s !== null) return JSON.parse(s);
    } catch {}
    return {
      available: true,
      platform: "-",
      version: "-",
      uuid: "-",
      cordova: "-",
      model: "-",
      manufacturer: "-",
      isVirtual: false,
      serial: "-",
      codePushLabel: '-',
      osVersion: '-'
    };
  }

  transformDateToString(date: Moment, startDay?: boolean): string {
    const dateFormat: Date = date ? date.toDate() : undefined;
    var dateString = dateFormat
      ? dateFormat.toISOString().replace("Z", "").replace("T", " ")
      : undefined;
    if (startDay) {
      if (dateString)
        return (
          dateString.substring(0, dateString.length - "00:00:00.000".length) +
          "00:00:00"
        );
      else return undefined;
    }
    if (dateString)
      return (
        dateString.substring(0, dateString.length - "00:00:00.000".length) +
        "23:59:59"
      );
    else return undefined;
  }

  switchTrackToRanking(){
    this.showTierFilter = !this.showTierFilter;
    this.currentPageNumber = 0;
    this.validatingForm.patchValue({
      trackId: undefined,
      playerId: undefined,
      modeType: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      campaignId: undefined,
      status: undefined,
      toCheck: undefined,
    });
    this.selectedTrack = undefined;
    const monday = this.getPreviousMonday();
    const sunday = this.getNextSunday();
    if(!this.showTierFilter){
      //enter trip filter
      this.validatingForm.patchValue({
        dateFrom: moment(monday, "YYYY-MM-DD"),
        dateTo: moment(sunday, "YYYY-MM-DD"),
      });
      this.searchSubmit();
      this.rankingUsersList =[];
      this.setTableDataRankingUsers();
    }else{
      //enter ranking filter
      //reset searched tracks
      this.validatingFormRanking.patchValue({
        dateFrom: moment(monday, "YYYY-MM-DD"),
        dateTo: moment(sunday, "YYYY-MM-DD"),
        campaignId: undefined
      });
      this.listTrack= [];
      this.setTableData();
    }
  }

  revalidateTrack(campaign: CampaignTripInfo){
    console.log(this.territoryId,campaign.campaignId,this.selectedTrack.trackedInstance.id);
    this.trackingServiceInternal.revalidateTrackUsingGET({    
      territoryId: this.territoryId,
      campaignId: campaign.campaignId,
      trackedInstanceId: this.selectedTrack.trackedInstance.id
    }).subscribe(res=>{
      this._snackBar.open(this.translate.instant('rivalidationInProgress'), this.translate.instant('close'), {
        duration: 7500
      });
    });

  }

  createDate(timestamp: number,secondsDisplay = true): string {
    const date = DateTime.fromMillis(timestamp, {
      zone: this.territorySelected.timezone,
    });
    if(!secondsDisplay){
      return date.toFormat("yyyy-MM-dd HH:mm");
    }
    return date.toFormat("yyyy-MM-dd HH:mm:ss");
  }

  visualizeAllPublicTracks(checked : boolean):void{
    this.selectAllCheckbox = checked;
    if(this.publicTransportTracks){
      for(let i=0;i<this.publicTransportTracks.length;i++){
        this.publicTransportTracks[i].visualize = checked;
        this.displayPublicTrack(checked,this.publicTransportTracks[i]);
      }
    }
  }

  displayPublicTrack(checked: boolean,item: any): void{
    if(checked){
      if(this.layerPublicTransportTracks[item.index] === undefined){
        var iconStart = L.icon({
          iconUrl: "/../../../assets/images/start-marker-transport.png", // /dslab.playgo-backoffice/src/assets/images/stop-marker.png
          iconSize: [25, 41],
          iconAnchor: [12, 43],
        });
        var iconEnd = L.icon({
          iconUrl: "/../../../assets/images/stop-marker-transport.png", // /dslab.playgo-backoffice/src/assets/images/stop-marker.png
          iconSize: [25, 41],
          iconAnchor: [12, 43],
        });
        var markerStart = L.marker(item.polyline[0], { icon: iconStart });
        var markerEnd = L.marker(item.polyline[item.polyline.length-1], { icon: iconEnd });
        var polyline = L.polyline(item.polyline, { color: "black" });
        this.layerPublicTransportTracks[item.index] = new L.LayerGroup([polyline,markerStart,markerEnd]); 
        this.layerPublicTransportTracks[item.index].addTo(this.map);
      }
    }else{
      if(this.layerPublicTransportTracks[item.index]!== undefined){
        this.map.removeLayer(this.layerPublicTransportTracks[item.index]);
      }
      this.layerPublicTransportTracks[item.index] = undefined;
    }
  }

  cleanPublicTrack(){
    this.current_moving_pointer_leaflet_id = null;
    this.save_button_new_poly= false;
    this.highligthTrackCheck= false;
    this.selectAllCheckbox= false;
    this.highlightTrack(false);
    document.getElementById("highlightCheckbox")
    if(!this.showAllPoints){
      this.showAllPoints = true;
    }
    this.visualizeAllPublicTracks(false);
    if(this.layerPublicTransportTracks){
      this.layerPublicTransportTracks.forEach((item)=>{
        if(this.map && item)
          this.map.removeLayer(item);
      });
    }

  }

  movePolylineOnMarkerMove(latLong: any){
    this.markerLayers.forEach((layer,index)=>{
      if(layer["markers"][0]["_leaflet_id"]===this.current_moving_pointer_leaflet_id){
        //this.selectedTrack.trackedInstance.geolocationEvents[index] = new Geolocation();
        this.drawPolylineOnMarkerMove(this.selectedTrack.trackedInstance.geolocationEvents,index,latLong);
      }
    });
  }

  drawPolylineOnMarkerMove(arrayPoints: any[],index, latLong) {
    // any[] = GeolocationClass
    var latlngs = [];
    if(this.layerGroup){
      this.map.removeLayer(this.layerGroup);
    }
    for (let i=0;i<arrayPoints.length;i++) {
      if(i!=index){
        latlngs.push([arrayPoints[i].geocoding[1], arrayPoints[i].geocoding[0]]);
      }else{
        this.selectedTrack.trackedInstance.geolocationEvents[i].geocoding[1] = latLong["lat"];
        this.selectedTrack.trackedInstance.geolocationEvents[i].geocoding[0] = latLong["lng"];
        latlngs.push([latLong["lat"], latLong["lng"]]);
      }
    }
    var polyline = L.polyline(latlngs, { color: "blue" });
    this.layerGroup = new L.LayerGroup([polyline]);
    this.layerGroup.addTo(this.map);
  }

  saveNewTrack(){
    console.log("To implement save new Track");
    // TODO
  }

  getCarPoolingUserType(id: string){
    if(!!!id || id===null){
      return null;
    }
    else{
      if(id.toLocaleUpperCase().charAt(0)==='D'){
        return "driver";
      }
      else {
        if(id.toLocaleUpperCase().charAt(0)==='P'){
          return "passenger";
        }else{
          return null;
        }
      }
    }

  }


  drawRayOnMap() {
    this.territoryService
      .getTerritoryUsingGET(this.territoryId)
      .subscribe((selectedTerritory) => {
        this.selectedTerritoryArea = new GameArea();
        this.selectedTerritoryArea.latitude =
          +selectedTerritory.territoryData.area[0].lat;
        this.selectedTerritoryArea.longitude =
          +selectedTerritory.territoryData.area[0].long;
        this.selectedTerritoryArea.radius =
          +selectedTerritory.territoryData.area[0].radius;
        if (this.circleLayer !== undefined) {
          if (!!this.map) this.map.removeLayer(this.circleLayer);
        }
        const numberRay = this.selectedTerritoryArea.radius;
        this.circleLayer = L.featureGroup();
        if (numberRay > 0) {
          L.circle(
            [
              this.selectedTerritoryArea.latitude,
              this.selectedTerritoryArea.longitude,
            ],
            numberRay
          ).addTo(this.circleLayer);
        }
        if (!!this.map) {
          this.map.addLayer(this.circleLayer);
        }
      });
  }
}

interface StatisticsTracks {
  pending?: number;
  valid?: number;
  invalid?: number;
}

interface SelectedTrackStatistic {
  start?: string;
  end?: string;
  distance?: number;
  validity?: string;
  avrgSpeed?: number;
  maxSpeed?: number;
}
 
class GeolocationEventsClass implements GeoLocationEvent{
  accuracy?: number;
  activityConfidence?: number;
  activityType?: string;
  altitude?: number;
  batteryIsCharging?: boolean;
  batteryLevel?: number;
  certificate?: string;
  createdAt?: number;
  deviceId?: string;
  deviceModel?: string;
  geocoding?: Array<number>;
  geofence?: any;
  heading?: number;
  isMoving?: boolean;
  latitude?: number;
  longitude?: number;
  multimodalId?: string;
  recordedAt?: number;
  sharedTravelId?: string;
  speed?: number;
  travelId?: string;
  userId?: string;
  uuid?: string;
  index?: number;
} 