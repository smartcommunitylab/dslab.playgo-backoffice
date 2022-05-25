import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TrackedInstanceConsoleClass } from "src/app/shared/classes/PageTrackedInstance-class";

@Component({
  selector: "app-distance-dialog",
  templateUrl: "./distance-dialog.component.html",
  styleUrls: ["./distance-dialog.component.scss"],
})
export class DistanceDialogComponent implements OnInit {
  selectedTrack: TrackedInstanceConsoleClass;
  validatingForm: FormGroup;
  errorMsgValidation: string;
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DistanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initializaValidatingForm();
  }

  initializaValidatingForm() {
    this.validatingForm = this.formBuilder.group({
      distance: new FormControl("", [Validators.required]),
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  validate(){
    this.errorMsgValidation = "";
    if(this.validatingForm.valid){
      //TODO do change

      // this.campaignService.uploadCampaignLogoUsingPOST(this.campaignCreated.campaignId,formData).subscribe(
      //   () => {
      //     this.onNoClick("");
      //     this._snackBar.open("Dati modificati", "close");
      //   },
      //   (error) => {
      //     if(error.error && error.error.ex)
      //      this.errorMsgValidation = "Dati non midificati Per errore: " + error.error.ex +"\n";})
    }
  }

}
