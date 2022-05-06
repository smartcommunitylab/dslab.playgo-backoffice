import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "./shared/services/loading.service";
import { delay } from "rxjs/operators";
import { MatDialog} from '@angular/material/dialog';
import { AccountDialogComponent } from "./shared/components/account-dialog/account-dialog.component";
import { TerritoryClass } from "./shared/classes/territory-class";
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from "./shared/constants/constants";
import { RoleService } from "./shared/services/role.service";
import { TerritoryControllerService } from "./core/api/generated/controllers/territoryController.service";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit{
  title = "backOfficeConsolePlayGo";
  events: string[] = [];
  opened: boolean;
  loading: boolean = false;

  tiles: Tile[] = [
    { text: "One", cols: 3, rows: 1, color: "lightblue" },
    { text: "Two", cols: 1, rows: 2, color: "lightgreen" },
    { text: "Three", cols: 1, rows: 1, color: "lightpink" },
    { text: "Four", cols: 2, rows: 1, color: "#DDBDF1" },
  ];
  login: boolean = false;
  territories: TerritoryClass[];
  globalSelectedTerritory: string;

  constructor(
    private translate: TranslateService,
    private _loading: LoadingService,
    private dialogCreate: MatDialog,
    private territoryService: TerritoryControllerService,
    private roleService: RoleService
  ) {
    this.translate.setDefaultLang("it");
  }

  ngOnInit() {
    this.listenToLoading();
    this.territoryService.getTerritoriesUsingGET().subscribe((res)=>{
      this.territories = res;
      try{
        //if present in local storage take it
        this.globalSelectedTerritory = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
      }catch(error){
        //if not present take first
        this.globalSelectedTerritory = res[0].territoryId;
        localStorage.setItem(TERRITORY_ID_LOCAL_STORAGE_KEY,this.globalSelectedTerritory);
      }
    });
    this.roleService.getInitializedJustOncePerUser();
  }

  openDialogAccount(event: any){
    const dialogRef = this.dialogCreate.open(AccountDialogComponent, {
      width: '60%',
      height: '40%',
    });
    let instance = dialogRef.componentInstance;

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){      }
    });
  }

  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  onGlobalSelectTerritory(value: string){
    try{
      localStorage.removeItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    }catch(error){
      //there was no item to remove
    }
    localStorage.setItem(TERRITORY_ID_LOCAL_STORAGE_KEY,value);
    this.globalSelectedTerritory = value;
    window.location.reload();
  }

}
