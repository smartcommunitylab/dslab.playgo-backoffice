import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CampaignControllerService } from 'src/app/core/api/generated/controllers/campaignController.service';
import { AssignSurvayComponent } from './assign-survay/assign-survay.component';
import { DeleteSurvayComponent } from './delete-survay/delete-survay.component';

@Component({
  selector: 'app-survey-component',
  templateUrl: './survey-component.component.html',
  styleUrls: ['./survey-component.component.scss']
})
export class SurveyComponentComponent implements OnInit {

  name: string;
  campaignId:string;
  surveysMap: any;//{ [key: string]: string };
  surveys = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["surveyId", "link", "buttons"];
  newItem;
  msgError:string;

  validatingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private survayService: CampaignControllerService,
    private dialogAssign: MatDialog,
    private dialogDelete: MatDialog,) { }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      surveyId: new FormControl("",[Validators.required] ),
      link: new FormControl("",[Validators.required])
    });
    if(this.surveysMap){
      const keys = Object.keys(this.surveysMap);
      for(let item of keys){
        this.surveys.push({'surveyId': item, 'link': this.surveysMap[item]});
      }
    }
    this.setTableData();
  }

  deleteSurvey(element: any){
    const dialogRef = this.dialogDelete.open(DeleteSurvayComponent, {
      width: "40%",
    });
    let instance = dialogRef.componentInstance;
    instance.surveyId = element.surveyId;
    instance.campaignId = this.campaignId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        let res = [];
        for(let item of this.surveys){
          if(item.surveyId !== result){
            res.push(item);
          }
        }
        this.surveys = res;
        this.setTableData();
      }
    });
  }


  assignSurvey(element: any){
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

  addSurvey(){
    this.msgError = undefined;
    if(this.validatingForm.valid){
      const body = {
        surveyId : this.validatingForm.get('surveyId').value,
        link: this.validatingForm.get('link').value
      }
      this.survayService.addSurveyUsingPOST({
        campaignId: this.campaignId,
        name: body.surveyId,
        link: body.link
      }).subscribe(()=>{
        this.newItem = body;
        this.surveys.push(this.newItem);
        this.setTableData();
      },(error)=>{
        this.msgError = error ? error.error? error.error.ex: 'error' : 'error';
      });
      //TODO call API 
    }
  }

  setTableData() {
    const l = this.surveys.map((x)=>x);
    l.reverse();
    this.dataSource = new MatTableDataSource<any>(l);
  }

}
