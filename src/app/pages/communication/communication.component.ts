import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TerritoryControllerService } from 'src/app/core/api/generated/controllers/territoryController.service';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
import { TERRITORY_ID_LOCAL_STORAGE_KEY } from 'src/app/shared/constants/constants';
import { CommunicationAddComponent } from './communication-add/communication-add.component';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {

  dataSource:MatTableDataSource<any>;
  displayedColumns = ["when","channel","users"];
  size=[50];
  territoryId:string;

  constructor(
    private dialogCreate: MatDialog,
    private territoryService: TerritoryControllerService,
    ) { }

  ngOnInit(): void {
      this.territoryId = localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY);
  }

  addComunication(){
    const dialogRef = this.dialogCreate.open(CommunicationAddComponent, {
      width: "80%",
      height: "90%",
    });
    let instance = dialogRef.componentInstance;
    instance.territoryId = this.territoryId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }

  fromTimestampToDate(timestamp: any) : string{
    const a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    //var month = months[a.getMonth()+1];
    var month = a.getMonth()+1
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year;
    return time;
  }


}
