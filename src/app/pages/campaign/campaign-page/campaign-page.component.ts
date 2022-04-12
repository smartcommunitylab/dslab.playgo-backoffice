import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';
import { CampaignAddFormComponent } from '../campaign-add-form/campaign-add-form.component';
import { CampaignDeleteComponent } from '../campaign-delete/campaign-delete.component';
import { CampaignClass } from 'src/app/shared/classes/campaing-class';
import { CampaignService } from 'src/app/shared/services/campaign-service.service';

@Component({
  selector: 'app-campaign-page',
  templateUrl: './campaign-page.component.html',
  styleUrls: ['./campaign-page.component.scss']
})
export class CampaignPageComponent implements OnInit {
  displayedColumns: string[] = ['campaignId','name','dateFrom','dateTo'];
  dataSource : MatTableDataSource<CampaignClass>;
  selectedCampaign?: CampaignClass = null;
  listCampaign: CampaignClass[];
  listAllCampaign: CampaignClass[];
  searchString: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( private dialogCreate: MatDialog,private dialogUpdate: MatDialog, private dialogDelete: MatDialog, private campaignService: CampaignService){// private dialog: MatDialog

  }

  ngOnInit() {
    this.campaignService.get().subscribe(
      listTerritory => {
        listTerritory = campaignss;
        this.listAllCampaign = listTerritory.reverse();
        this.listCampaign = listTerritory;
        this.setTableData();
      },
      error =>{
        const listTerritory = campaignss;
        this.listAllCampaign = listTerritory.reverse();
        this.listCampaign = listTerritory;
        this.setTableData();
      }
    );
  }

  ngAfterViewInit() {
  }

  setTableData(){
    this.dataSource = new MatTableDataSource<CampaignClass>(this.listCampaign);
    this.dataSource.paginator = this.paginator;
  }

  showTerritory(row : CampaignClass){
      this.selectedCampaign = row;
  }

  addCampaign(){
    const dialogRef = this.dialogCreate.open(CampaignAddFormComponent, {
      width: '80%',
      height: '90%',
    });
    let instance = dialogRef.componentInstance;
    instance.type = 'add';

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){
        this.listCampaign  = [result].concat(this.listCampaign);
        this.listAllCampaign = this.listCampaign;
        this.setTableData();
      }
    });
  }

  deleteTerritory(){
    const dialogRef = this.dialogDelete.open(CampaignDeleteComponent, {
      width: '40%',
      height: '30%',
    });
    let instance = dialogRef.componentInstance;
    // instance.territoryId = this.selectedCampaign.territoryId;

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){
        let newList: CampaignClass[] = [];
        for(let i of this.listCampaign){
          if(i.campaignId!==result){
            newList.push(i);
          }
        }
        this.listCampaign  = newList;
        this.listAllCampaign = newList;
        this.setTableData();
      }
    });
  }

  updateTerritory(){
    const dialogRef = this.dialogUpdate.open(CampaignAddFormComponent, {
      width: '80%',
      height: '90%',
    });
    let instance = dialogRef.componentInstance;
    instance.type = 'modify';
    instance.formTerritory = this.selectedCampaign;

    dialogRef.afterClosed().subscribe(result => {
      if(result !==undefined){
        this.selectedCampaign = result;
        let newList: CampaignClass[] = [];
        for(let i of this.listCampaign){
          if(i.campaignId!==result.territoryId){
            newList.push(i);
          }else{
            newList.push(result);
          }
        }
        this.listCampaign  = newList;
        this.listAllCampaign = newList;
        this.setTableData();
      }
    });
  }

  searchCampaign(event: any){
    if(this.searchString===''){
      this.listCampaign = this.listAllCampaign;
      this.setTableData();
    }else{
      this.listCampaign = this.listAllCampaign.filter(item =>
        item.name.includes(this.searchString)
      );
      this.setTableData();
    }
  }

  handleManager(){}

}

const campaignss : CampaignClass[] = [
  {
    "active": true,
    "campaignId": "string",
    "communications": true,
    "dateFrom": "yyyy-MM-dd",
    "dateTo": "yyyy-MM-dd",
    "description": "string",
    "gameId": "string",
    "logo": {
      "contentType": "string",
      "image": "string"
    },
    "name": "string",
    "privacy": "string",
    "rules": "string",
    "startDayOfWeek": 0,
    "territoryId": "string",
    "type": "city",
    "validationData": {}
  },
  {
    "active": true,
    "campaignId": "string",
    "communications": true,
    "dateFrom": "yyyy-MM-dd",
    "dateTo": "yyyy-MM-dd",
    "description": "string",
    "gameId": "string",
    "logo": {
      "contentType": "string",
      "image": "string"
    },
    "name": "string",
    "privacy": "string",
    "rules": "string",
    "startDayOfWeek": 0,
    "territoryId": "string",
    "type": "city",
    "validationData": {}
  },
  {
    "active": true,
    "campaignId": "string",
    "communications": true,
    "dateFrom": "yyyy-MM-dd",
    "dateTo": "yyyy-MM-dd",
    "description": "string",
    "gameId": "string",
    "logo": {
      "contentType": "string",
      "image": "string"
    },
    "name": "string",
    "privacy": "string",
    "rules": "string",
    "startDayOfWeek": 0,
    "territoryId": "string",
    "type": "city",
    "validationData": {}
  }
]