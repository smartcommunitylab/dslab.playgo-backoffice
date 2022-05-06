import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Track } from 'src/app/shared/classes/track-class';
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from 'src/app/shared/constants/constants';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConsoleControllerService } from 'src/app/core/api/generated/controllers/consoleController.service';
import { PageTrackedInstanceClass, TrackedInstanceClass, TrackedInstanceConsoleClass } from 'src/app/shared/classes/PageTrackedInstance-class';
import { PlayerControllerService } from 'src/app/core/api/generated/controllers/playerController.service';

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
  ]
})
export class ValidationTrackComponent implements OnInit {

  territoryId:string;
  state: string="collapsed";
  size: number[] = [15];
  pageNumber: number = 0;
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  dataSource: MatTableDataSource<TrackedInstanceConsoleClass>;
  displayedColumns: string[] = ["trackId", "playerId"];
  selectedTrack: TrackedInstanceConsoleClass;
  selectedRowIndex: string;
  currentPageNumber:number =0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listTrack: TrackedInstanceConsoleClass[];
  stringall: string;

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
      this.pageNumber,
      this.size[0],
      this.territoryId
    ).subscribe((res)=>{
      console.log(res);
      this.paginatorData = res;
      this.listTrack = res.content;
      this.setTableData();
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
    this.dataSource.paginator = this.paginator;
  }

  searchSubmit(){
    if(this.validatingForm.valid){
      this.trackingService.searchTrackedInstanceUsingGET(
        this.pageNumber,
        this.size[0],
        this.territoryId,
        this.validatingForm.get("sort").value,
        this.validatingForm.get("trackId").value,
        this.validatingForm.get("playerId").value,
        this.validatingForm.get("modelType").value,
        this.validatingForm.get("dateFrom").value,
        this.validatingForm.get("dateTo").value,
        this.validatingForm.get("campaignId").value,
        this.validatingForm.get("status").value,
      ).subscribe(() =>{

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
        //   this.mapUserCampaignRecieved.get(pageIndex);
        // if (!!list && list.length > 0) {
        //   this.listUserCampaign = list;
        //   this.setTableData();
        // } else {
        //   this.playerService
        //     .getPlayers(
        //       pageIndex,
        //       this.pageSizesOnTable[0],
        //       this.sorting,
        //       this.territoryId,
        //       this.searchString
        //     )
        //     .subscribe((res) => {
        //       this.setMapUserCampaign(res);
        //       this.setTableData();
        //     });
        // }
      } catch (error) {
        console.error(error);
      }
    }
  }

}
