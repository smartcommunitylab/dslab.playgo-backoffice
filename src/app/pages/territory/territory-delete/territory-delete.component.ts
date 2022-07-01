import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { TranslateService } from "@ngx-translate/core";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

@Component({
  selector: "app-territory-delete",
  templateUrl: "./territory-delete.component.html",
  styleUrls: ["./territory-delete.component.scss"],
})
export class TerritoryDeleteComponent implements OnInit {
  territoryId: string;
  msgError: string;
  error: string;
  constructor(
    private territoryService: TerritoryControllerService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<TerritoryDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onNoClick(event: any, id?: String): void {
    this.dialogRef.close(id);
  }

  delete() {
    this.territoryService
      .deleteTerritoryUsingDELETE(this.territoryId)
      .subscribe(
        () => {
          this.onNoClick("", this.territoryId);
          this._snackBar.openFromComponent(SnackbarSavedComponent,
            {
             data:{displayText: "deletedTerritory"},
             duration: 4999
           });
        },
        (error) => {
          //console.log("ciaoo", error);
          this.msgError = this.translate.instant("cannotDeleteTerritory");
          if (!!error && !!error.error && !!error.error.ex) {
            this.error = error.error.ex.toString();
          } else {
            this.error = error;
          }
        }
      );
  }
}
