import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Track } from 'src/app/shared/classes/track-class';
import { MY_DATE_FORMATS, TERRITORY_ID_LOCAL_STORAGE_KEY } from 'src/app/shared/constants/constants';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConsoleControllerService } from 'src/app/core/api/generated/controllers/consoleController.service';
import { PageTrackedInstanceClass, TrackedInstanceConsoleClass } from 'src/app/shared/classes/PageTrackedInstance-class';
import { PlayerControllerService } from 'src/app/core/api/generated/controllers/playerController.service';
import { Moment } from 'moment';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";

@Component({
  selector: 'app-validation-track',
  templateUrl: './validation-track.component.html',
  styleUrls: ['./validation-track.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
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

  territoryId:string;
  state: string="collapsed";
  size: number[] = [15];
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  dataSource: MatTableDataSource<TrackedInstanceConsoleClass>;
  displayedColumns: string[] = ["trackId", "playerId"];
  selectedTrack: TrackedInstanceConsoleClass;
  selectedRowIndex: string;
  currentPageNumber:number =0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listTrack: TrackedInstanceConsoleClass[];
  stringall: string;
  listSorting = ['ascending','descending'];
  listModelType = ['notSureYEt','notSureYEtt'];
  listStates =['valid', 'invalid'];

  validatingForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private trackingService: ConsoleControllerService,
    private playerService: PlayerControllerService
    ) { }

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.initializaValidatingForm();
    this.trackingService.searchTrackedInstanceUsingGET(
      this.currentPageNumber,
      this.size[0],
      this.territoryId
    ).subscribe((res)=>{
      this.paginatorData = res;
      this.listTrack = res.content;
      this.setTableData();
      this.dataSource.paginator = this.paginator;
    });
  }

  initializaValidatingForm() {
    this.validatingForm = this.formBuilder.group({
      sort: new FormControl(""),
      trackId: new FormControl(""),
      playerId: new FormControl(""),
      modelType: new FormControl(""),
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      campaignId: new FormControl(""),
      status: new FormControl(""),
    });
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.listTrack);
  }

  searchSubmit(){
    if(this.validatingForm.valid){
      const dateFromMom: Moment =this.validatingForm.get("dateFrom").value;
      const dateFrom = dateFromMom ? dateFromMom.toDate() : undefined;
      const dateToMom: Moment = this.validatingForm.get("dateTo").value;
      const dateTo = dateToMom ? dateFromMom.toDate() : undefined;
      console.log(dateFrom,dateTo);
      this.trackingService.searchTrackedInstanceUsingGET(
        this.currentPageNumber,
        this.size[0],
        this.territoryId,
        this.validatingForm.get("sort").value,
        this.validatingForm.get("trackId").value,
        this.validatingForm.get("playerId").value,
        this.validatingForm.get("modelType").value,
        dateFrom,
        dateTo,
        this.validatingForm.get("campaignId").value,
        this.validatingForm.get("status").value,
      ).subscribe((res) =>{
        this.paginatorData = res;
        this.listTrack = res.content;
        this.setTableData();
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  toggle(){
    if(this.state==='collapsed'){
      this.state = 'expanded';
    }else{
      this.state = 'collapsed';
    }
  }

  showTrack(row : TrackedInstanceConsoleClass){
    this.selectedTrack = row;
    this.selectedRowIndex = row.trackedInstance.id;
    this.stringall = JSON.stringify(this.selectedTrack).replace(",","\n");
  }

  resetSearchFields(){
    this.validatingForm = this.formBuilder.group({
      sort: new FormControl(""),
      trackId: new FormControl(""),
      playerId: new FormControl(""),
      modelType: new FormControl(""),
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
        const dateFromMom: Moment =this.validatingForm.get("dateFrom").value;
        const dateFrom : Date = dateFromMom ? dateFromMom.toDate() : undefined;
        const dateToMom: Moment = this.validatingForm.get("dateTo").value;
        const dateTo : Date = dateToMom ? dateFromMom.toDate() : undefined;
        this.trackingService.searchTrackedInstanceUsingGET(
          this.currentPageNumber,
          this.size[0],
          this.territoryId,
          this.validatingForm.get("sort").value,
          this.validatingForm.get("trackId").value,
          this.validatingForm.get("playerId").value,
          this.validatingForm.get("modelType").value,
          dateFrom,
          dateTo,
          this.validatingForm.get("campaignId").value,
          this.validatingForm.get("status").value,
        ).subscribe((res)=>{
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
    if(day.length===1){
      day = "0"+day;
    }
    var month = (+datee.toObject().months.toString() + 1).toString();
    if(month.length===1){
      month = "0"+month;
    }
    const year = datee.toObject().years.toString();
    return year + "-" + month + "-" + day;
  }

}
