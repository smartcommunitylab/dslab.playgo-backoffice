import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CHANNELS_COMMUNICATION } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-communication-add',
  templateUrl: './communication-add.component.html',
  styleUrls: ['./communication-add.component.scss']
})
export class CommunicationAddComponent implements OnInit {
  
  territoryId:string;
  validatingForm: FormGroup;
  errorMsgValidation:string;
  territories: string[] = ["aa","bb"];
  channels: string[] = CHANNELS_COMMUNICATION;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CommunicationAddComponent>,) { }

  ngOnInit(): void {
    this.territories.push(this.territoryId);
    this.validatingForm = this.formBuilder.group({
      territoryId: new FormControl("", [Validators.required]),
      campaignId: new FormControl(""),
      channels: new FormControl("", [Validators.required]),
      briefDescription: new FormControl("", [Validators.required]),
      richDescription:new FormControl(""),
      activityDate:new FormControl(""),
      users:new FormControl(""),
      title:new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      territoryId: this.territoryId,
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  validate(){
    if(this.validatingForm.valid){
      
    }
  }

  get descriptionRichControl() {
    return this.validatingForm.controls.richDescription as FormControl;
  }

  emailEnabled():boolean{
    if(!!!this.validatingForm.get('channels').value){
      return false;
    }
    const list : string[] = this.validatingForm.get('channels').value;
    const res = list.find((element)=>element === CHANNELS_COMMUNICATION[0]);
    if(!!res){
      return true;
    }
    return false;

  }

}
