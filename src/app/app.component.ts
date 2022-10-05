import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "./shared/services/loading.service";
import { delay } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { AccountDialogComponent } from "./shared/components/account-dialog/account-dialog.component";
import { TerritoryClass } from "./shared/classes/territory-class";
import {
  ADMIN,
  CONST_LANGUAGES_SUPPORTED,
  LANGUAGE_DEFAULT,
  LANGUAGE_LOCAL_STORAGE,
  TERRITORY_ID_LOCAL_STORAGE_KEY,
} from "./shared/constants/constants";
import { RoleService } from "./shared/services/role.service";
import { TerritoryControllerService } from "./core/api/generated/controllers/territoryController.service";
import { Account } from "./shared/user/account.model";
import { PlayerRole } from "./core/api/generated/model/playerRole";
import { AuthService } from "./core/auth/auth.service";
import { TerritoryListService } from "./shared/services/territory-list.service";

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
export class AppComponent implements OnInit {
  title = "backOfficeConsolePlayGo";
  loading: boolean = false;
  territories: TerritoryClass[];
  globalSelectedTerritory: string;
  userEnabledToVisualize: boolean = true;
  roles: string[] = [];
  localStorageLanguage: string;  
  account: Account;
  rolesMenu: PlayerRole[];
  languagesSelectable = CONST_LANGUAGES_SUPPORTED;
  selectedLanguage: string;

  constructor(
    private translate: TranslateService,
    private _loading: LoadingService,
    private dialogCreate: MatDialog,
    private authService: AuthService,
    private territoryService: TerritoryControllerService,
    private roleService: RoleService,
    private updateTerritoryList: TerritoryListService
  ) {}

  ngOnInit() {
    this.account = this.authService.getAccount();
    this.roleService.getInitializedJustOncePerUserSecond().subscribe(
      (roles) => {
        //listRoles = ["campaign"]; // used for testing different roles
        this.roleService.setRolesSubcejt(roles);
        this.roleService.setSimpleRoles(roles);
        this.listenToLoading();
        this.initLanguage();
        this.initTerritory();
        this.selectedLanguage = this.translate.currentLang;
        this.rolesMenu = this.roleService.getRoles();
      },
      (error) => {
        console.log("Initialization error: ",error);
      }
    );
    this.updateTerritoryList.list.subscribe(data=>{
      this.territories = data;
      this.findTerritoriesPerRoles();
    });
    //this.waitForRoles();

  }

  findTerritoriesPerRoles(): void {
    const roles = this.roleService.getRoles();
    if (roles.filter((item) => item.role === ADMIN).length <= 0) {
      //if not admin filter the territories
      let territoriesVisible = [];
      roles.forEach((role) => {
        this.roles.push(role.role); // contains duplicate
        this.territories.forEach((item) => {
          if (role.entityId === item.territoryId) {
            territoriesVisible.push(item);
          }
        });
      });
      this.territories = territoriesVisible;
    }
  }

  openDialogAccount(event: any) {
    const dialogRef = this.dialogCreate.open(AccountDialogComponent, {
      width: "60%",
    });
    let instance = dialogRef.componentInstance;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }

  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  onGlobalSelectTerritory(value: string) {
    try {
      localStorage.removeItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
    } catch (error) {
      //there was no item to remove
    }
    localStorage.setItem(TERRITORY_ID_LOCAL_STORAGE_KEY, value);
    this.globalSelectedTerritory = value;
    window.location.reload();
  }

  userEnabled() {
    if (!!this.territories && this.territories.length > 0) {
      this.userEnabledToVisualize = true;
    } else {
      this.userEnabledToVisualize = false;
    }
  }

  initLanguage() {
    try {
      //if present in local storage take it
      this.localStorageLanguage= localStorage.getItem(LANGUAGE_LOCAL_STORAGE);
      if (!!!this.localStorageLanguage) {
        throw "";
      }
    } catch (error) {
      this.localStorageLanguage = LANGUAGE_DEFAULT; 
      localStorage.setItem(LANGUAGE_LOCAL_STORAGE, LANGUAGE_DEFAULT);
      console.log("finished saving in local storage");
    }
    var userLang = navigator.language;
    console.log("browser language: ", userLang);
    console.log("storage languag used: ", this.localStorageLanguage);
    this.translate.setDefaultLang(this.localStorageLanguage);
    this.translate.use(this.localStorageLanguage); //TODO get language from browser
  }


  initTerritory(){
    this.territoryService.getTerritoriesUsingGET().subscribe((res) => {
      this.territories = res;
      this.findTerritoriesPerRoles();
      this.userEnabled();
      try {
        //if present in local storage take it
        this.globalSelectedTerritory = localStorage.getItem(
          TERRITORY_ID_LOCAL_STORAGE_KEY
        );
        if (!!!this.globalSelectedTerritory) {
          throw "";
        }
      } catch (error) {
        //if not present take first
        if (res.length > 0) {
          this.globalSelectedTerritory = res[0].territoryId;
          localStorage.setItem(
            TERRITORY_ID_LOCAL_STORAGE_KEY,
            this.globalSelectedTerritory
          );
          console.log("finished saving in local storage");
        } else {
          this.territories = [{ territoryId: "noValuesAvailable" }];
        }
      }
    });
  }

  changeLanguage(event){
    this.selectedLanguage = event;
    localStorage.setItem(LANGUAGE_LOCAL_STORAGE, event);
    this.translate.setDefaultLang(event);
    this.translate.use(event); //TODO get language from browser
    window.location.reload();
  }

  logout(event: any){
    this.authService.logout();
  }


//   waitForRoles() {
//     if (typeof Worker !== 'undefined') {
//        //
//        const worker = new Worker('../src/app/shared/workers/role.worker.ts', { type: 'module' });
//        worker.onmessage = ({ data }) => {
//        this.roles = data;
//        };
//     } else {
//     }
//  }

}
