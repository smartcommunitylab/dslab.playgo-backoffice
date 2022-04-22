import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MapPoint } from "src/app/shared/classes/map-point";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { TerritoryService } from "src/app/shared/services/territory.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CampaignClass, ValidationData } from "src/app/shared/classes/campaing-class";
import { UploadFileService } from "src/app/shared/services/upload-file.service";
import { TYPE_CAMPAIGN } from "src/app/shared/constants/constants";
import { means } from "src/app/shared/constants/means";
import { CampaignService } from "src/app/shared/services/campaign-service.service";

@Component({
  selector: "app-campaign-add-form",
  templateUrl: "./campaign-add-form.component.html",
  styleUrls: ["./campaign-add-form.component.scss"],
})
export class CampaignAddFormComponent implements OnInit {
  @Input() type: string; // can be add or modify

  validatingForm: FormGroup;
  campaignCreated: CampaignClass;
  campaignUpdated: CampaignClass;
  territoryList: TerritoryClass[];
  selectedFile: File;
  typeCampaign = TYPE_CAMPAIGN;
  means: string[] = means;
  errorMsgValidation: string;

  @Input() set formTerritory(value: CampaignClass) {
    this.initializaValidatingForm();
    this.campaignUpdated = value;
  }

  constructor(
    private territoryService: TerritoryService,
    private campaignService: CampaignService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CampaignAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  onNoClick(event: any, campaign?: CampaignClass): void {
    this.dialogRef.close(campaign);
  }

  ngOnInit(): void {
    this.campaignCreated = new CampaignClass();
    this.campaignCreated.validationData = new ValidationData();
    this.initializaValidatingForm();
    this.territoryService
      .get()
      .subscribe((result) => (this.territoryList = result));
  }

  initializaValidatingForm() {
    if (this.type === "add") {
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl("", [Validators.required]),
        campaignId: new FormControl("", [Validators.required]),
        name: new FormControl("", [Validators.required]),
        logo: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        privacy: new FormControl("", [Validators.required]),
        rules: new FormControl("", [Validators.required]),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl("",[Validators.pattern("^[1-7]")]),
      });
    } else {
      this.validatingForm = this.formBuilder.group({
        logo: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        privacy: new FormControl("", [Validators.required]),
        rules: new FormControl("", [Validators.required]),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl(""),
      });
    }
  }

  public myError = (controlName: string, errorName: string) => {
    return this.validatingForm.controls[controlName].hasError(errorName);
  };

  setSelectedPoint(event: MapPoint): void {
    this.validatingForm.get("lat").setValue(event.latitude);
    this.validatingForm.get("long").setValue(event.longitude);
    //this.unlockRaySelector = true;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "km";
    }

    return value;
  }

  validate(): void {
    this.errorMsgValidation = null;
    const p = this.validatingForm.get("name").value;

    if (this.validatingForm.valid) {
      this.campaignCreated.active = this.validatingForm.get("active").value;
      this.campaignCreated.dateFrom = this.formatDate(
        this.validatingForm.get("dateFrom").value
      );
      this.campaignCreated.dateTo = this.formatDate(
        this.validatingForm.get("dateTo").value
      );
      this.campaignCreated.logo = this.selectedFile;
      this.campaignCreated.privacy = this.validatingForm.get("privacy").value;
      this.campaignCreated.rules = this.validatingForm.get("rules").value;
      this.campaignCreated.type = this.validatingForm.get("type").value;
      this.campaignCreated.validationData.means = this.validatingForm.get("means").value;
      this.campaignCreated.description = this.validatingForm.get("description").value;
      if (this.validatingForm.get("type").value !== "company") {
        this.campaignCreated.gameId = this.validatingForm.get("gameId").value;
        this.campaignCreated.startDayOfWeek =
          this.validatingForm.get("startDayOfWeek").value;
      }
      // if(this.checkValidDates(this.campaignCreated.dateFrom,this.campaignCreated.dateTo)){
      //   console.log("date non valide");
      //   this.errorMsgValidation = 'DateNotValid';
      //   return;
      // }
      if (this.type === "add") {
        this.campaignCreated.campaignId = this.validatingForm.get("campaignId").value;
        this.campaignCreated.territoryId = this.validatingForm.get("territoryId").value.territoryId;
        this.campaignCreated.name = this.validatingForm.get("name").value;
        try {
          this.campaignService.post(this.campaignCreated).subscribe(
            () => {
              this.onNoClick("", this.campaignCreated);
              this._snackBar.open("Dati salvati", "close");
            },
            (error) => {
              this.errorMsgValidation =
                "Dati non salvati per errore: " + error.error.ex;
              //this._snackBar.open('Dati non salvati per errore: ' +error.error.ex, "close");
            }
          );
        } catch (e) {
          this.errorMsgValidation = "Dati non salvati per errore: " + e;
          //this._snackBar.open('error:' +e.errors, "close");
        }
      }
      if (this.type === "modify") {
        this.campaignCreated.name = this.campaignUpdated.name;
        this.campaignCreated.territoryId = this.campaignUpdated.territoryId;
        this.campaignCreated.campaignId = this.campaignUpdated.campaignId;
        try {
          this.territoryService.put(this.campaignCreated).subscribe(
            () => {
              this.onNoClick("", this.campaignCreated);
              this._snackBar.open("Dati modificati", "close");
            },
            (error) => {
              this._snackBar.open(
                "Modifica dati non avvenuta per errore: " + error.error.ex,
                "close"
              );
            }
          );
        } catch (e) {
          this._snackBar.open("error:" + e.errors, "close");
        }
      }
    }
  }

  upload(file: File): void {
    if (file) {
      this.selectedFile = file;
    }
  }

  formatDate(date: any): string {
    return "2020-01-01";
    console.log(typeof date);
    console.log(date);
    var datee = date + "";
    const res = datee.split("/");
    const day = res[1];
    const month = res[0];
    const year = res[2];
    console.log(year + "-" + month + "-" + day);
    return year + "-" + month + "-" + day;
  }

  checkValidDates(startt: string, endd: string): boolean {
    var dateStart = startt + "";
    var dateEnd = endd + "";
    const start = dateStart.split("-");
    const startDay = +start[2];
    const startMonth = +start[1];
    const startYear = +start[0];
    const end = dateEnd.split("-");
    const endDay = +end[2];
    const endMonth = +end[1];
    const endYear = +end[0];
    console.log(startYear, startMonth, startDay, endYear, endMonth, endDay);
    if (startYear > endYear) {
      return false;
    } else if (startYear < endYear) {
      return true;
    } else {
      //startMonth===endYear
      if (startMonth > endMonth) {
        return false;
      } else if (startMonth < endMonth) {
        return true;
      } else {
        // startMonth===endMonth
        if (startDay >= endDay) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
}
