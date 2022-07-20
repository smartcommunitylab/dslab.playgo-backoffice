import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MapPoint } from "src/app/shared/classes/map-point";
import { TerritoryArea } from "src/app/shared/classes/territory-area";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { means } from "src/app/shared/constants/means";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TerritoryData } from "src/app/shared/classes/territory-data";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { DEFAULT_LANGUAGE, TranslateService } from "@ngx-translate/core";
import { CONST_LANGUAGES_SUPPORTED, LANGUAGE_DEFAULT } from "src/app/shared/constants/constants";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";
import { TerritoryListService } from "src/app/shared/services/territory-list.service";

@Component({
  selector: "app-territory-add-form",
  templateUrl: "./territory-add-form.component.html",
  styleUrls: ["./territory-add-form.component.scss"],
})
export class TerritoryAddFormComponent implements OnInit {
  @Input() type: string; // can be add or modify
  myPoint?: MapPoint = new MapPoint();

  validatingForm: FormGroup;
  controlName: string;
  means: string[] = means;
  validationParam: string[] = ["param1", "param2"];
  raySelected = 0;
  terrotyCreated: TerritoryClass;
  settedLat = false;
  settedLong = false;
  unlockRaySelector = false;
  terrytoryUpdate: TerritoryClass;
  errorMsgValidation: string;
  languageDefault:any;
  languagesSupported= CONST_LANGUAGES_SUPPORTED;
  languageSelected: string;
  @Input() set formTerritory(value: TerritoryClass) {
    this.terrytoryUpdate = value;
  }

