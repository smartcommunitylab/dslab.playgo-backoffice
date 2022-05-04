import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { PlayerHandlerService } from "src/app/shared/services/player-handler.service";
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from "src/app/shared/constants/constants";
import { PlayerCampaign } from "src/app/shared/classes/player-campaing-class";
import { Paginator } from "src/app/shared/classes/paginator-class";
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-handle-users",
  templateUrl: "./handle-users.component.html",
  styleUrls: ["./handle-users.component.scss"],
})
export class HandleUsersComponent implements OnInit {
  pageSizesOnTable = [2];
  territoryId: string;
  searchString: string;
  displayedColumns: string[] = ["email", "nickname", "userId"];
  dataSource: MatTableDataSource<PlayerCampaign>;
  selectedRowIndex = "";
  selectedUser: PlayerCampaign;
  currentPageNumber: number;
  query: string = "";
  sorting: string = "";
  listAllUserCampaign: PlayerCampaign[];
  listUserCampaign: PlayerCampaign[];
  paginatorData: Paginator<PlayerCampaign>;
  mapUserCampaignRecieved: Map<number, PlayerCampaign[]>;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private playerService: PlayerHandlerService,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.paginatorData = new Paginator<PlayerCampaign>();
    this.paginatorData.totalElements = 0; //avoid errors shown
    this.mapUserCampaignRecieved = new Map<number, PlayerCampaign[]>();
    this.dataSource = new MatTableDataSource<PlayerCampaign>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.currentPageNumber = 0;
    try {
      this.playerService
        .getPlayers<PlayerCampaign>(
          0,
          this.pageSizesOnTable[0],
          this.sorting,
          this.territoryId,
          this.query
        )
        .subscribe(
          (res) => {
            this.paginatorData = res;
            this.setMapUserCampaign(res);
            this.setTableData();
          },
          (error) => {
            console.error(error);
          }
        );
    } catch (error) {
      console.error(error);
    }
  }

  setTableData() {
    this.dataSource.data = this.listUserCampaign;
  }

  setMapUserCampaign(paginator: Paginator<PlayerCampaign>) {
    const size = this.pageSizesOnTable[0];
    // assert(size === paginator.size);
    this.mapUserCampaignRecieved.set(paginator.number, paginator.content);
    this.listUserCampaign = paginator.content;
    this.listAllUserCampaign = [];
    for (let i = 0; i < paginator.totalPages; i++) {
      try {
        const itemList: PlayerCampaign[] = this.mapUserCampaignRecieved.get(i);
        if (!!itemList) {
          this.listAllUserCampaign = this.listAllUserCampaign.concat(itemList);
        }
      } catch (error) {
        console.error(error);
      }
    }

    this.listAllUserCampaign.forEach(function(obj) {
      for(var i in obj) { 
        if(!!!obj.player.mail) {
          obj.player.mail = 'null';
        } 
        if(!!!obj.player.nickname) {
          obj.player.nickname = 'null';
        }
        if(!!!obj.player.playerId) {
          obj.player.playerId = 'null';
        }
      }
    });

  }

  searchUser(item: any) {
    this.query = "";
    if (this.searchString === "") {
      this.listUserCampaign = this.mapUserCampaignRecieved.get(
        this.currentPageNumber
      );
      this.setTableData();
    } else {
      let partialListEmail = [];
      let partialListNickName = [];
      let partialListUserID = [];
      partialListEmail = this.listAllUserCampaign.filter((item) =>
        item.player.mail
          .toLocaleLowerCase()
          .includes(this.searchString.toLocaleLowerCase())
      );
      partialListNickName = this.listAllUserCampaign.filter((item) =>
        item.player.playerId
          .toLocaleLowerCase()
          .includes(this.searchString.toLocaleLowerCase())
      );
      partialListUserID = this.listAllUserCampaign.filter((item) =>
        item.player.nickname
          .toLocaleLowerCase()
          .includes(this.searchString.toLocaleLowerCase())
      );
      this.listUserCampaign = this.sumPartialListAvoidRepetitions(
        partialListEmail,
        partialListNickName,
        partialListUserID
      );
      if(this.listUserCampaign.length===0){
        //search on db;
        this.query = this.createQuery();
        this.playerService.getPlayers<PlayerCampaign>(
          this.currentPageNumber,
          this.pageSizesOnTable[0],
          this.sorting,
          this.territoryId,
          this.query).subscribe((res) =>{
          this.listUserCampaign = res.content;
        });
      }
      this.setTableData();
    }
  }

  createQuery(): string{
    console.log("made Query");
    return "";
  }

  sumPartialListAvoidRepetitions(
    listA: PlayerCampaign[],
    listB: PlayerCampaign[],
    listC: PlayerCampaign[]
  ): PlayerCampaign[] {
    let result = listA.concat(listB).concat(listC);
    return result.filter((value, index)=> {
      const _value = JSON.stringify(value);
      return index === result.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      });
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  showUser(row: PlayerCampaign) {
    this.selectedRowIndex = row.player.playerId;
    this.selectedUser = row;
  }

  selectedPageSize(event: any) {
    if (!!event) {
      const pageIndex = event.pageIndex;
      this.currentPageNumber = pageIndex;
      try {
        const list: PlayerCampaign[] =
          this.mapUserCampaignRecieved.get(pageIndex);
        if (!!list && list.length > 0) {
          this.listUserCampaign = list;
          this.setTableData();
        } else {
          this.playerService
            .getPlayers(
              pageIndex,
              this.pageSizesOnTable[0],
              this.sorting,
              this.territoryId,
              this.query
            )
            .subscribe((res) => {
              this.setMapUserCampaign(res);
              this.setTableData();
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  listCampaigns(): string {
    let result = [];
    this.selectedUser.campaigns.map((item) => {
      result.push([item.campaign.campaignId, item.campaign.name]);
    });
    let listElement = document.createElement("ul");
    for (let i = 0; i < result.length; ++i) {
      let listItem = document.createElement("li");
      listItem.innerHTML = "ID: " + result[i][0] + " - Nome: " + result[i][1];
      listElement.appendChild(listItem);
    }
    //document.removeChild(listElement);
    return listElement.innerHTML;
  }

  copy(element: string) {
    this.clipboard.copy(element);
    this._snackBar.openFromComponent(CopiedComponent, {
      duration: 600,
    });
  }

  ban() {
    console.log("Ban");
  }
}

@Component({
  template: "<p>Copiato</p>",
})
export class CopiedComponent {}
