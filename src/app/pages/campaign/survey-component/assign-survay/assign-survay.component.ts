import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PRE_TEXT_JSON_ASSIGN_SURVAY } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-assign-survay',
  templateUrl: './assign-survay.component.html',
  styleUrls: ['./assign-survay.component.scss']
})
export class AssignSurvayComponent implements OnInit {

  surveyId:string;
  validatingForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AssignSurvayComponent>,
   @Inject(MAT_DIALOG_DATA) public data: any,
   private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      playersId: new FormControl("" ),
      challengeDefinition: new FormControl("",[Validators.required])
    });
    this.validatingForm.patchValue({
      challengeDefinition: PRE_TEXT_JSON_ASSIGN_SURVAY
    })
  }

  onNoClick(event: any,id?: String): void {
    this.dialogRef.close(id);
  }

  assign(){
    //TODO stuff
    if(this.validatingForm.valid){

    }
  }

}
