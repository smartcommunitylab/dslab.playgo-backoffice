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
  defaultSurveyCheck = false;
  name: string;
  campaignId: string;
  surveys: SurveyRequest[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["defaultSurvey", "surveyName", "surveyLink","type","score", "buttons"];
  newItem: SurveyRequest;
  msgError: string;
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
      surveyName: new FormControl("", [Validators.required]),
      surveyLink: new FormControl("", [Validators.required]),
      defaultSurvey: new FormControl(""),
      bonusPoint: new FormControl("", [Validators.required]),
      bonusScore: new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      defaultSurvey: "-",
    });
    this.campaignService.getCampaignUsingGET(this.campaignId).subscribe((result)=>{
      this.surveys = result.surveys;
      this.setTableData();
    });

  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  deleteSurvey(element: any) {
    const dialogRef = this.dialogDelete.open(DeleteSurvayComponent, {
      width: "40%",
    });
    let instance = dialogRef.componentInstance;
    instance.surveyName = element.surveyName;
    instance.campaignId = this.campaignId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        let res = [];
        for (let item of this.surveys) {
          if (item.surveyName !== result) {
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
    instance.survey = element;
    instance.campaignId = this.campaignId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // for(let i =0;i<this.surveys.length;i++){
        //   if(this.surveys[i].surveyName === result.surveyName){
        //     this.surveys[i] = result;
        //   }
        // }
        // this.setTableData();
      }
    });
  }

  addSurvey() {
    this.msgError = undefined;
    if (this.validatingForm.valid) {
      if(this.defaultSurveyCheck && this.defaultSurveyExist()){
        this.msgError = this.translate.instant("notPossibleToCreateAnotherDefaultSurvey");
        return;
      }
      var surveryReq: SurveyRequest =  {
        data: {
          bonusPointType: this.validatingForm.get("bonusPoint").value ? this.validatingForm.get("bonusPoint").value : undefined,
          bonusScore: this.validatingForm.get("bonusScore").value ? this.validatingForm.get("bonusScore").value : undefined,
        },
        defaultSurvey: this.defaultSurveyCheck,
        end: undefined,
        start: undefined,
        surveyLink: this.validatingForm.get("surveyLink").value,
        surveyName: this.validatingForm.get("surveyName").value
      }
        this.survayService
          .addSurveyUsingPOST({
            campaignId: this.campaignId,
            body: surveryReq
          })
          .subscribe(
            () => {
              this.newItem = surveryReq;
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
    } else {
      this.msgError = this.translate.instant("fillAllfields");
      this.validatingForm.markAllAsTouched();
    }
  }
  defaultSurveyExist():boolean{
    return (this.surveys.filter(item=>item.defaultSurvey)).length >0; 
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.surveys);
  }

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  fromTimestampToDate(timestamp: any) : string{
    if(timestamp===0){
      return "-";
    }
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
