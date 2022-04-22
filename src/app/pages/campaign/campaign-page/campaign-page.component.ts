import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { CampaignAddFormComponent } from "../campaign-add-form/campaign-add-form.component";
import { CampaignDeleteComponent } from "../campaign-delete/campaign-delete.component";
import { CampaignClass } from "src/app/shared/classes/campaing-class";
import { CampaignService } from "src/app/shared/services/campaign-service.service";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { TerritoryService } from "src/app/shared/services/territory.service";

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialogCreate: MatDialog,
    private dialogUpdate: MatDialog,
    private dialogDelete: MatDialog,
    private campaignService: CampaignService,
    private territoryService: TerritoryService
  ) {
    // private dialog: MatDialog
  }

  ngOnInit() {
    this.territoryService.get().subscribe(result => this.listTerritories = result);
  }

  ngAfterViewInit() {}

  onSelectTerritory(territoryId: string){
    if(territoryId){
      this.campaignService.get(territoryId).subscribe(
        (listTerritory) => {
          if(!!listTerritory){
            this.listAllCampaign = listTerritory.reverse();
            this.listCampaign = listTerritory;
            this.setTableData();
          }
        },
        (error) => {}
      );
    }
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<CampaignClass>(this.listCampaign);
    this.dataSource.paginator = this.paginator;
  }

  showTerritory(row: CampaignClass) {
    this.selectedRowIndex = row.campaignId;
    this.selectedCampaign = row;
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
      }
    });
  }

  searchCampaign(event: any) {
    if (this.searchString === "") {
      this.listCampaign = this.listAllCampaign;
      this.setTableData();
    } else {
      this.listCampaign = this.listAllCampaign.filter((item) =>
        item.name.includes(this.searchString)
      );
      this.setTableData();
    }
  }

  handleManager() {}
}