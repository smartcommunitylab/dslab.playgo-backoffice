import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { CampaignAddFormComponent } from "../campaign-add-form/campaign-add-form.component";
import { CampaignDeleteComponent } from "../campaign-delete/campaign-delete.component";
import { CampaignClass, ValidationData,  } from "src/app/shared/classes/campaing-class";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { BASE64_SRC_IMG, PREFIX_SRC_IMG, TERRITORY_ID_LOCAL_STORAGE_KEY } from "src/app/shared/constants/constants";
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ManagerHandlerComponent } from "../manager-handler/manager-handler.component";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { Logo } from "src/app/shared/classes/logo-class";
import { Campaign } from "src/app/core/api/generated/model/campaign";

@Component({
  selector: "app-campaign-page",
  templateUrl: "./campaign-page.component.html",
  styleUrls: ["./campaign-page.component.scss"],
})
export class CampaignPageComponent implements OnInit {
  displayedColumns: string[] = ["campaignId", "name","active", "dateFrom", "dateTo"];
  dataSource: MatTableDataSource<CampaignClass>;
  selectedCampaign?: CampaignClass = null;
  listCampaign: CampaignClass[];
  listAllCampaign: CampaignClass[];
  searchString: string;
  listTerritories: TerritoryClass[];
  selectedRowIndex = "";
  PREFIX_SRC_IMG_C = PREFIX_SRC_IMG;
  BASE64_SRC_IMG_C =BASE64_SRC_IMG;
  highlightCampaign: CampaignClass
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialogCreate: MatDialog,
    private dialogUpdate: MatDialog,
    private dialogDelete: MatDialog,
    private campaignService: CampaignControllerService,
    private territoryService:TerritoryControllerService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    // private dialog: MatDialog
  }

  ngOnInit() {
    this.territoryService.getTerritoriesUsingGET().subscribe(result => this.listTerritories = result);
    this.highlightCampaign = new CampaignClass();
    this.highlightCampaign.campaignId = "";
    this.onSelectTerritory(localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY));
  }

  ngAfterViewInit() {}

  async onSelectTerritory(territoryId: string){
    if(territoryId){
      await this.campaignService.getCampaignsUsingGET(territoryId).subscribe(
        (listTerritory) => {
          if(!!listTerritory){
            this.listAllCampaign = listTerritory.reverse();
            this.listCampaign = listTerritory;
            this.setTableData();
          }
        },
        (error) => {
          console.error("error onSelectTerritory", error);
        }
      );
    }
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<CampaignClass>(this.listCampaign);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showTerritory(row: CampaignClass) {
    this.highlightCampaign = new CampaignClass();
    this.highlightCampaign.campaignId = "";
    this.selectedRowIndex = row.campaignId;
    this.selectedCampaign = new CampaignClass();
    this.selectedCampaign = this.setClassWithourError(row);
  }

  addCampaign() {
    const dialogRef = this.dialogCreate.open(CampaignAddFormComponent, {
      width: "80%",
      height: "90%",
    });
    let instance = dialogRef.componentInstance;
    instance.type = "add";

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.highlightCampaign = result;
         this.onSelectTerritory(result.territoryId);
      }
    });
  }

  deleteTerritory() {
    const dialogRef = this.dialogDelete.open(CampaignDeleteComponent, {
      width: "40%",
      height: "30%",
    });
    let instance = dialogRef.componentInstance;
    instance.campaignId = this.selectedCampaign.campaignId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.selectedCampaign =null;
        let newList: CampaignClass[] = [];
        for (let i of this.listCampaign) {
          if (i.campaignId !== result) {
            newList.push(i);
          }
        }
        this.listCampaign = newList;
        this.listAllCampaign = newList;
        this.setTableData();
      }
    });
  }

  updateTerritory() {
    const dialogRef = this.dialogUpdate.open(CampaignAddFormComponent, {
      width: "80%",
      height: "90%",
    });
    let instance = dialogRef.componentInstance;
    instance.type = "modify";
    instance.formTerritory = this.selectedCampaign;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.onSelectTerritory(result.territoryId);
        this.selectedCampaign =result;
      }
    });
  }

  searchCampaign(event: any) {
    if (this.searchString === "") {
      this.listCampaign = this.listAllCampaign;
      this.setTableData();
    } else {
      this.listCampaign = this.listAllCampaign.filter((item) =>
        item.name.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase())
      );
      this.setTableData();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  changeHeight(height : string){
    const h = +height;
    console.log(h);
    window.innerHeight += h;
    console.log(window.innerHeight);
  }

  handleManager() {
    const dialogRef = this.dialogUpdate.open(ManagerHandlerComponent, {
      width: "80%",
      height: "90%",
    });
    let instance = dialogRef.componentInstance;
    instance.name = this.selectedCampaign.name;
    instance.campaignId = this.selectedCampaign.campaignId;
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }


  setClassWithourError(element: CampaignClass) : CampaignClass{
    const nullString = "valueNotProvided";
    var resultCampaign = new CampaignClass(); 
    if(element.active){
        resultCampaign.active = element.active;
    }else{
        resultCampaign.active = false;
    }
    if(element.campaignId){
        resultCampaign.campaignId = element.campaignId;
    }else{
        resultCampaign.campaignId = "";
    }
    if(element.communications){
        resultCampaign.communications = element.communications;
    }else{
        resultCampaign.communications = false;
    }
    if(element.dateFrom){
        resultCampaign.dateFrom = element.dateFrom;
    }else{
        resultCampaign.dateFrom = "";
    }
    if(element.dateTo){
        resultCampaign.dateTo = element.dateTo;
    }else{
        resultCampaign.dateTo = "";
    }
    if(element.description){
        resultCampaign.description = element.description;
    }else{
        resultCampaign.description = "";
    }
    if(element.gameId){
        resultCampaign.gameId = element.gameId;
    }else{
        resultCampaign.gameId = "";
    }
    if(element.logo){
        resultCampaign.logo = element.logo;
    }else{
        resultCampaign.logo = new Logo();
    }
    if(element.name){
        resultCampaign.name = element.name;
    }else{
        resultCampaign.name = "";
    }
    if(element.validationData){
        resultCampaign.validationData = element.validationData;
    }else{
        resultCampaign.validationData = new ValidationData();
    }
    if(element.privacy){
        resultCampaign.privacy = element.privacy;
    }else{
        resultCampaign.privacy = "";
    }
    if(element.rules){
        resultCampaign.rules = element.rules;
    }else{
        resultCampaign.rules = "";
    }
    if(element.startDayOfWeek){
        resultCampaign.startDayOfWeek = element.startDayOfWeek;
    }else{
        resultCampaign.startDayOfWeek = 1;
    }
    if(element.territoryId){
        resultCampaign.territoryId = element.territoryId;
    }else{
        resultCampaign.territoryId = "";
    }
    if(element.type){
        resultCampaign.type = element.type;
    }else{
        resultCampaign.type = Campaign.TypeEnum.Personal;
    }
    return resultCampaign;
}

}