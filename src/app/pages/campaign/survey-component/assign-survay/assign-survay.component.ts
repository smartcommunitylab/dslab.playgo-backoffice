import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SurveyControllerService } from 'src/app/core/api/generated/controllers/surveyController.service';
import { SurveyRequest } from 'src/app/core/api/generated/model/surveyRequest';
import { SnackbarSavedComponent } from 'src/app/shared/components/snackbar-saved/snackbar-saved.component';
import { MY_DATE_FORMATS, PRE_TEXT_JSON_ASSIGN_SURVAY } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-assign-survay',
  templateUrl: './assign-survay.component.html',
  styleUrls: ['./assign-survay.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AssignSurvayComponent implements OnInit {

  survey: SurveyRequest;
  campaignId:string;
  validatingForm: FormGroup;
  msgError:string;

  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private survayService: SurveyControllerService,
    public dialogRef: MatDialogRef<AssignSurvayComponent>,
   @Inject(MAT_DIALOG_DATA) public data: any,
   private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      playersId: new FormControl("" ),
      dateFrom: new FormControl("",[Validators.required]),
      dateTo: new FormControl("",[Validators.required]),
    });
    this.validatingForm.patchValue({
      challengeDefinition: PRE_TEXT_JSON_ASSIGN_SURVAY
    })
  }

  onNoClick(event: any,body?:SurveyRequest): void {
    this.dialogRef.close(body);
  }

  assign(){
    this.msgError = undefined;
    let startDate = this.validatingForm.get("dateFrom").value ? this.validatingForm.get("dateFrom").value : undefined;
    let endDate = this.validatingForm.get("dateTo").value ? this.validatingForm.get("dateTo").value : undefined; 
    startDate.hour(0).minute(0).second(0);
    endDate.hour(23).minute(59).second(59);
    if(!startDate || !endDate){
      this.msgError = 'dateNotValid';
      return
    } 
    if(this.validatingForm.valid){
      const body:SurveyRequest = {
        start: startDate.valueOf(),
        end: endDate.valueOf(),
        data:{
          bonusPointType: this.survey.data.bonusPointType,
          bonusScore: this.survey.data.bonusScore,
        },
        surveyLink: this.survey.surveyLink,
        surveyName: this.survey.surveyName,
        defaultSurvey: this.survey.defaultSurvey
      };
      if(!this.validDates(body.start,body.end)){
        this.msgError = 'dateNotValid';
        return;
      }
      const players:string = this.validatingForm.get("playersId").value ? this.validatingForm.get("playersId").value : undefined;
      //const idPlayers:string[]= players.split(',');
      this.survayService.assignSurveyChallengesUsingPOST({
        campaignId:this.campaignId,
        body:body,
        playerIds: players,
      }).subscribe(()=>{
        this.onNoClick('',body);
        const text = 'assigned';
        this._snackBar.openFromComponent(SnackbarSavedComponent,
          {
           data:{displayText: text},
           duration: 4999
         });
      },(error)=>{
        this.msgError = this.translate.instant('errorOnAssign') +': ' +  (error? error.error? error.error.ex : 'error' : 'error');
      });
    }else{
      this.msgError = this.translate.instant("fillAllfields");
    }
  }


  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

}
