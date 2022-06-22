import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserClass } from 'src/app/shared/classes/user-class';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  trigger,  state,  style,  transition,  animate,} from "@angular/animations";
import { ManagerDeleteTerritoryComponent } from './manager-delete/manager-delete.component';
import { ConsoleControllerService } from 'src/app/core/api/generated/controllers/consoleController.service';

const LIST_MANAGERS = [
  {
    id: "1",
    email: "asd1@asd.it"
  },
  {
    id: "2",
    email: "asd2@asd.it"
  },
  {
    id: "3",
    email: "asd3@asd.it"
  },
  {
    id: "4",
    email: "asd4@asd.it"
  },
];

@Component({
  selector: 'app-manager-handler',
  templateUrl: './manager-handler.component.html',
  styleUrls: ['./manager-handler.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManagerHandlerTerritoryComponent implements OnInit {

  @Input()name: string;
  @Input()territoryId: string;
  displayedColumns: string[] = ["email", "role","delete"];
  dataSource: MatTableDataSource<ExtendedUserClass>;
  listManagers: ExtendedUserClass[];
  selectedManager: ExtendedUserClass;
  selectedRowIndex = "";
  addNewManager = false;
  newManagerForm: FormGroup;
  errorMsgNewManager: string;
  msgErrorDelete:string;
  newManager: ExtendedUserClass;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(    
    public dialogRef: MatDialogRef<ManagerHandlerTerritoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    private managerService: ConsoleControllerService,
    private formBuilder: FormBuilder,
    private dialogDelete: MatDialog,) { }

  ngOnInit(): void {
    this.managerService.getTerritoryManagerUsingGET(this.territoryId).subscribe((result)=>{
      this.listManagers = this.createExtendedUserClassList(result);
      this.setTableData();
    });
    this.newManagerForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required,Validators.email])
    });
  }


  setTableData() {
    this.dataSource = new MatTableDataSource<ExtendedUserClass>(this.listManagers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectManager(row : ExtendedUserClass){
    this.selectedRowIndex = row.manager.id;
    this.selectedManager = row;
    this.newManager = new ExtendedUserClass();
  }

  addManager(){
    this.addNewManager = !this.addNewManager;
  }

  saveNewManager(){
    if(this.newManagerForm.valid){
      this.errorMsgNewManager= "";
    try{
      this.newManager = new ExtendedUserClass();
      this.newManager.manager = new UserClass();
      this.newManager.manager.preferredUsername = this.newManagerForm.get("email").value;
      this.managerService.addTerritoryManagerUsingPOST(
        {
          userName: this.newManager.manager.preferredUsername,
          territoryId: this.territoryId
        }
        ).subscribe((res)=>{
        this.listManagers.push(this.newManager);
        this.setTableData();
        //this.addNewManager = false;
      },
      (error)=>{
        this.errorMsgNewManager = "Error while adding new Manager subscription: " + error.toString();
      });
    }
    catch(error){
      this.errorMsgNewManager = "Error while adding new Manager: " + error.toString();
    }
  }
  }

  deleteManager(manager: ExtendedUserClass){
    const dialogRef = this.dialogDelete.open(ManagerDeleteTerritoryComponent, {
      width: "40%",
      height: "150px",
    });
    let instance = dialogRef.componentInstance;
    instance.territoryId = this.territoryId;
    instance.email = manager.manager.preferredUsername;

    dialogRef.afterClosed().subscribe((resultDelete) => {
      if (resultDelete) {
        let newList = []
        for(let man of this.listManagers){
          if(manager.manager.preferredUsername!==man.manager.preferredUsername){
            newList.push(man);
          }
        }
        this.listManagers = newList;
        this.setTableData();
      }
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  createExtendedUserClassList(listManager: UserClass[]): ExtendedUserClass[]{
    var result: ExtendedUserClass[] = [];
    for(let manager of listManager){
      const exMan = new ExtendedUserClass();
      exMan.isExpanded = false;
      exMan.manager = manager;
      result.push(exMan);
    }
    return result;
  }
}


class ExtendedUserClass {
  isExpanded: boolean = false;
  manager?: UserClass;
}
