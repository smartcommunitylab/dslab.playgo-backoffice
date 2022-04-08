import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapPoint } from 'src/app/shared/classes/map-point';
import { TerritoryArea } from 'src/app/shared/classes/territory-area';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
import { means } from 'src/app/shared/constants/means';
import { TerritoryService } from 'src/app/shared/services/territory.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TerritoryData } from 'src/app/shared/classes/territory-data';

@Component({
  selector: 'app-territory-add-form',
  templateUrl: './territory-add-form.component.html',
  styleUrls: ['./territory-add-form.component.scss']
})
export class TerritoryAddFormComponent implements OnInit {

  @Input() type: string; // can be add or modify
  myPoint?: MapPoint = new MapPoint();

  validatingForm: FormGroup;
  controlName: string;
  meansForm = new FormControl();
  means: string[] = means;
  validationParamForm= new FormControl();
  validationParam: string[] = ['param1','param2'];
  raySelected = 0;
  unlockRaySelector = false;
  terrotyCreated: TerritoryClass;
  settedLat = false;
  settedLong = false;


  constructor(private territoryService: TerritoryService,private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.myPoint = new MapPoint();
    this.terrotyCreated = new TerritoryClass();
    this.terrotyCreated.territoryData = new TerritoryData();
    this.terrotyCreated.territoryData.area = new TerritoryArea(); 
    this.validatingForm = this.formBuilder.group({
      territoryId: new FormControl('', [Validators.required, Validators.maxLength(40)]), 
      name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      description: new FormControl(''),
      means: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      long: new FormControl('', [Validators.required]),
      ray: new FormControl('', [Validators.required]),
      validation: new FormControl('')
    });
    this.validatingForm.get('lat').valueChanges.subscribe(selectedValue => {
      if(!!selectedValue){
        this.settedLat = true;
        if(this.settedLong){
          this.unlockRaySelector = true;
          this.myPoint= new MapPoint(selectedValue,this.validatingForm.get('long').value);
        }
      }else{
        this.settedLat = false;
        this.unlockRaySelector = false;
      }

    });
    this.validatingForm.get('long').valueChanges.subscribe(selectedValue => {
      if(!!selectedValue){
        this.settedLong = true;
        if(this.settedLat){
          this.unlockRaySelector = true;
          this.myPoint = new MapPoint(this.validatingForm.get('lat').value,selectedValue);
        }
      }else{
        this.settedLong = false;
        this.unlockRaySelector = false;
      }
    });
    this.validatingForm.get('ray').valueChanges.subscribe(selectedValue => {
      this.raySelected = selectedValue;
    });

  }

  public myError = (controlName: string, errorName: string) =>{
    return this.validatingForm.controls[controlName].hasError(errorName);
    }

  setSelectedPoint(event: MapPoint): void{
    this.validatingForm.get('lat').setValue(event.latitude);
    this.validatingForm.get('long').setValue(event.longitude);
    this.unlockRaySelector = true;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'km';
    }

    return value;
  }
 
  setRay(event : any){
    this.validatingForm.get('ray').setValue(event);
    this.raySelected = event;
  }


  validate(){
    const p = this.validatingForm.get('name').value;
    if(this.validatingForm.valid){
      this.terrotyCreated.name = this.validatingForm.get('name').value;
      this.terrotyCreated.description = this.validatingForm.get('description').value;
      this.terrotyCreated.territoryData.means = this.validatingForm.get('means').value;
      this.terrotyCreated.territoryData.validation = this.validatingForm.get('validation').value;
      this.terrotyCreated.territoryData.area.lat = this.validatingForm.get('lat').value;
      this.terrotyCreated.territoryData.area.long = this.validatingForm.get('long').value;
      this.terrotyCreated.territoryData.area.ray = this.validatingForm.get('ray').value;
      if(this.type==='add'){
        try{
          this.territoryService.post(this.terrotyCreated).subscribe();
          console.log("correct post");
          this.onNoClick('');
          //this._snackBar.open("Dati salvati", "close");
        }catch(e){
          console.log(e);
          //this._snackBar.open(e, "close");
        }
      }
      if(this.type==='modify'){
        this.territoryService.put(this.terrotyCreated);
      }
      console.log(this.terrotyCreated);
      console.log("go to new page"); // close page
    }else
    {console.log("show errors");}
    
  }




}
