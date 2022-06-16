import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-survay',
  templateUrl: './delete-survay.component.html',
  styleUrls: ['./delete-survay.component.scss']
})
export class DeleteSurvayComponent implements OnInit {
  surveyId:string;
  msgError: string;
  recivedError: string;

  constructor(
    private translate: TranslateService,
     public dialogRef: MatDialogRef<DeleteSurvayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onNoClick(event: any,id?: String): void {
    this.dialogRef.close(id);
  }

  delete(){
      // TODO
      // this.survayService.deleteCampaignUsingDELETE(this.surveyId).subscribe(()=>{
      //   this.onNoClick('',this.surveyId);
      //   this._snackBar.open(
      //     this.translate.instant("deletedSurvey"),
      //     this.translate.instant("close"));
      // }, 
      // (error) =>{
      //   this.msgError = 'cannotDeleteSurvey';
      //   if(!!error && !!error.error && !!error.error.ex){
      //     this.recivedError = error.error.ex;
      //   }else{
      //     this.recivedError = error;
      //   }
      // }
      // );
  }

}
