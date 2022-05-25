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
import { LIST_STATES_TRACK } from "src/app/shared/constants/constants";
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
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initializaValidatingForm();
  }

  initializaValidatingForm() {
    this.validatingForm = this.formBuilder.group({
      status: new FormControl("", [Validators.required]),
      distance: new FormControl(""),
      time: new FormControl(""),
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  validate(){
    this.errorMsgValidation = "";
    if(this.validatingForm.valid){
      //TODO do change
    }
  }
}
