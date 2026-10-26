import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { CampaignAcceptanceControllerService } from "src/app/core/api/generated/controllers/campaignAcceptanceController.service";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

@Component({
  selector: "app-campaign-acceptance",
  templateUrl: "./campaign-acceptance.component.html",
  styleUrls: ["./campaign-acceptance.component.scss"],
})
export class CampaignAcceptanceComponent implements OnInit {
  name: string;
  campaignId: string;
  validatingForm: FormGroup;
  errorMsg: string;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CampaignAcceptanceComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private campaignAcceptanceService: CampaignAcceptanceControllerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      privacyAcceptance: new FormControl(null, [Validators.required]),
      rulesAcceptance: new FormControl(null, [Validators.required]),
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  saveData() {
    this.errorMsg = undefined;
    if (!this.validatingForm.valid) {
      this.errorMsg = this.translate.instant("fillAllfields");
      this.validatingForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.campaignAcceptanceService
      .updateSubscriptionsAcceptanceUsingPUT({
        campaignId: this.campaignId,
        privacyAcceptance: this.validatingForm.get("privacyAcceptance").value,
        rulesAcceptance: this.validatingForm.get("rulesAcceptance").value,
      })
      .subscribe(
        () => {
          this.saving = false;
          this.dialogRef.close(true);
          const text = this.translate.instant("savedData");
          this._snackBar.openFromComponent(SnackbarSavedComponent, {
            data: { displayText: text },
            duration: 4999,
          });
        },
        (error) => {
          this.saving = false;
          this.errorMsg =
            this.translate.instant("errorRulesPrivacyAcceptance") +
            ": " +
            (error.error && error.error.ex ? error.error.ex : error.toString());
        }
      );
  }
}
