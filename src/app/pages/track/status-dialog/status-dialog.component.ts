import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { TrackedInstanceConsoleClass } from "src/app/shared/classes/PageTrackedInstance-class";
import { LIST_ERROR_STATES_TRACK, LIST_STATES_TRACK } from "src/app/shared/constants/constants";
@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
  selectedTrack: TrackedInstanceConsoleClass;
  validatingForm: FormGroup;
  errorMsgValidation: string;
  listStatus= LIST_STATES_TRACK;
  listErrors=LIST_ERROR_STATES_TRACK;
  listMeans=[];
  constructor(private formBuilder: FormBuilder,
    private consoleService: ConsoleControllerService,
    private territoryService: TerritoryControllerService,
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.territoryService.getTerritoryUsingGET(this.selectedTrack.trackedInstance.territoryId).subscribe((territory)=>{
      this.listMeans = territory.territoryData.means;
    });
    this.initializaValidatingForm();
    if(this.selectedTrack.trackedInstance.validationResult.travelValidity !== "VALID")
      this.listStatus = this.listStatus.filter(item=>item.toUpperCase()!==this.selectedTrack.trackedInstance.validationResult.travelValidity);
    
  }

  initializaValidatingForm() {
    this.validatingForm = this.formBuilder.group({
      status: new FormControl("", [Validators.required]),
      error: new FormControl(""),
      distance: new FormControl(""),
      time: new FormControl(""),
      modeType:new FormControl(""),
      notes: new FormControl("")
    });
    this.validatingForm.patchValue({
      //status: this.selectedTrack.trackedInstance.validationResult.travelValidity.toLocaleLowerCase(),
      distance: this.selectedTrack.trackedInstance.validationResult.distance,
      time: this.selectedTrack.trackedInstance.validationResult.time,
      modeType:this.selectedTrack.trackedInstance.validationResult.validationStatus.modeType
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  validate(){
    this.errorMsgValidation = "";
    if(this.validatingForm.valid){
      this.consoleService.updateValidationResultUsingGET(
        this.selectedTrack.trackedInstance.id,
        this.validatingForm.get('status') ? this.validatingForm.get('status').value.toUpperCase() : undefined,
        this.validatingForm.get('modeType') ? this.validatingForm.get('modeType').value : this.selectedTrack.trackedInstance.validationResult.validationStatus.modeType,
        this.validatingForm.get('distance') ? this.validatingForm.get('distance').value : 0,
        this.validatingForm.get('time') ? this.validatingForm.get('time').value : 0,
        this.validatingForm.get('error') || this.validatingForm.get('error').value  ? this.validatingForm.get('error').value : undefined,
        this.validatingForm.get('notes') || this.validatingForm.get('notes').value  ? this.validatingForm.get('notes').value : undefined,
      ).subscribe(()=>{
        this.onNoClick('');
        this._snackBar.open("Dati modificati", "close");
      },
      (error)=>{
        this.errorMsgValidation = "There was an error: " + error + "\n";
      });
    }
  }
}
