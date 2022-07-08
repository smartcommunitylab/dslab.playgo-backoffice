import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { CampaignClass } from "src/app/shared/classes/campaing-class";
@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {
  
  selectedLang: string;
  campaign: CampaignClass;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["index","dateFrom", "dateTo","prizes"];
  newItem: any;
  msgError: string;
  validatingForm: FormGroup;
  weekCsv: any;
  rewardCsv:any;

  constructor(
    public dialogRef: MatDialogRef<RewardsComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
  ) {}

  ngOnInit(): void {
    console.log(this.campaign);
    this.validatingForm = this.formBuilder.group({
      weeks: new FormControl("", [Validators.required]),
      prizes: new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      defaultSurvey: "-",
    });
    this.campaignService.getCampaignUsingGET(this.campaign.campaignId).subscribe((result)=>{
      //this.prizes = result.prizes;
      this.setTableData();
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  addPrizes() {
    this.msgError = undefined;
    if (this.validatingForm.valid) {
      const bodyWeek = new FormData();
      bodyWeek.append("data", this.weekCsv);
      const bodyRew = new FormData();
      bodyRew.append("data", this.rewardCsv);
      this.campaignService.uploadWeekConfsUsingPOST({campaignId: this.campaign.campaignId, body: bodyWeek}).subscribe((resWeek)=>{
        this.campaignService.uploadRewardsUsingPOST({campaignId: this.campaign.campaignId, body: bodyRew}).subscribe((resReward)=>{
          this.campaignService.getCampaignUsingGET(this.campaign.campaignId).subscribe((resCamp)=>{
            console.log("done", resCamp);
            this.campaign = resCamp;
          });
        },
        (error)=>{
          this.msgError = this.translate.instant("errorWhileLoadingWeeks")+ ': ' + error.error.ex?  error.error.ex : 'Undefined error';
        });
      },
      (error)=>{
        this.msgError = this.translate.instant("errorWhileLoadingWeeks") + ': ' + error.error.ex?  error.error.ex : 'Undefined error';
      });
    } else {
      this.msgError = this.translate.instant("fillAllfields");
      this.validatingForm.markAllAsTouched();
    }
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.campaign.weekConfs);
  }

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  uploadWeeks(event: any){
    this.weekCsv = event.target.files[0];
  }

  uploadRewards(event: any){
    this.rewardCsv = event.target.files[0];
  }


  fromTimestampToDate(timestamp: any) : string{
    if(timestamp===0){
      return "-";
    }
    const a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    //var month = months[a.getMonth()+1];
    var month = a.getMonth()+1
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year;
    return time;
  }

  download(type: string){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    const fileName = '/src/assets/files/'+type+'.csv';
    console.log(fileName);
    link.setAttribute('href', fileName);
    if(this.selectedLang==='it'){
      //names ita
      if(type==='rewDownload'){
        link.setAttribute('download', 'esempio_premi.csv');
      }else{
        link.setAttribute('download', 'esempio_settimane.csv');
      }
    }else{
      //names eng
      if(type==='rewDownload'){
        link.setAttribute('download', 'prizes_example.csv');
      }else{
        link.setAttribute('download', 'weeks_example.csv');
      }
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
