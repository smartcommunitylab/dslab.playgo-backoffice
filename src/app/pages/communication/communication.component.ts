import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CampaignControllerService } from 'src/app/core/api/generated/controllers/campaignController.service';
import { NotificationControllerService } from 'src/app/core/api/generated/controllers/notificationController.service';
import { TerritoryControllerService } from 'src/app/core/api/generated/controllers/territoryController.service';
import { PageAnnouncement } from 'src/app/core/api/generated/model/pageAnnouncement';
import { AnnouncementClass } from 'src/app/shared/classes/announcment-class';
import { PageTrackedInstanceClass } from 'src/app/shared/classes/PageTrackedInstance-class';
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from 'src/app/shared/constants/constants';
import { CommunicationAddComponent } from './communication-add/communication-add.component';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {

  dataSource:MatTableDataSource<AnnouncementClass>;
  displayedColumns = ["title","when","channel"];
  size=[50];
  territoryId:string;
  paginator: PageAnnouncement;
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  communications: AnnouncementClass[] = [];
  newItem: AnnouncementClass;
  communicationSelected: AnnouncementClass;
  searchString:string;
  listCampaings: any[] = [];
  selectedCampaigns: any[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private dialogCreate: MatDialog,
    private communicationService: NotificationControllerService,
    private campaignService: CampaignControllerService,
    private territoryService: TerritoryControllerService,
    ) { }

  ngOnInit(): void {
      this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
      this.communicationService.getNotificationsUsingGET(
        {territoryId: this.territoryId}).subscribe((result)=>{
        console.log(result);
        this.paginator = result;
        if(!!result.content){
          this.communications = result.content;
          this.setTableData();
        }
      },
      (error)=>{
        console.log("myError: ", error);
      });

    this.campaignService
    .getCampaignsUsingGET({ territoryId: this.territoryId })
    .subscribe((campaigns) => {
      campaigns.forEach((item) => {
        this.listCampaings.push(item.campaignId);
      });
    });
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<AnnouncementClass>(this.communications);
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.sort;
  }

  addComunication(){
    const dialogRef = this.dialogCreate.open(CommunicationAddComponent, {
      width: "80%",
    });
    let instance = dialogRef.componentInstance;
    instance.territoryId = this.territoryId;

    dialogRef.afterClosed().subscribe((result: AnnouncementClass) => {
      if (result !== undefined) {
        this.newItem = result;
        this.communications.push(result);
        this.setTableData();
      }
    });
  }

  fromTimestampToDate(timestamp: any) : string{
    let a;
    if(typeof(timestamp)==='string'){
      a = new Date(parseInt(timestamp));

    }else{
      a = new Date(timestamp);
    }
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    //var month = months[a.getMonth()+1];
    var month = a.getMonth()+1
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year;
    return time;
  }

  selectedCommunication(row){
    this.communicationSelected = row;
    if(this.communicationSelected.title === this.newItem.title){
      this.newItem = new AnnouncementClass();
      this.newItem.title = '';
    }
  }

  selectedPageSize(event: any) {
    if (!!event) {
    //   const pageIndex = event.pageIndex;
    //   this.currentPageNumber = pageIndex;
    //   try {
    //     const list: Track[] = [];
    //     // var dateFromString;
    //     // if(this.dateFromModified){
    //     //   dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,false); 
    //     // }else{
    //     //   dateFromString =  this.transformDateToString(this.validatingForm.get("dateFrom").value,true); 
    //     // }
    //     // var dateToString;
    //     // if(this.dateToModified){
    //     //   dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,false);
    //     // }else{
    //     //   dateToString = this.transformDateToString(this.validatingForm.get("dateTo").value,true);
    //     // }
    //     // dateToString = dateToString ? dateToString :this.transformDateToString(moment());  
    //     this.trackingServiceInternal
    //       .searchTrackedInstanceUsingGET(
    //         {
    //           page: this.currentPageNumber,
    //           size: this.size[0],
    //           territoryId: this.territoryId,
    //           sort: this.SORTING,
    //           trackId: this.validatingForm.get("trackId").value ? this.validatingForm.get("trackId").value : undefined ,
    //           playerId: this.validatingForm.get("playerId").value ? this.validatingForm.get("playerId").value : undefined,
    //           modeType: this.validatingForm.get("modeType").value ? this.validatingForm.get("modeType").value : undefined,
    //           dateFrom: this.validatingForm.get("dateFrom").value.valueOf(),
    //           dateTo: this.validatingForm.get("dateTo").value.valueOf(),
    //           campaignId: this.validatingForm.get("campaignId").value ? this.validatingForm.get("campaignId").value : undefined,
    //           status: this.validatingForm.get("status").value ? this.validatingForm.get("status").value.toUpperCase() : undefined
    //         }
    //       )
    //       .subscribe((res) => {
    //         this.listTrack = res.content;
    //         this.setTableData();
    //       });
    //   } catch (error) {
    //     console.error(error);
    //   }
    }
  }

  searchCommunication(event:any){
    console.log(this.selectedCampaigns, this.searchString);
    //TODO 
  }


}
