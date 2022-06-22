import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { CampaignAddFormComponent } from "../campaign-add-form/campaign-add-form.component";
import { CampaignDeleteComponent } from "../campaign-delete/campaign-delete.component";
import { CampaignClass, ImageClass, ValidationData,  } from "src/app/shared/classes/campaing-class";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { BASE64_SRC_IMG, CONST_LANGUAGES_SUPPORTED, LANGUAGE_DEFAULT, PREFIX_SRC_IMG, TERRITORY_ID_LOCAL_STORAGE_KEY } from "src/app/shared/constants/constants";
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { ManagerHandlerComponent } from "../manager-handler/manager-handler.component";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { Logo } from "src/app/shared/classes/logo-class";
import { Campaign } from "src/app/core/api/generated/model/campaign";
import { SurveyComponentComponent } from "../survey-component/survey-component.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-campaign-page",
  templateUrl: "./campaign-page.component.html",
  styleUrls: ["./campaign-page.component.scss"],
})
export class CampaignPageComponent implements OnInit {
  displayedColumns: string[] = ["campaignId", "name","active", "dateFrom", "dateTo"];
  size=[50];
  dataSource: MatTableDataSource<CampaignClass>;
  selectedCampaign?: CampaignClass = null;
  listCampaign: CampaignClass[];
  listAllCampaign: CampaignClass[];
  searchString: string;
  listTerritories: TerritoryClass[];
  selectedRowIndex = "";
  PREFIX_SRC_IMG_C = PREFIX_SRC_IMG;
  BASE64_SRC_IMG_C =BASE64_SRC_IMG;
  highlightCampaign: CampaignClass;
  languageDefault:any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialogCreate: MatDialog,
    private dialogUpdate: MatDialog,
    private dialogDelete: MatDialog,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
    private territoryService:TerritoryControllerService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    // private dialog: MatDialog
  }

  ngOnInit() {
    this.languageDefault = this.translate.currentLang;
    this.territoryService.getTerritoriesUsingGET().subscribe(result => this.listTerritories = result);
    this.highlightCampaign = new CampaignClass();
    this.highlightCampaign.campaignId = "";
    this.onSelectTerritory(localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY));
  }

  ngAfterViewInit() {}

  async onSelectTerritory(territoryId: string){
    if(territoryId){
      await this.campaignService.getCampaignsUsingGET({territoryId: territoryId}).subscribe(
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
    for(let i=0;i<this.listCampaign.length;i++){
      // replace empty value names with default name
      var obj ={};
      for(let l of CONST_LANGUAGES_SUPPORTED){
        if(!!!this.listCampaign[i].name[l]){
          obj[l] = this.listCampaign[i].name[LANGUAGE_DEFAULT];
        }else{
          obj[l] = this.listCampaign[i].name[l];          
        }
      }
      this.listCampaign[i].name = obj;
    }
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
      height: '820px'
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

  deleteCampaign() {
    const dialogRef = this.dialogDelete.open(CampaignDeleteComponent, {
      width: "40%",
      //height: "150px",
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

  updateCampaign() {
    const dialogRef = this.dialogUpdate.open(CampaignAddFormComponent, {
      width: "80%",
      height: '900px'
    });
    let instance = dialogRef.componentInstance;
    instance.type = "modify";
    instance.formTerritory = this.selectedCampaign;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.campaignService.getCampaignUsingGET(result.campaignId).subscribe((campaign)=>{
          this.selectedCampaign = campaign;
          this.onSelectTerritory(campaign.territoryId);
        });
      }
    });
  }

  searchCampaign(event: any) {
    if (this.searchString === "") {
      this.listCampaign = this.listAllCampaign;
      this.setTableData();
    } else {
      this.listCampaign = this.listAllCampaign.filter((item) =>
        item.name[this.translate.currentLang].toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase())
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
    window.innerHeight += h;
  }

  handleManager() {
    const dialogRef = this.dialogUpdate.open(ManagerHandlerComponent, {
      width: "80%",
    });
    let instance = dialogRef.componentInstance;
    instance.name = this.selectedCampaign.name[this.translate.currentLang];
    instance.campaignId = this.selectedCampaign.campaignId;
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }

  survey(){
    const dialogRef = this.dialogUpdate.open(SurveyComponentComponent, {
      width: "80%",
    });
    let instance = dialogRef.componentInstance;
    console.log("full campaign:", this.selectedCampaign);
    instance.name = this.selectedCampaign.name[this.translate.currentLang];
    instance.surveysMap = this.selectedCampaign.surveys;
    instance.campaignId = this.selectedCampaign.campaignId;
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }


  setClassWithourError(element: CampaignClass) : CampaignClass{
    const nullString = "valueNotProvided";
    var resultCampaign = new CampaignClass();
    if(element.surveys){
      resultCampaign.surveys = element.surveys;
  }else{
      resultCampaign.surveys = undefined;
  }
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
        resultCampaign.dateFrom = undefined;
    }
    if(element.dateTo){
        resultCampaign.dateTo = element.dateTo;
    }else{
        resultCampaign.dateTo = undefined;
    }
    if(element.description){
        resultCampaign.description = element.description;
    }else{
        resultCampaign.description = {};
    }
    if(element.gameId){
        resultCampaign.gameId = element.gameId;
    }else{
        resultCampaign.gameId = "";
    }
    if(element.logo){
        resultCampaign.logo = element.logo;
    }else{
        resultCampaign.logo = new ImageClass();
    }
    if(element.banner){
      resultCampaign.banner = element.banner;
  }else{
      resultCampaign.banner = new ImageClass();
  }
    if(element.name){
        resultCampaign.name = element.name;
    }else{
        resultCampaign.name = {};
    }
    if(element.validationData){
        resultCampaign.validationData = element.validationData;
    }else{
        resultCampaign.validationData = new ValidationData();
    }
    if(element.details){
        resultCampaign.details = element.details;
    }else{
        resultCampaign.details = {};
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