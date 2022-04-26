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
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  @Input() set formTerritory(value : TerritoryClass){
    this.initializaValidatingForm();
    this.terrytoryUpdate = value;
    this.myPoint = new MapPoint(this.terrytoryUpdate.territoryData.area[0].lat,this.terrytoryUpdate.territoryData.area[0].long);
    console.log("my point inside territory add form", this.myPoint);
    this.raySelected = +this.terrytoryUpdate.territoryData.area[0].radius;
    this.unlockRaySelector = true;
    console.log("update territoryu", this.terrytoryUpdate);
  }


  constructor(private territoryService: TerritoryService,private formBuilder: FormBuilder,
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
    //this.unlockRaySelector = true;
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
              this.onNoClick('',this.terrotyCreated);
              this._snackBar.open("Dati salvati", "close");
          },
          (error) =>{
            this._snackBar.open('Dati non salvati per errore: ' +error.error.ex, "close");

          }
          );
        }catch(e){
          this._snackBar.open('error:' +e.errors, "close");
        }
      }
      if(this.type==='modify'){
        this.terrotyCreated.name = this.terrytoryUpdate.name;
        this.terrotyCreated.territoryId = this.terrytoryUpdate.territoryId;
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
    }
    
  }

  toggleDescription(){
    this.stateDescription = this.stateDescription === 'collapsed' ? 'expanded' : 'collapsed';
  }


  get descriptionRichControl() {
    return this.validatingForm.controls.description as FormControl;
  }




}
