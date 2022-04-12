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
import { CampaignClass } from 'src/app/shared/classes/campaing-class';

@Component({
  selector: 'app-campaign-add-form',
  templateUrl: './campaign-add-form.component.html',
  styleUrls: ['./campaign-add-form.component.scss']
})
export class CampaignAddFormComponent implements OnInit {


  @Input() type: string; // can be add or modify

  validatingForm: FormGroup;
  campaignCreated: CampaignClass;
  campaignUpdated:CampaignClass;
  @Input() set formTerritory(value : CampaignClass){
    this.initializaValidatingForm();
    this.campaignUpdated = value;
  }


  constructor(private territoryService: TerritoryService,private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CampaignAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    ) {
      
    }

  onNoClick(event: any,territory?: TerritoryClass): void {
    this.dialogRef.close(territory);
  }

  ngOnInit(): void {
    this.campaignCreated = new CampaignClass();
    this.initializaValidatingForm();

  }

  initializaValidatingForm(){
    if(this.type==='add'){
      this.validatingForm = this.formBuilder.group({


        territoryId: new FormControl('', [Validators.required]),
        campaignId: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        privacy: new FormControl('', [Validators.required]),
        rules: new FormControl('', [Validators.required]),
        means: new FormControl('', [Validators.required]),
        active: new FormControl('', [Validators.required]),
        dateFrom: new FormControl('', [Validators.required]),
        dateTo: new FormControl('', [Validators.required]),
        gameId: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        typeFields: new FormControl('', [Validators.required])
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
 


  validate(){
    const p = this.validatingForm.get('name').value;

    if(this.validatingForm.valid){
      /*this.terrotyCreated.territoryId = this.validatingForm.get('territoryId').value; 
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
      } */
    }
    
  }




}
