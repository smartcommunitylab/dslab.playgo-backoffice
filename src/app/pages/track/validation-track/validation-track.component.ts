import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Track } from "src/app/shared/classes/track-class";
import {
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
import { PlayerControllerService } from "src/app/core/api/generated/controllers/playerController.service";
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
import {
  FeatureGroup,
  icon,
  latLng,
  LeafletMouseEvent,
  Map,
  MapOptions,
  marker,
  tileLayer,
} from "leaflet"; // Draw
import { means } from "src/app/shared/constants/means";
import * as moment from "moment";

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
  dataSourceInfoTrack: MatTableDataSource<GeolocationClass[]>; 
  displayedColumnsTrack: string[] = ["pos","ts","accuracy","activity"];
  dataSource: MatTableDataSource<TrackedInstanceConsoleClass>;
  displayedColumns: string[] = ["tracks"];
  selectedTrack: TrackedInstanceConsoleClass;
  selectedRowIndex: string;
  currentPageNumber: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listTrack: TrackedInstanceConsoleClass[];
  stringall: string;
  listSorting = ["ascending", "descending"];
  listModelType = means;
  listStates = ["valid", "invalid"];
  validationJson = VALIDATIONJSON;

  validatingForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private trackingService: ConsoleControllerService,
    private playerService: PlayerControllerService
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.initializaValidatingForm();
    this.trackingService
      .searchTrackedInstanceUsingGET(
        this.currentPageNumber,
        this.size[0],
        this.territoryId
      )
      .subscribe((res) => {
        this.paginatorData = res;
        this.listTrack = res.content;
        this.setTableData();
        this.dataSource.paginator = this.paginator;
      });
    this.initializeMapOptions();
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
    });
  }

  getPreviousMonday() {
    var date = new Date();
    var day = date.getDay();
    var prevMonday = new Date();
    if (date.getDay() == 0) {
      prevMonday.setDate(date.getDate() - 14);
    } else {
      prevMonday.setDate(date.getDate() - (day-1) -7);
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

  getDateFromTimeStamp(timestamp: any){
    var date = new Date(timestamp);
    return date.getDate()+
    "/"+(date.getMonth()+1)+
    "/"+date.getFullYear()+
    " "+date.getHours()+
    ":"+date.getMinutes();
  }

  searchSubmit() {
    if (this.validatingForm.valid) {
      const dateFromMom: Moment = this.validatingForm.get("dateFrom").value;
      const dateFrom = dateFromMom ? dateFromMom.toDate() : undefined;
      const dateToMom: Moment = this.validatingForm.get("dateTo").value;
      const dateTo : Date = dateToMom ? dateFromMom.toDate() : undefined;
      console.log(this.validatingForm,dateFrom, dateTo,this.currentPageNumber,this.size);
      this.trackingService
        .searchTrackedInstanceUsingGET(
          this.currentPageNumber,
          this.size[0],
          this.territoryId,
          this.validatingForm.get("sort").value,
          this.validatingForm.get("trackId").value,
          this.validatingForm.get("playerId").value,
          this.validatingForm.get("modeType").value,
          dateFrom,
          dateTo,
          this.validatingForm.get("campaignId").value,
          this.validatingForm.get("status").value
        )
        .subscribe((res) => {
          console.log("111")
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
    this.selectedTrack = row;
    this.selectedRowIndex = row.trackedInstance.id;
    this.dataSourceInfoTrack = new MatTableDataSource<any>(row.trackedInstance.geolocationEvents);
    this.drawPolyline(this.selectedTrack.trackedInstance.geolocationEvents);
    this.stringall = JSON.stringify(this.selectedTrack).replace(",", "\n");
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
  }

  selectedPageSize(event: any) {
    if (!!event) {
      const pageIndex = event.pageIndex;
      this.currentPageNumber = pageIndex;
      try {
        const list: Track[] = [];
        const dateFromMom: Moment = this.validatingForm.get("dateFrom").value;
        const dateFrom: Date = dateFromMom ? dateFromMom.toDate() : undefined;
        const dateToMom: Moment = this.validatingForm.get("dateTo").value;
        const dateTo: Date = dateToMom ? dateFromMom.toDate() : undefined;
        this.trackingService
          .searchTrackedInstanceUsingGET(
            this.currentPageNumber,
            this.size[0],
            this.territoryId,
            this.validatingForm.get("sort").value,
            this.validatingForm.get("trackId").value,
            this.validatingForm.get("playerId").value,
            this.validatingForm.get("modeType").value,
            dateFrom,
            dateTo,
            this.validatingForm.get("campaignId").value,
            this.validatingForm.get("status").value
          )
          .subscribe((res) => {
            //this.paginatorData = res;
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

  drawPolyline(arrayPoints: GeolocationClass[]) {
    console.log(arrayPoints);
    // var polylineDrawer = new Draw.Polyline(this.map, {})
    // polylineDrawer.enable();

    // var latlng = L.latLng(48.8583736, 2.2922926);
    // polylineDrawer.addVertex(latlng);
  }

  public initializeMap(map: Map): void {
    this.map = map;
  }
}
