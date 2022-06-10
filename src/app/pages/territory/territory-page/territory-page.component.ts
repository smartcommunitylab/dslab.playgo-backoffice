import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
import { MatDialog} from '@angular/material/dialog';
import { TerritoryAddFormComponent } from '../territory-add-form/territory-add-form.component';
import { TerritoryDeleteComponent } from '../territory-delete/territory-delete.component';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ManagerHandlerTerritoryComponent } from '../manager-handler/manager-handler.component';
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from 'src/app/shared/constants/constants';
import { TerritoryControllerService } from 'src/app/core/api/generated/controllers/territoryController.service';

@Component({
  selector: 'app-territory-page',
  templateUrl: './territory-page.component.html',
  styleUrls: ['./territory-page.component.scss']
})
export class TerritoryPageComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['territoryId','name']; //, 'description', 'means'];
  size=[50];
  dataSource : MatTableDataSource<TerritoryClass>;
  selectedTerritory?: TerritoryClass = null;
  listTerriotory: TerritoryClass[];
  listAllTerriotory: TerritoryClass[];
  searchString: string;
  selectedRowIndex = "";
  newTerritory: TerritoryClass;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor( private dialogCreate: MatDialog,
    private dialogUpdate: MatDialog,
     private dialogDelete: MatDialog,
      private territoryService: TerritoryControllerService,
    private _liveAnnouncer: LiveAnnouncer){// private dialog: MatDialog

  }

  ngOnInit() {
    this.territoryService.getTerritoriesUsingGET().subscribe(
      listTerritory => {
        this.listAllTerriotory = listTerritory.reverse();
        this.listTerriotory = listTerritory;
        this.setTableData();
        this.newTerritory = new TerritoryClass();
        this.newTerritory.territoryId = "";
      }
    );
  }

  ngAfterViewInit() {    
  }

  setTableData(){
    this.dataSource = new MatTableDataSource<TerritoryClass>(this.listTerriotory);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showTerritory(row : TerritoryClass){

      this.selectedRowIndex = row.territoryId;
      this.selectedTerritory = row;
  }

  addTerritory(){
    const dialogRef = this.dialogCreate.open(TerritoryAddFormComponent, {
      width: '80%',
      height: '90%',
    });
    let instance = dialogRef.componentInstance;
    instance.type = 'add';

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){
        this.newTerritory = new TerritoryClass();
        this.newTerritory.territoryId = result.territoryId;
        this.listTerriotory  = [result].concat(this.listTerriotory);
        this.listAllTerriotory = this.listTerriotory;
        this.setTableData();
      }
    });
  }

  deleteTerritory(){
    const dialogRef = this.dialogDelete.open(TerritoryDeleteComponent, {
      width: '40%',
      //height: '150px',
    });
    let instance = dialogRef.componentInstance;
    instance.territoryId = this.selectedTerritory.territoryId;

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){
        let newList: TerritoryClass[] = [];
        for(let i of this.listTerriotory){
          if(i.territoryId!==result){
            newList.push(i);
          }
        }
        this.listTerriotory  = newList;
        this.listAllTerriotory = newList;
        this.selectedTerritory = undefined;
        this.setTableData();
      }
      if(result === localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY)){
        //deleted the territory that was selected
        this.territoryService.getTerritoriesUsingGET().subscribe((res)=>{
          localStorage.removeItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
          localStorage.setItem(TERRITORY_ID_LOCAL_STORAGE_KEY,res[0].territoryId);
        });
      }
    });
  }

  updateTerritory(){
    const dialogRef = this.dialogUpdate.open(TerritoryAddFormComponent, {
      width: '80%',
      height: '90%',
    });
    let instance = dialogRef.componentInstance;
    instance.type = 'modify';
    instance.formTerritory = this.selectedTerritory;

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){
        this.selectedTerritory = result;
        let newList: TerritoryClass[] = [];
        for(let i of this.listTerriotory){
          if(i.territoryId!==result.territoryId){
            newList.push(i);
          }else{
            newList.push(result);
          }
        }
        this.listTerriotory  = newList;
        this.listAllTerriotory = newList;
        this.setTableData();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  searchTerritory(event: any){
    if(this.searchString===''){
      this.listTerriotory = this.listAllTerriotory;
      this.setTableData();
    }else{
      this.listTerriotory = this.listAllTerriotory.filter(item =>
        item.name.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase())
      );
      this.setTableData();
    }
  }


  handleManager(){
    const dialogRef = this.dialogUpdate.open(ManagerHandlerTerritoryComponent, {
      width: "80%",
      height: "90%",
    });
    let instance = dialogRef.componentInstance;
    instance.name = this.selectedTerritory.name;
    instance.territoryId = this.selectedTerritory.territoryId;
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });

  }

}





