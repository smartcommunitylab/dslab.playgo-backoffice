import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TerritoryService } from 'src/app/shared/services/territory.service';

@Component({
  selector: 'app-territory-delete',
  templateUrl: './territory-delete.component.html',
  styleUrls: ['./territory-delete.component.scss']
})
export class TerritoryDeleteComponent implements OnInit {

  territoryId: string;
  constructor(private territoryService: TerritoryService, public dialogRef: MatDialogRef<TerritoryDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(event: any,id?: String): void {
    this.dialogRef.close(id);
  }

  delete(){
    try{
      this.territoryService.delete(this.territoryId).subscribe(()=>{
        this.onNoClick('',this.territoryId);
        this._snackBar.open("Territorio eliminato", "close");
      }, 
      (error) =>{
        this._snackBar.open("Territorio cannot be delited because:"+ error.error.ex, "close");
      }
      );
    }catch(e){
      this._snackBar.open("Error durante cancellazione", "close");
    }
  }

}
