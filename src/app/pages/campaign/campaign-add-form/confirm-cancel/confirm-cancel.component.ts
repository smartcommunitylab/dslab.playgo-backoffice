import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-cancel',
  templateUrl: './confirm-cancel.component.html',
  styleUrls: ['./confirm-cancel.component.scss']
})
export class ConfirmCancelComponent implements OnInit {

  campaignId: string;
  msgError: string;
  recivedError: string;
  constructor(
    private translate: TranslateService,
     public dialogRef: MatDialogRef<ConfirmCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close(true);
  }

  noClose(): void {
    this.dialogRef.close(false);
  }

}