  constructor(
    private territoryService: TerritoryControllerService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TerritoryAddFormComponent>,
    private updateTerritoryList: TerritoryListService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  onNoClick(event: any, territory?: TerritoryClass): void {
    this.dialogRef.close(territory);
  }

  ngOnInit(): void {
    this.languageDefault= this.translate.currentLang;
    this.myPoint = new MapPoint();
    this.terrotyCreated = new TerritoryClass();
    this.terrotyCreated.territoryData = new TerritoryData();
    this.terrotyCreated.territoryData.area = [new TerritoryArea()];
    this.initializaValidatingForm();
  }

  initializaValidatingForm() {
    if (this.type === "add") {
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl("", [
          Validators.required,
          Validators.maxLength(40),
        ]),
        means: new FormControl("", [Validators.required]),
        lat: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]+.?[0-9]*"),
        ]),
        long: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]+.?[0-9]*"),
        ]),
        ray: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]+.?[0-9]*"),
        ]),
        validation: new FormControl(""),
        languages: new FormControl(""),
      });
      this.addFormControlMultilanguage();
    } else {
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl(""),
        means: new FormControl("", [Validators.required]),
        lat: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]+.?[0-9]*"),
        ]),
        long: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]+.?[0-9]*"),
        ]),
        ray: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]+.?[0-9]*"),
        ]),
        validation: new FormControl(""),
        languages: new FormControl(""),
      });
      this.addFormControlMultilanguage();
    }
    this.validatingForm.patchValue({languages: LANGUAGE_DEFAULT});
    this.languageSelected = LANGUAGE_DEFAULT;
    this.validatingForm.get("lat").valueChanges.subscribe((selectedValue) => {
      if (!!selectedValue) {
        this.settedLat = true;
        if (this.settedLong) {
          this.unlockRaySelector = true;
          this.myPoint = new MapPoint(
            selectedValue,
            this.validatingForm.get("long").value
          );
        }
      } else {
        this.settedLat = false;
        this.unlockRaySelector = false;
      }
    });
    this.validatingForm.get("long").valueChanges.subscribe((selectedValue) => {
      if (!!selectedValue) {
        this.settedLong = true;
        if (this.settedLat) {
          this.unlockRaySelector = true;
          this.myPoint = new MapPoint(
            this.validatingForm.get("lat").value,
            selectedValue
          );
        }
      } else {
        this.settedLong = false;
        this.unlockRaySelector = false;
      }
    });
    this.validatingForm.get("ray").valueChanges.subscribe((selectedValue) => {
      setTimeout(() => {
        this.raySelected = selectedValue;
      }, 1);
    });
    if (this.type === "modify") {
      this.validatingForm.patchValue({
        territoryId: this.terrytoryUpdate.territoryId,
        name: this.terrytoryUpdate.name,
        description: this.terrytoryUpdate.description,
        means: this.terrytoryUpdate.territoryData.means,
        lat: this.terrytoryUpdate.territoryData.area[0].lat,
        long: this.terrytoryUpdate.territoryData.area[0].long,
        ray: this.terrytoryUpdate.territoryData.area[0].radius,
        validation: this.terrytoryUpdate.territoryData.validation,
      });
      this.patchValuedMultilanguageOnModify(this.terrytoryUpdate.name,this.terrytoryUpdate.description);
    }
  }

  public myError = (controlName: string, errorName: string) => {
    return this.validatingForm.controls[controlName].hasError(errorName);
  };

  setSelectedPoint(event: MapPoint): void {
    this.validatingForm.get("lat").setValue(event.latitude);
    this.validatingForm.get("long").setValue(event.longitude);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "km";
    }

    return value;
  }

  setRay(event: any) {
    this.validatingForm.get("ray").setValue(event);
    this.raySelected = event;
  }

  validate() {
    this.errorMsgValidation = "";
    if (this.validatingForm.valid) {
      this.terrotyCreated.territoryId =
        this.validatingForm.get("territoryId").value;
      this.addNameAndDescriptionToTerritoryCreated();
      this.terrotyCreated.territoryData.means =
        this.validatingForm.get("means").value;
      this.terrotyCreated.territoryData.validation =
        this.validatingForm.get("validation").value;
      this.terrotyCreated.territoryData.area[0].lat =
        this.validatingForm.get("lat").value;
      this.terrotyCreated.territoryData.area[0].long =
        this.validatingForm.get("long").value;
      this.terrotyCreated.territoryData.area[0].radius =
        this.validatingForm.get("ray").value;
      if (this.type === "add") {
        this.territoryService
          .saveTerritoryUsingPOST(this.terrotyCreated)
          .subscribe(
            () => {
              this.updateTerritoryList.uploadList();
              this.onNoClick("", this.terrotyCreated);
            this._snackBar.openFromComponent(SnackbarSavedComponent,
              {
               data:{displayText: "savedData"},
               duration: 4999
             });
            },
            (error) => {
              this.errorMsgValidation =
                this.translate.instant("dataNotSavedForError") +
                ": " +
                (!!error
                  ? error.error
                    ? error.error.ex
                    : error.error
                  : error);
            }
          );
      }
      if (this.type === "modify") {
        this.terrotyCreated.name = this.terrytoryUpdate.name;
        this.terrotyCreated.territoryId = this.terrytoryUpdate.territoryId;
        this.territoryService
          .updateTerritoryUsingPUT(this.terrotyCreated)
          .subscribe(
            () => {
              this.onNoClick("", this.terrotyCreated);
              this._snackBar.openFromComponent(SnackbarSavedComponent,
                {
                 data:{displayText: "updatedData"},
                 duration: 4999
               });
            },
            (error) => {
              this.errorMsgValidation =
                this.translate.instant("dataNotUpdatedForError") +
                ": " +
                (!!error
                  ? error.error
                    ? error.error.ex
                    : error.error
                  : error);
            }
          );
      }
    }else{
      if(!this.validatingForm.get('name'+LANGUAGE_DEFAULT).valid){
        this.errorMsgValidation = this.translate.instant("selectDefaultLanuguageForName") + LANGUAGE_DEFAULT;
      }else{
        this.errorMsgValidation = this.translate.instant("fillAllfields");
      }
    }
  }

  get descriptionRichControl() {
    const name = 'description' + this.languageSelected;
    return this.validatingForm.controls[name] as FormControl;
  }

  selectedLanguageClick(event: any){
    this.languageSelected = event;
  }

  addFormControlMultilanguage(){
    for(let l of this.languagesSupported){
      const nameName = 'name'+ l;
      const nameDescription = 'description'+ l;
      let controlName;
      let controlDescription = new FormControl("");
      if(l===LANGUAGE_DEFAULT){
        controlName = new FormControl("", [Validators.required,Validators.maxLength(40)]);
      }else{
        controlName = new FormControl("", [Validators.maxLength(40)]);
      }
      this.validatingForm.addControl(nameName,controlName);
      this.validatingForm.addControl(nameDescription,controlDescription);
    }
  }

  patchValuedMultilanguageOnModify(nameLanguages: { [key: string]: string },descriptionLanguages: { [key: string]: string }){
    for(let l of this.languagesSupported){
      var nameName = 'name'+ l;
      var nameDescription = 'description'+ l;
      var obj ={};
      obj[nameName] = nameLanguages[l];
      obj[nameDescription] = descriptionLanguages[l];
      this.validatingForm.patchValue(obj);
    }
  }

  addNameAndDescriptionToTerritoryCreated(){
    var nameObj:{ [key: string]: string } = {};
    var descriptionObj:{ [key: string]: string } = {};
    for(let l of this.languagesSupported){
      var nameName = 'name'+l;
      var nameDescription = 'description'+l;
      nameObj[l] = this.validatingForm.get(nameName).value ? this.validatingForm.get(nameName).value : '';
      descriptionObj[l]= this.validatingForm.get(nameDescription).value ? this.validatingForm.get(nameDescription).value : '';
    }
    this.terrotyCreated.name = nameObj;
    this.terrotyCreated.description = descriptionObj;
  }

}
