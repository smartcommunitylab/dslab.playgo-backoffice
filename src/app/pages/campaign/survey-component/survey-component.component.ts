import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { SurveyControllerService } from "src/app/core/api/generated/controllers/surveyController.service";
import { SurveyRequest } from "src/app/core/api/generated/model/surveyRequest";
import {
  DEFAULT_SURVEY_KEY,
  MY_DATE_FORMATS,
} from "src/app/shared/constants/constants";
import { AssignSurvayComponent } from "./assign-survay/assign-survay.component";
import { DeleteSurvayComponent } from "./delete-survay/delete-survay.component";

@Component({
  selector: "app-survey-component",
  templateUrl: "./survey-component.component.html",
  styleUrls: ["./survey-component.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class SurveyComponentComponent implements OnInit {
  defaultKey = DEFAULT_SURVEY_KEY;
  name: string;
  campaignId: string;
  defaultSurvey: SurveyRequest;
  surveysMap: any; //{ [key: string]: string };
  surveys = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["default", "surveyId", "link", "buttons"];
  newItem;
  msgError: string;
  validationDefault: FormGroup;
  validatingForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SurveyComponentComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private survayService: CampaignControllerService,
    private campaignService: CampaignControllerService,
    private dialogAssign: MatDialog,
    private dialogDelete: MatDialog
  ) {}

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      surveyId: new FormControl("", [Validators.required]),
      link: new FormControl("", [Validators.required]),
      defaultSurvey: new FormControl(""),
    });
    this.validatingForm.patchValue({
      defaultSurvey: "-",
    });
    this.validationDefault = this.formBuilder.group({
      dateFrom: new FormControl("", [Validators.required]),
      dateTo: new FormControl("", [Validators.required]),
      bonusPoint: new FormControl("", [Validators.required]),
      bonusScore: new FormControl("", [Validators.required]),
    });
    if (this.surveysMap) {
      const keys = Object.keys(this.surveysMap);
      for (let item of keys) {
        this.surveys.push({
          surveyId: item,
          link: this.surveysMap[item],
          default: false,
        });
      }
    }
    if (!!this.defaultSurvey) {
      this.surveys.push({
        surveyId: this.defaultSurvey.surveyName,
        link: this.defaultSurvey.surveyLink,
        default: true,
      });
    }

    this.setTableData();
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  deleteSurvey(element: any) {
    const dialogRef = this.dialogDelete.open(DeleteSurvayComponent, {
      width: "40%",
    });
    let instance = dialogRef.componentInstance;
    instance.surveyId = element.surveyId;
    instance.campaignId = this.campaignId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        let res = [];
        for (let item of this.surveys) {
          if (item.surveyId !== result) {
            res.push(item);
          }
        }
        this.surveys = res;
        this.setTableData();
      }
    });
  }

  assignSurvey(element: any) {
    const dialogRef = this.dialogDelete.open(AssignSurvayComponent, {
      width: "55%",
    });
    let instance = dialogRef.componentInstance;
    instance.surveyId = element.surveyId;
    instance.surveyLink = element.link;
    instance.campaignId = this.campaignId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }

  addSurvey() {
    this.msgError = undefined;
    if (this.validatingForm.valid) {
      if (this.validatingForm.get(this.defaultKey).value === this.defaultKey) {
        if (!this.validationDefault.valid) {
          this.validationDefault.markAllAsTouched();
          return;
        } else {
          var body: SurveyRequest = {
            data: {
              bonusPointType: this.validationDefault.get("bonusPoint").value,
              bonusScore: this.validationDefault.get("bonusScore").value,
            },
            end: this.validationDefault.get("dateTo").value.valueOf(),
            start: this.validationDefault.get("dateFrom").value.valueOf(),
            surveyLink: this.validatingForm.get("link").value,
            surveyName: this.validatingForm.get("surveyId").value,
          };
          this.campaignService
            .getCampaignUsingGET(this.campaignId)
            .subscribe((result) => {
              result.specificData = {};
              result.specificData[this.defaultKey] = body;
              this.campaignService
                .updateCampaignUsingPUT(result)
                .subscribe(() => {
                  this.newItem = {
                    surveyId: body.surveyName,
                    link: body.surveyLink,
                    default: true,
                  };
                  this.surveys.push(this.newItem);
                  this.setTableData();
                });
            });
        }
      } else {
        const body = {
          surveyId: this.validatingForm.get("surveyId").value,
          link: this.validatingForm.get("link").value,
        };
        this.survayService
          .addSurveyUsingPOST({
            campaignId: this.campaignId,
            name: body.surveyId,
            link: body.link,
          })
          .subscribe(
            () => {
              this.newItem = body;
              this.surveys.push(this.newItem);
              this.setTableData();
            },
            (error) => {
              this.msgError = error
                ? error.error
                  ? error.error.ex
                  : "error"
                : "error";
            }
          );
      }
    } else {
      this.msgError = this.translate.instant("fillAllfields");
      this.validationDefault.markAllAsTouched();
    }
  }

  setTableData() {
    const l = this.surveys.map((x) => x);
    l.reverse();
    this.dataSource = new MatTableDataSource<any>(l);
  }
}
