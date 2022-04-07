import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapPoint } from 'src/app/shared/classes/map-point';
import { TerritoryArea } from 'src/app/shared/classes/territory-area';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
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
  raySelected = 0;
  terrotyCreated: TerritoryClass;


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.terrotyCreated = new TerritoryClass();
    this.terrotyCreated.area = new TerritoryArea(); 
    this.validatingForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      description: new FormControl(''),
      means: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      long: new FormControl('', [Validators.required]),
      ray: new FormControl('', [Validators.required]),
      validation: new FormControl('')
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.validatingForm.controls[controlName].hasError(errorName);
    }

  setSelectedPoint(event: MapPoint): void{
    this.myPoint = event;
    console.log(this.myPoint);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'km';
    }

    return value;
  }
 


  validate(){}
}
