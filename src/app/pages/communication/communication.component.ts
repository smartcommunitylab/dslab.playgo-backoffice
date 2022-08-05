import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { NotificationControllerService } from "src/app/core/api/generated/controllers/notificationController.service";
import { Announcement } from "src/app/core/api/generated/model/announcement";
import { PageAnnouncement } from "src/app/core/api/generated/model/pageAnnouncement";
import { AnnouncementClass } from "src/app/shared/classes/announcment-class";
import { PageTrackedInstanceClass } from "src/app/shared/classes/PageTrackedInstance-class";
import { TERRITORY_ID_LOCAL_STORAGE_KEY, VALUE_EMPTY_SELECT_LIST } from "src/app/shared/constants/constants";
import { CommunicationAddComponent } from "./communication-add/communication-add.component";

@Component({
  selector: "app-communication",
  templateUrl: "./communication.component.html",
  styleUrls: ["./communication.component.scss"],
})
export class CommunicationComponent implements OnInit {
  dataSource: MatTableDataSource<AnnouncementClass>;
  displayedColumns = ["title", "when", "channel"];
  size = [50];
  territoryId: string;
  sorting: string = "from,desc";
  paginator: PageAnnouncement;
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  communications: AnnouncementClass[] = [];
  newItem: AnnouncementClass;
  communicationSelected: AnnouncementClass;
  searchString: string = VALUE_EMPTY_SELECT_LIST;
  listCampaings: string[] = [];
  selectedCampaign: string;
  listComunications:string[] =[VALUE_EMPTY_SELECT_LIST];
  page = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private dialogCreate: MatDialog,
    private translate: TranslateService,
    private communicationService: NotificationControllerService,
    private campaignService: CampaignControllerService,
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.campaignService
      .getCampaignsUsingGET({ territoryId: this.territoryId })
      .subscribe((campaigns) => {
        this.listCampaings.push(this.translate.instant(VALUE_EMPTY_SELECT_LIST));
        campaigns.forEach((item) => {
          this.listCampaings.push(item.campaignId);
        });
        if(this.listCampaings.length>0){
          this.selectedCampaign = this.listCampaings[0];
        }
        
        this.getNotificationUsingGet();
      });
     Object.keys(Announcement.ChannelsEnum).forEach((item)=>{
      this.listComunications.push(Announcement.ChannelsEnum[item]);
     });

  }

  setTableData() {
    this.dataSource = new MatTableDataSource<AnnouncementClass>(
      this.communications
    );
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'title': return item.title;
        case 'when': return item.timestamp;
        case 'channel': return item.channels.toString();
      }
    };
  }

  addComunication() {
    const dialogRef = this.dialogCreate.open(CommunicationAddComponent, {
      width: "80%",
      height: "750px",
      disableClose: true,
      panelClass: 'custom-dialog-container' 
    });
    let instance = dialogRef.componentInstance;
    instance.territoryId = this.territoryId;

    dialogRef.afterClosed().subscribe((result: AnnouncementClass) => {
      if (result !== undefined) {
        this.newItem = result;
        const p = this.communications
        this.communications = [result];
        p.forEach(item=>{this.communications.push(item)});
        this.setTableData();
      }
    });
  }

  fromTimestampToDate(timestamp: any): string {
    let a;
    if (typeof timestamp === "string") {
      a = new Date(parseInt(timestamp));
    } else {
      a = new Date(timestamp);
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    //var month = months[a.getMonth()+1];
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + "/" + month + "/" + year;
    return time;
  }

  selectedCommunication(row) {
    this.communicationSelected = row;
    if (!!this.communicationSelected && !!this.newItem && this.communicationSelected.title === this.newItem.title) {
      this.newItem = new AnnouncementClass();
      this.newItem.title = "";
    }
  }

  selectedPageSize(event: any) {
    if (!!event) {
      const pageIndex = event.pageIndex;
      this.page = pageIndex;
      this.getNotificationUsingGet();
    }
  }

  searchCommunication(event: any) {
    this.getNotificationUsingGet();
  }

  getNotificationUsingGet(){
    this.communicationService
    .getNotificationsUsingGET({
      page: this.page,
      size: this.size[0],
      sort: this.sorting,
      territoryId: this.territoryId,
      campaignId: this.selectedCampaign ===this.translate.instant(VALUE_EMPTY_SELECT_LIST)? undefined : this.selectedCampaign,
      channels: this.searchString===  VALUE_EMPTY_SELECT_LIST? undefined: this.searchString,
    })
    .subscribe(
      (result) => {
        if (!!result.content) {
          this.communications = result.content;
          this.setTableData();
        }
      },
      (error) => {
        this.communications = [];
        this.setTableData();
        console.error("myError: ", error);
      }
    );
  }

  translateList(list:any[]):string{
    let result =[];
    for(let i=0;i<list.length;i++){
      result.push( this.translate.instant(list[i]));
    }
    return result.join(', ');
  }

}
