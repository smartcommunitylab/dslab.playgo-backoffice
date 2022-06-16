import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
  surveys = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["surveyId", "link", "buttons"];
  newItem;

  validatingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogAssign: MatDialog,
    private dialogDelete: MatDialog,) { }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      surveyId: new FormControl("",[Validators.required] ),
      link: new FormControl("",[Validators.required])
    });
    this.setTableData();
  }

  deleteSurvey(element: any){
    const dialogRef = this.dialogDelete.open(DeleteSurvayComponent, {
      width: "40%",
    });
    let instance = dialogRef.componentInstance;
    instance.surveyId = element.surveyId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.setTableData();
      }
    });
  }


  assignSurvey(element: any){
    const dialogRef = this.dialogDelete.open(AssignSurvayComponent, {
      width: "40%",
    });
    let instance = dialogRef.componentInstance;
    instance.surveyId = element.surveyId;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }

  addSurvey(){
    if(this.validatingForm.valid){
      const body = {
        surveyId : this.validatingForm.get('surveyId').value,
        link: this.validatingForm.get('link').value
      }
      this.newItem = body;
      this.surveys.push(this.newItem);
      this.setTableData();
      //TODO call API 
    }
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.surveys);
  }

}
