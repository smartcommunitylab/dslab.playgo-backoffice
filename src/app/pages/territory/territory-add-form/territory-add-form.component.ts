import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapPoint } from 'src/app/shared/classes/map-point';
import { means } from 'src/app/shared/constants/means';

@Component({
  selector: 'app-territory-add-form',
  templateUrl: './territory-add-form.component.html',
  styleUrls: ['./territory-add-form.component.scss']
})
export class TerritoryAddFormComponent implements OnInit {

  myPoint?: MapPoint = null;

  validatingForm: FormGroup;
  controlName: string;
  meansForm = new FormControl();
  means: string[] = means;
  validationParamForm= new FormControl();
  validationParam: string[] = ['param1','param2'];


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({});
  }

  setSelectedPoint(event: MapPoint): void{
    this.myPoint = event;
  }
 


  validate(){}
}
