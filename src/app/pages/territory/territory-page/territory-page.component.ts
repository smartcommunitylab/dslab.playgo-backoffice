import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
import { MatDialog} from '@angular/material/dialog';
import { TerritoryAddFormComponent } from '../territory-add-form/territory-add-form.component';
import { TerritoryDeleteComponent } from '../territory-delete/territory-delete.component';
import { TerritoryService } from 'src/app/shared/services/territory.service';
import { FilterPipe } from 'src/app/shared/services/filter-pipe';

@Component({
  selector: 'app-territory-page',
  templateUrl: './territory-page.component.html',
  styleUrls: ['./territory-page.component.scss']
})
export class TerritoryPageComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['territoryId','name']; //, 'description', 'means'];
  dataSource : MatTableDataSource<TerritoryClass>;
  selectedTerritory?: TerritoryClass = null;
  listTerriotory: TerritoryClass[];
  listAllTerriotory: TerritoryClass[];
  searchString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor( private dialogCreate: MatDialog,private dialogUpdate: MatDialog, private dialogDelete: MatDialog, private territoryService: TerritoryService){// private dialog: MatDialog

  }

  ngOnInit() {
    this.territoryService.get().subscribe(
      listTerritory => {
        this.listAllTerriotory = listTerritory.reverse();
        this.listTerriotory = listTerritory;
        this.setTableData();
      }
    );
  }

  ngAfterViewInit() {
  }

  setTableData(){
    this.dataSource = new MatTableDataSource<TerritoryClass>(this.listTerriotory);
    this.dataSource.paginator = this.paginator;
  }

  showTerritory(row : TerritoryClass){
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
        this.listTerriotory  = [result].concat(this.listTerriotory);
        this.listAllTerriotory = this.listTerriotory;
        this.setTableData();
      }
    });
  }

  deleteTerritory(){
    const dialogRef = this.dialogDelete.open(TerritoryDeleteComponent, {
      width: '40%',
      height: '30%',
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
        this.setTableData();
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

  searchTerritory(event: any){
    if(this.searchString===''){
      this.listTerriotory = this.listAllTerriotory;
      this.setTableData();
    }else{
      this.listTerriotory = this.listAllTerriotory.filter(item =>
        item.name.includes(this.searchString)
      );
      this.setTableData();
    }
  }


}





