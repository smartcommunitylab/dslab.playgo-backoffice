import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";

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
    public dialogRef: MatDialogRef<TerritoryDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onNoClick(event: any, id?: String): void {
    this.dialogRef.close(id);
  }

  delete() {
    try {
      this.territoryService.deleteTerritoryUsingDELETE(this.territoryId).subscribe(
        () => {
          this.onNoClick("", this.territoryId);
          this._snackBar.open("Territorio eliminato", "close");
        },
        (error) => {
          console.log(error);
          this.msgError = "cannotDeleteTerritory";
          if(!!error.error && !!error.error.ex) {
            this.error = error.error.ex.toString();
          }else{
            this.error = error;
          }
          // this._snackBar.open("Territorio cannot be delited because:"+ error.error.ex, "close");
        }
      );
    } catch (e) {
      this.error = e.toString();
      this.msgError = "cannotDeleteTerritory";
      // this._snackBar.open("Error durante cancellazione", "close");
    }
  }
}
