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
  nameForUpdate: string;
  idForUpdate: string;
  @Input() set formTerritory(value : TerritoryClass){
    //if(this.validatingForm===undefined){
      this.initializaValidatingForm();
    //}
    this.idForUpdate = value.territoryId;
    this.nameForUpdate = value.name;
    this.validatingForm.get('description').setValue(value.description);
    // (<HTMLInputElement>document.getElementById('means')).value = value.territoryData.means.toString();
    // (<HTMLInputElement>document.getElementById('validation')).value = value.territoryData.validation;
    // (<HTMLInputElement>document.getElementById('lat')).value = value.territoryData.area.lat;
    // (<HTMLInputElement>document.getElementById('long')).value = value.territoryData.area.long;
    // (<HTMLInputElement>document.getElementById('ray')).value = value.territoryData.area.ray;

    console.log(value, "from dialog")

    this.validatingForm.get('id').setValue(value.territoryId);
    this.validatingForm.get('name').setValue(value.name);
    this.validatingForm.get('description').setValue(value.description);
    this.validatingForm.get('means').setValue(value.territoryData.means);
    this.validatingForm.get('validation').setValue(value.territoryData.validation);
    this.validatingForm.get('lat').setValue(value.territoryData.area[0].lat);
    this.validatingForm.get('long').setValue(value.territoryData.area[0].long);
    this.validatingForm.get('ray').setValue(value.territoryData.area[0].radius);
    this.myPoint = new MapPoint(value.territoryData.area[0].lat,value.territoryData.area[0].long);
    this.raySelected = +value.territoryData.area[0].radius;
  }
  terrotyCreated: TerritoryClass;
  settedLat = false;
  settedLong = false;


  constructor(private territoryService: TerritoryService,private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    ) {
      
    }

  onNoClick(event: any,territory?: TerritoryClass): void {
    this.dialogRef.close(territory);
    console.log("closed",territory);
  }

  ngOnInit(): void {
    this.myPoint = new MapPoint();
    this.terrotyCreated = new TerritoryClass();
    this.terrotyCreated.territoryData = new TerritoryData();
    this.terrotyCreated.territoryData.area =[ new TerritoryArea()]; 
    this.initializaValidatingForm();

  }

  initializaValidatingForm(){
    if(this.type==='add'){
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl('', [Validators.required, Validators.maxLength(40)]), 
        name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
        description: new FormControl(''),
        means: new FormControl('', [Validators.required]),
        lat: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+.?[0-9]*")]),
        long: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+.?[0-9]*")]),
        ray: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+.?[0-9]*")]),
        validation: new FormControl('')
      });
    }else{
    this.validatingForm = this.formBuilder.group({
      territoryId: new FormControl('', []), 
      name: new FormControl('', []),
      description: new FormControl(''),
      means: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+.?[0-9]*")]),
      long: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+.?[0-9]*")]),
      ray: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+.?[0-9]*")]),
      validation: new FormControl('')
    });
    }
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
      this.terrotyCreated.territoryId = this.validatingForm.get('territoryId').value; 
      this.terrotyCreated.name = this.validatingForm.get('name').value;
      this.terrotyCreated.description = this.validatingForm.get('description').value;
      this.terrotyCreated.territoryData.means = this.validatingForm.get('means').value;
      this.terrotyCreated.territoryData.validation = this.validatingForm.get('validation').value;
      this.terrotyCreated.territoryData.area[0].lat = this.validatingForm.get('lat').value;
      this.terrotyCreated.territoryData.area[0].long = this.validatingForm.get('long').value;
      this.terrotyCreated.territoryData.area[0].radius = this.validatingForm.get('ray').value;
      if(this.type==='add'){
        try{
          this.territoryService.post(this.terrotyCreated).subscribe(
            () => {  
              console.log("correct post");
              this.onNoClick('',this.terrotyCreated);
              this._snackBar.open("Dati salvati", "close");
          },
          (error) =>{
            this._snackBar.open('Dati non salvati per errore: ' +error.error.ex, "close");

          }
          );
        }catch(e){
          console.log(e);
          this._snackBar.open('error:' +e.errors, "close");
        }
      }
      if(this.type==='modify'){
        this.terrotyCreated.name = this.nameForUpdate;
        this.terrotyCreated.territoryId = this.idForUpdate;
        console.log(this.terrotyCreated);
        try{
          this.territoryService.put(this.terrotyCreated).subscribe(
            () =>{
              this.onNoClick('',this.terrotyCreated);
              this._snackBar.open("Dati modificati", "close");
            },
            (error) =>{
              this._snackBar.open('Modifica dati non avvenuta per errore: ' +error.error.ex, "close");
  
            }
          );

        }catch(e){
          this._snackBar.open('error:' +e.errors, "close");
        }
      } 
      console.log(this.terrotyCreated);
      console.log("go to new page"); // close page
    }else
    {console.log("show errors11");}
    
  }




}
