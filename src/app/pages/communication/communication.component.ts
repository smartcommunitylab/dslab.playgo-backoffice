import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { NotificationControllerService } from "src/app/core/api/generated/controllers/notificationController.service";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { PageAnnouncement } from "src/app/core/api/generated/model/pageAnnouncement";
import { AnnouncementClass } from "src/app/shared/classes/announcment-class";
import { PageTrackedInstanceClass } from "src/app/shared/classes/PageTrackedInstance-class";
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from "src/app/shared/constants/constants";
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
  paginator: PageAnnouncement;
  paginatorData: PageTrackedInstanceClass = new PageTrackedInstanceClass();
  communications: AnnouncementClass[] = [];
  newItem: AnnouncementClass;
  communicationSelected: AnnouncementClass;
  searchString: string;
  listCampaings: any[] = [];
  selectedCampaign: string;
  page = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(
    private dialogCreate: MatDialog,
    private communicationService: NotificationControllerService,
    private campaignService: CampaignControllerService,
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.getNotificationUsingGet();

    this.campaignService
      .getCampaignsUsingGET({ territoryId: this.territoryId })
      .subscribe((campaigns) => {
        campaigns.forEach((item) => {
          this.listCampaings.push(item.campaignId);
        });
      });
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<AnnouncementClass>(
      this.communications
    );
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.sort;
  }

  addComunication() {
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
    if (this.communicationSelected.title === this.newItem.title) {
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
    console.log(this.selectedCampaign, this.searchString);
    this.getNotificationUsingGet();
  }

  getNotificationUsingGet(){
    this.communicationService
    .getNotificationsUsingGET({
      page: this.page,
      size: this.size[0],
      territoryId: this.territoryId,
      campaignId: this.selectedCampaign,
      channels: this.searchString,
    })
    .subscribe(
      (result) => {
        if (!!result.content) {
          this.communications = result.content;
          this.setTableData();
        }
      },
      (error) => {
        console.log("myError: ", error);
      }
    );
  }

}
