import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from "src/app/shared/constants/constants";
import { PlayerCampaignClass } from "src/app/shared/classes/player-campaing-class";
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import { PagePlayer } from "src/app/shared/classes/PagePlayerInfoConsole-class";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

@Component({
  selector: "app-handle-users",
  templateUrl: "./handle-users.component.html",
  styleUrls: ["./handle-users.component.scss"],
})
export class HandleUsersComponent implements OnInit {
  pageSizesOnTable = [50];
  territoryId: string;
  searchString: string ="";
  displayedColumns: string[] = ["playerId","copyPlayerId","nickname","copyNickname","mail","copyMail", "name", "surname", "campaings", "notifications"];
  dataSource: MatTableDataSource<PlayerCampaignClass>;
  currentPageNumber: number;
  sorting: string = "";
  ordering:string = "desc";
  fieldOrdering:string = "notSelected";
  listUserCampaign: PlayerCampaignClass[];
  paginatorData: PagePlayer;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private playerService: ConsoleControllerService,
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    this.paginatorData = new PagePlayer();
    this.paginatorData.totalElements = 0; //avoid errors shown
    this.dataSource = new MatTableDataSource<PlayerCampaignClass>();
    this.dataSource.paginator = this.paginator;
    this.currentPageNumber = 0;
    try {
      this.playerService.
      searchPlayersByTerritoryUsingGET({
        page: 0,
        size: this.pageSizesOnTable[0],
        territoryId :this.territoryId
      }
        )
        .subscribe(
          (res) => {
            this.paginatorData = res;
            this.listUserCampaign = res.content;
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
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'playerId': return item.player.playerId;
        case 'nickname' : return item.player.nickname;
        case 'mail' : return item.player.mail;
        case 'name' : return item.player.givenName;
        case 'surname' : return item.player.familyName;
        case 'notifications' : return item.player.sendMail? 'A' : 'B';
      }
    };
  }



  searchUser(item: any){
    if (this.searchString === "") {
      this.playerService.searchPlayersByTerritoryUsingGET({
        page:         this.currentPageNumber,
        size: this.pageSizesOnTable[0],
        territoryId: this.territoryId
      }
).subscribe((res) =>{
        this.listUserCampaign = res.content;
        this.setTableData();
      });
      this.setTableData();
    } else {
      this.playerService.searchPlayersByTerritoryUsingGET({
        page: this.currentPageNumber,
        size: this.pageSizesOnTable[0],
        territoryId: this.territoryId,
        sort: this.sorting,
        text: this.searchString}
        ).subscribe((res) =>{
        this.listUserCampaign = res.content;
        this.setTableData();
      });
    }
  }


  sortData(event: any){
    this.fieldOrdering = event.active;
    this.ordering = event.direction;
    this.sorting = this.ordering ? this.fieldOrdering + "," + this.ordering : '';
    this.playerService.searchPlayersByTerritoryUsingGET({
      page: this.currentPageNumber,
      size: this.pageSizesOnTable[0],
      territoryId: this.territoryId,
      sort: this.sorting,
      text: this.searchString}).subscribe((res) =>{
      this.listUserCampaign = res.content;
      this.setTableData();
    });
  }

  selectedPageSize(event: any) {
    if (!!event) {
      const pageIndex = event.pageIndex;
      this.currentPageNumber = pageIndex;
      try {
          this.playerService
          .searchPlayersByTerritoryUsingGET({
            page: this.currentPageNumber,
            size: this.pageSizesOnTable[0],
            territoryId: this.territoryId,
            sort: this.sorting,
            text: this.searchString})
            .subscribe((res) => {
              this.listUserCampaign = res.content;
              this.setTableData();
            });
        }
      catch (error) {
        console.error(error);
      }
    }
  }

  copy(element: string) {
    this.clipboard.copy(element);
    this._snackBar.openFromComponent(SnackbarSavedComponent, {
      panelClass: 'snackBar-small',
      data:{copy: true, text: element},
      duration: 1999,
    });
  }

}

@Component({
  template: "<mat-icon><span>content_copy</span></mat-icon>",
})
export class CopiedComponent {}
