import { Component, OnInit, Inject, ViewChild, Input } from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserClass } from "src/app/shared/classes/user-class";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { ManagerDeleteComponent } from "./manager-delete/manager-delete.component";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import { TranslateService } from "@ngx-translate/core";
import {
  ActionManagerClass,
  TypeActionManager,
} from "src/app/shared/classes/actionsManager-class";
import { ConfirmCloseComponent } from "./confirm-close/confirm-close.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

@Component({
  selector: "app-manager-handler",
  templateUrl: "./manager-handler.component.html",
  styleUrls: ["./manager-handler.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ManagerHandlerComponent implements OnInit {
  @Input() name: string;
  @Input() campaignId: string;
  @Input() territoryId: string;
  displayedColumns: string[] = ["email", "role", "delete"];
  dataSource: MatTableDataSource<ExtendedUserClass>;
  listManagers: ExtendedUserClass[];
  selectedManager: ExtendedUserClass;
  selectedRowIndex = "";
  addNewManager = false;
  newManagerForm: FormGroup;
  errorMsgNewManagerList: string[] = [];
  errorAddNewManager: string;
  msgErrorDelete: string;
  newManager: ExtendedUserClass;
  listActions: ActionManagerClass[] = []; // work as a stack push
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ManagerHandlerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    private translate: TranslateService,
    private managerService: ConsoleControllerService,
    private formBuilder: FormBuilder,
    private dialogDelete: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.managerService
      .getCampaignManagerUsingGET(this.campaignId)
      .subscribe((result) => {
        this.listManagers = this.createExtendedUserClassList(result);
        this.setTableData();
      });
    this.newManagerForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<ExtendedUserClass>(
      this.listManagers
    );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "email":
          return item.manager.preferredUsername;
        case "role":
          return item.manager.role;
      }
    };
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  selectManager(row: ExtendedUserClass) {
    this.selectedRowIndex = row.manager.id;
    this.selectedManager = row;
    this.newManager = new ExtendedUserClass();
  }

  addManager() {
    this.addNewManager = !this.addNewManager;
  }

  saveData(actions: ActionManagerClass[]) {
    this.errorMsgNewManagerList = [];
    this.fullfillActions(actions);
  }

  fullfillActions(actions: ActionManagerClass[]) {
    if (actions.length === 0) {
      if (this.errorMsgNewManagerList.length === 0) {
        this.onNoClick("");
        const text = this.translate.instant('savedData');
        this._snackBar.openFromComponent(SnackbarSavedComponent,
          {
           data:{displayText: text},
           duration: 4999
         });
      } else {
        //do not close show errors;
      }
    } else {
      const item = actions.pop();
      if (item.type === TypeActionManager.TypeEnum.Add) {
        this.managerService
          .addCampaignManagerUsingPOST({
            userName: item.email,
            campaignId: item.id,
          })
          .subscribe(
            (res) => {
              this.fullfillActions(actions);
            },
            (error) => {
              const text =
                this.translate.instant("errorSavingManager") +
                ": " +
                item.email +
                ", " +
                (error.error.ex ? error.error.ex : error.toString());
              this.errorMsgNewManagerList.push(text);
              this.fullfillActions(actions);
            }
          );
      } else if (item.type === TypeActionManager.TypeEnum.Delete) {
        this.managerService
          .removeCampaignManagerUsingDELETE({
            userName: item.email,
            campaignId: item.id,
          })
          .subscribe(
            () => {
              this.fullfillActions(actions);
            },
            (error) => {
              const text =
                this.translate.instant("errorDeleteManager") +
                ": " +
                item.email +
                ", " +
                (error.error.ex ? error.error.ex : error.toString());
              this.errorMsgNewManagerList.push(text);
              this.fullfillActions(actions);
            }
          );
      }
    }
  }

  addNewManagerFunc() {
    if (this.newManagerForm.valid) {
      this.errorAddNewManager = "";
      if (
        this.checkEmailAlreadyPresent(this.newManagerForm.get("email").value)
      ) {
        this.errorAddNewManager = this.translate.instant(
          "emailAlreadyPresentManager"
        );
        return;
      } else {
        this.newManager = new ExtendedUserClass();
        this.newManager.manager = new UserClass();
        this.newManager.manager.preferredUsername =
          this.newManagerForm.get("email").value;
        var action = new ActionManagerClass();
        action.email = this.newManager.manager.preferredUsername;
        action.id = this.campaignId;
        action.type = TypeActionManager.TypeEnum.Add;
        this.listActions.push(action);
        this.listManagers = [this.newManager].concat(this.listManagers);
        this.setTableData();
      }
    } else {
      this.errorAddNewManager = "fillAllfields";
    }
  }

  deleteManager(manager: ExtendedUserClass) {
    const dialogRef = this.dialogDelete.open(ManagerDeleteComponent, {
      width: "40%",
      height: "150px",
    });
    let instance = dialogRef.componentInstance;
    instance.campaignId = this.campaignId;
    instance.email = manager.manager.preferredUsername;

    dialogRef.afterClosed().subscribe((resultDelete) => {
      if (resultDelete) {
        let newList = [];
        for (let man of this.listManagers) {
          if (
            manager.manager.preferredUsername !== man.manager.preferredUsername
          ) {
            newList.push(man);
          }
        }
        var action = new ActionManagerClass();
        action.email = manager.manager.preferredUsername;
        action.id = this.campaignId;
        action.type = TypeActionManager.TypeEnum.Delete;
        this.listActions.push(action);
        this.listManagers = newList;
        this.setTableData();
      }
    });
  }

  onNoClick(event: any): void {
    if (this.listActions.length > 0) {
      const dialogRef = this.dialogDelete.open(ConfirmCloseComponent, {
        width: "40%",
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result){
          this.dialogRef.close();
        }        
      });
    }else{
      this.dialogRef.close();
    }
  }

  createExtendedUserClassList(listManager: UserClass[]): ExtendedUserClass[] {
    var result: ExtendedUserClass[] = [];
    for (let manager of listManager) {
      const exMan = new ExtendedUserClass();
      exMan.isExpanded = false;
      exMan.manager = manager;
      result.push(exMan);
    }
    return result;
  }

  checkEmailAlreadyPresent(preferredUsername: string): boolean {
    for (let item of this.listManagers) {
      if (item.manager.preferredUsername === preferredUsername) {
        return true;
      }
    }
    return false;
  }
}

class ExtendedUserClass {
  isExpanded: boolean = false;
  manager?: UserClass;
}
