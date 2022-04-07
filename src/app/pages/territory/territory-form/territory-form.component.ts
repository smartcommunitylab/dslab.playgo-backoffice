import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-territory-form',
  templateUrl: './territory-form.component.html',
  styleUrls: ['./territory-form.component.scss']
})
export class TerritoryFormComponent implements OnInit {

  validatingForm: FormGroup;
  controlName: string;


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({});
  }

  validate(){}

}
