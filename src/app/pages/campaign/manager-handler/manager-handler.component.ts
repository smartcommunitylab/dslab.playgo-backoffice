import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerClass } from 'src/app/shared/classes/manager-class';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ManagerHandlerService } from 'src/app/shared/services/manager-handler.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  trigger,  state,  style,  transition,  animate,} from "@angular/animations";
import { ManagerDeleteComponent } from './manager-delete/manager-delete.component';

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
export class ManagerHandlerComponent implements OnInit {

  @Input()name: string;
  @Input()campaignId: string;
  displayedColumns: string[] = ["email", "role","delete"];
  dataSource: MatTableDataSource<ExtendedManagerClass>;
  listManagers: ExtendedManagerClass[];
  selectedManager: ExtendedManagerClass;
  selectedRowIndex = "";
  addNewManager = false;
  newManagerForm: FormGroup;
  errorMsgNewManager: string;
  msgErrorDelete:string;
  newManager: ExtendedManagerClass;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(    
    public dialogRef: MatDialogRef<ManagerHandlerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    private managerService: ManagerHandlerService,
    private formBuilder: FormBuilder,
    private dialogDelete: MatDialog,) { }

  ngOnInit(): void {
    this.managerService.getManagerCampaign(this.campaignId).subscribe((result)=>{
      this.listManagers = this.createExtendedManagerClassList(result);
      this.setTableData();
    });
    this.newManagerForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required,Validators.email])
    });
  }


  setTableData() {
    this.dataSource = new MatTableDataSource<ExtendedManagerClass>(this.listManagers);
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

  selectManager(row : ExtendedManagerClass){
    this.selectedRowIndex = row.manager.id;
    this.selectedManager = row;
    this.newManager = new ExtendedManagerClass();
  }

  addManager(){
    this.addNewManager = !this.addNewManager;
  }

  saveNewManager(){
    if(this.newManagerForm.valid){
      this.errorMsgNewManager= "";
    try{
      this.newManager = new ExtendedManagerClass();
      this.newManager.manager = new ManagerClass();
      this.newManager.manager.preferredUsername = this.newManagerForm.get("email").value;
      this.managerService.postManagerCampaign(this.campaignId,this.newManager.manager.preferredUsername).subscribe((res)=>{
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

  deleteManager(manager: ExtendedManagerClass){
    const dialogRef = this.dialogDelete.open(ManagerDeleteComponent, {
      width: "40%",
      height: "30%",
    });
    let instance = dialogRef.componentInstance;
    instance.campaignId = this.campaignId;
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

  createExtendedManagerClassList(listManager: ManagerClass[]): ExtendedManagerClass[]{
    var result: ExtendedManagerClass[] = [];
    for(let manager of listManager){
      const exMan = new ExtendedManagerClass();
      exMan.isExpanded = false;
      exMan.manager = manager;
      result.push(exMan);
    }
    return result;
  }

  log(aa : any){
    console.log(aa);
  }

}


class ExtendedManagerClass {
  isExpanded: boolean = false;
  manager?: ManagerClass;
}
