import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapPoint } from 'src/app/shared/classes/map-point';
import { TerritoryArea } from 'src/app/shared/classes/territory-area';
import { TerritoryClass } from 'src/app/shared/classes/territory-class';
import { means } from 'src/app/shared/constants/means';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TerritoryData } from 'src/app/shared/classes/territory-data';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TerritoryControllerService } from 'src/app/core/api/generated/controllers/territoryController.service';

@Component({
  selector: 'app-territory-add-form',
  templateUrl: './territory-add-form.component.html',
  styleUrls: ['./territory-add-form.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class TerritoryAddFormComponent implements OnInit {

  @Input() type: string; // can be add or modify
  myPoint?: MapPoint = new MapPoint();

  validatingForm: FormGroup;
  controlName: string;
  means: string[] = means;
  validationParam: string[] = ['param1','param2'];
  raySelected = 0;
  terrotyCreated: TerritoryClass;
  settedLat = false;
  settedLong = false;
  unlockRaySelector = false;
  terrytoryUpdate: TerritoryClass;
  stateDescription: string="collapsed";
  errorMsgValidation: string;
  @Input() set formTerritory(value : TerritoryClass){
    this.terrytoryUpdate = new TerritoryClass();
    this.terrytoryUpdate.name = value.name;
    this.terrytoryUpdate.territoryId = value.territoryId
    this.terrytoryUpdate.description = value.description
    this.terrytoryUpdate.messagingAppId = value.messagingAppId
    this.terrytoryUpdate.territoryData = new TerritoryData();
    this.terrytoryUpdate.territoryData.means = value.territoryData.means;
    this.terrytoryUpdate.territoryData.validation = value.territoryData.validation;
    this.terrytoryUpdate.territoryData.area = [];
    if(!!value.territoryData.area){
      for(let area_i of value.territoryData.area){
        let newArea = new TerritoryArea();
        if(!!area_i){
          newArea.lat = area_i.lat;
          newArea.long = area_i.long;
          newArea.radius = area_i.radius;
          this.terrytoryUpdate.territoryData.area.push(newArea);
        }
      }
    }
  }


  constructor(
    private territoryService: TerritoryControllerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    ) {
      
    }

  onNoClick(event: any,territory?: TerritoryClass): void {
    this.dialogRef.close(territory);
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
      territoryId: new FormControl(''), 
      name: new FormControl(''),
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
      setTimeout(()=>{
        this.raySelected = selectedValue;
      },1);
    });
    if(this.type==='modify'){
    this.validatingForm.patchValue({
      territoryId: this.terrytoryUpdate.territoryId, 
      name: this.terrytoryUpdate.name,
      description: this.terrytoryUpdate.description,
      means: this.terrytoryUpdate.territoryData.means,
      lat: this.terrytoryUpdate.territoryData.area[0].lat,
      long: this.terrytoryUpdate.territoryData.area[0].long,
      ray: this.terrytoryUpdate.territoryData.area[0].radius,
      validation: this.terrytoryUpdate.territoryData.validation
    });
    }
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.validatingForm.controls[controlName].hasError(errorName);
    }

  setSelectedPoint(event: MapPoint): void{
    this.validatingForm.get('lat').setValue(event.latitude);
    this.validatingForm.get('long').setValue(event.longitude);
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
    this.errorMsgValidation = "";
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
          this.territoryService.saveTerritoryUsingPOST(this.terrotyCreated).subscribe(
            () => {
              this.onNoClick('',this.terrotyCreated);
              this._snackBar.open("Dati salvati", "close");
          },
          (error) =>{
            this.errorMsgValidation ='Dati non salvati per errore: ' +error.error.ex, "close";
            //this._snackBar.open('Dati non salvati per errore: ' +error.error.ex, "close");

          }
          );
        }catch(e){
          this.errorMsgValidation ='error:' +e.errors;
          //this._snackBar.open('error:' +e.errors, "close");
        }
      }
      if(this.type==='modify'){
        this.terrotyCreated.name = this.terrytoryUpdate.name;
        this.terrotyCreated.territoryId = this.terrytoryUpdate.territoryId;
        try{
          this.territoryService.updateTerritoryUsingPUT(this.terrotyCreated).subscribe(
            () =>{
              this.onNoClick('',this.terrotyCreated);
              this._snackBar.open("Dati modificati", "close");
            },
            (error) =>{
              this.errorMsgValidation ='Modifica dati non avvenuta per errore: ' +error.error.ex;
            }
          );

        }catch(e){
          this.errorMsgValidation = 'error:' +e.errors;
        }
      } 
    }
    
  }

  toggleDescription(){
    this.stateDescription = this.stateDescription === 'collapsed' ? 'expanded' : 'collapsed';
  }


  get descriptionRichControl() {
    return this.validatingForm.controls.description as FormControl;
  }




}
