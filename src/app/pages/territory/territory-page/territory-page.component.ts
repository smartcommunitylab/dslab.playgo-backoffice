import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
import { MatDialog} from '@angular/material/dialog';
import { TerritoryAddFormComponent } from '../territory-add-form/territory-add-form.component';

@Component({
  selector: 'app-territory-page',
  templateUrl: './territory-page.component.html',
  styleUrls: ['./territory-page.component.scss']
})
export class TerritoryPageComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['name']; //, 'description', 'means'];
  dataSource = new MatTableDataSource<TerritoryClass>(ELEMENT_DATA);
  selectedTerritory?: TerritoryClass = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor( private dialog: MatDialog){// private dialog: MatDialog

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showTerritory(row : TerritoryClass){
      this.selectedTerritory = row;
    console.log(this.selectedTerritory);
  }

  addTerritory(){
    const dialogRef = this.dialog.open(TerritoryAddFormComponent, {
      width: '80%',
      height: '90%',
      data: {name: 'nome', animal: 'animale'},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

const ELEMENT_DATA: TerritoryClass[] = [
  {'id':'isc1','name':'Territory1','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc2','name':'Territory2','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc3','name':'Territory3','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc4','name':'Territory4','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc5','name':'Territory5','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc6','name':'Territory6','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc7','name':'Territory7','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc8','name':'Territory8','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc9','name':'Territory9','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc10','name':'Territory10','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc11','name':'Territory11','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc12','name':'Territory12','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc13','name':'Territory13','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc14','name':'Territory14','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
  {'id':'isc15','name':'Territory15','description':'Desciption', 'means': ['bike','foot'],'area':{},'validation': null},
];



