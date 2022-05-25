import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MapPoint } from "src/app/shared/classes/map-point";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CampaignClass,
  ImageClass,
  ValidationData,
} from "src/app/shared/classes/campaing-class";
import {
  BASE64_SRC_IMG,
  MY_DATE_FORMATS,
  PREFIX_SRC_IMG,
  TERRITORY_ID_LOCAL_STORAGE_KEY,
  TYPE_CAMPAIGN,
} from "src/app/shared/constants/constants";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import * as _moment from "moment";
import { Moment } from "moment";
import { Logo } from "src/app/shared/classes/logo-class";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { CampaignDetailClass, DetailsForAddModifyModule } from "src/app/shared/classes/campaign-details-class";
import { CampaignDetail } from "src/app/core/api/generated/model/campaignDetail";
import { Image } from "src/app/core/api/generated/model/image";

const moment = _moment;

@Component({
  selector: "app-campaign-add-form",
  templateUrl: "./campaign-add-form.component.html",
  styleUrls: ["./campaign-add-form.component.scss"],
  animations: [
    trigger("bodyExpansion", [
      state("collapsed, void", style({ height: "0px", visibility: "hidden" })),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed, void => collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CampaignAddFormComponent implements OnInit {
  @Input() type: string; // can be add or modify
  quillContent = "";

  validatingForm: FormGroup;
  campaignCreated: CampaignClass;
  campaignUpdated: CampaignClass;
  territoryList: TerritoryClass[];
  territorySelected: TerritoryClass;
  selectedLogo: Image;
  selectedBanner: Image;
  typeCampaign = TYPE_CAMPAIGN;
  means: string[];
  errorMsgValidation: string;
  stateDescription: string = "collapsed";
  details: DetailsForAddModifyModule[] = [];
  detailsType: any[];
  // stateRules: string = "collapsed";
  // statePrivacy: string = "collapsed";
  PREFIX_SRC_IMG_C = PREFIX_SRC_IMG;
  BASE64_SRC_IMG_C =BASE64_SRC_IMG;
  uploadImageForModifyLogo: boolean = false;
  blobImageUploadLogo: Blob;
  uploadImageForModifyBanner: boolean = false;
  blobImageUploadBanner: Blob;
  activeValue = false;

  @Input() set formTerritory(value: CampaignClass) {
    this.campaignUpdated = new CampaignClass();
    this.campaignUpdated.territoryId = value.territoryId;
    this.campaignUpdated.communications = value.communications;
    this.campaignUpdated.name = value.name;
    this.campaignUpdated.campaignId = value.campaignId;
    this.campaignUpdated.logo = new ImageClass();
    this.campaignUpdated.logo.contentType = value.logo.contentType;
    this.campaignUpdated.logo.image = value.logo.image;
    this.selectedLogo = new ImageClass();
    this.selectedLogo.contentType = value.logo.contentType;
    this.selectedLogo.image = value.logo.image;
    this.selectedLogo.url = value.logo.url;
    this.selectedLogo.contentType = value.logo.contentType;
    this.selectedBanner = new ImageClass();
    this.selectedBanner.contentType = value.banner.contentType;
    this.selectedBanner.image = value.banner.image;
    this.selectedBanner.url = value.banner.url;
    this.details = this.setDetails(value.details);
    this.campaignUpdated.description = value.description;
    this.campaignUpdated.details = value.details;
    this.campaignUpdated.validationData = new ValidationData();
    this.campaignUpdated.validationData.means = value.validationData.means;
    this.campaignUpdated.active = value.active;
    this.campaignUpdated.dateFrom = value.dateFrom;
    this.campaignUpdated.dateTo = value.dateTo;
    this.campaignUpdated.type = value.type;
    this.campaignUpdated.gameId = value.gameId;
    this.campaignUpdated.startDayOfWeek = value.startDayOfWeek;
    this.initializaValidatingForm();
  }

  constructor(
    private territoryService: TerritoryControllerService,
    private campaignService: CampaignControllerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CampaignAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  onNoClick(event: any, campaign?: CampaignClass): void {
    this.dialogRef.close(campaign);
  }

  ngOnInit(): void {
    this.campaignCreated = new CampaignClass();
    this.campaignCreated.validationData = new ValidationData();
    this.initializaValidatingForm();
    this.territoryService
      .getTerritoriesUsingGET()
      .subscribe((result) => (this.territoryList = result));
    this.territoryService
      .getTerritoryUsingGET(localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY))
      .subscribe((result) => {this.territorySelected = result;
      this.means = this.territorySelected.territoryData.means});
    this.initDetailsType();
  }

  initializaValidatingForm() {
    if (this.type === "add") {
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl("", [Validators.required]),
        campaignId: new FormControl("", [Validators.required]),
        name: new FormControl("", [Validators.required]),
        logo: new FormControl("", [Validators.required]),
        banner: new FormControl("", [Validators.required]),
        description: new FormControl(""),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl("", [Validators.pattern("^[1-7]")]),
      });
      this.validatingForm.patchValue({
        territoryId: localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY),
        active: false
      });
    } else {
      this.validatingForm = this.formBuilder.group({
        logo: new FormControl(""),
        banner: new FormControl(""),
        description: new FormControl(""),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl(""),
      });
      this.validatingForm.patchValue({
        logo: this.campaignUpdated.logo,
        banner: this.campaignUpdated.banner,
        description: this.campaignUpdated.description,
        means: this.campaignUpdated.validationData.means,
        active: this.campaignUpdated.active,
        dateFrom: moment(this.campaignUpdated.dateFrom, "YYYY-MM-DD"),
        dateTo: moment(this.campaignUpdated.dateTo, "YYYY-MM-DD"),
        type: this.campaignUpdated.type,
        gameId: this.campaignUpdated.gameId,
        startDayOfWeek: this.campaignUpdated.startDayOfWeek,
      });
    }
  }

  public myError = (controlName: string, errorName: string) => {
    return this.validatingForm.controls[controlName].hasError(errorName);
  };

  setSelectedPoint(event: MapPoint): void {
    this.validatingForm.get("lat").setValue(event.latitude);
    this.validatingForm.get("long").setValue(event.longitude);
    //this.unlockRaySelector = true;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "km";
    }

    return value;
  }

  validate(): void {
    this.errorMsgValidation = "";
    var validDetails = true;
    this.details.forEach((item)=>{
      if(!item.form.valid){
        item.collapsed = false;
        item.form.markAllAsTouched();
        validDetails = false;
        return;
      }
    });
    if(!validDetails){
      return;
    }
    if (this.validatingForm.valid) {
      this.campaignCreated.active = this.validatingForm.get("active").value;
      const dataFrom: Moment =this.validatingForm.get("dateFrom").value;
      this.campaignCreated.dateFrom = this.formatDate(dataFrom); // dataFrom.toDate();//
      const dataTo: Moment = this.validatingForm.get("dateTo").value;
      this.campaignCreated.dateTo = this.formatDate(dataTo); //dataTo.toDate();//
      this.campaignCreated.logo = new ImageClass();
      this.campaignCreated.logo.contentType = this.selectedLogo.contentType;
      this.campaignCreated.logo.image = this.selectedLogo.image;
      this.campaignCreated.logo.url = this.selectedLogo.url;
      this.campaignCreated.banner = new ImageClass();
      this.campaignCreated.banner.contentType = this.selectedBanner.contentType;
      this.campaignCreated.banner.image = this.selectedBanner.image;
      this.campaignCreated.banner.url = this.selectedBanner.url;
      this.campaignCreated.details =[];
       this.details.forEach((item)=>{
         var detail = new CampaignDetailClass();
         detail.content = item.form.get("content").value;
         detail.extUrl = item.form.get("url").value;
         detail.name = item.form.get("name").value;
         detail.type =  item.form.get("type").value;
         this.campaignCreated.details.push(detail);
       });
      this.campaignCreated.type = this.validatingForm.get("type").value;
      this.campaignCreated.validationData.means = this.validatingForm.get("means").value;
      this.campaignCreated.description = this.validatingForm.get("description").value;
      if (this.validatingForm.get("type").value !== "company") {
        if(!!this.validatingForm.get("gameId").value){
          this.campaignCreated.gameId = this.validatingForm.get("gameId").value;
        }else{
          const currentDate = new Date();
          const timestamp = currentDate.getTime().toString();
          this.campaignCreated.gameId = timestamp; //timestamp as ID
        }
        if(!!this.validatingForm.get("startDayOfWeek").value){
          this.campaignCreated.startDayOfWeek = this.validatingForm.get("startDayOfWeek").value;
        }else{
          this.campaignCreated.startDayOfWeek = 1; //default value
        }
        
      }
      if (
        !this.validDates(this.campaignCreated.dateFrom,this.campaignCreated.dateTo)) {
        this.errorMsgValidation = "dateNotValid";
        return;
      }
      if (this.type === "add") {
        this.campaignCreated.campaignId = this.validatingForm.get("campaignId").value;
        this.campaignCreated.territoryId = this.validatingForm.get("territoryId").value;
        this.campaignCreated.name = this.validatingForm.get("name").value;
        try {
          this.campaignService.addCampaignUsingPOST(this.campaignCreated).subscribe(
            () => {
              this.onNoClick("", this.campaignCreated);
              this._snackBar.open("Dati salvati", "close");
            },
            (error) => {
              this.errorMsgValidation = "Dati non salvati per errore in post: " + error.error.ex;
              //this._snackBar.open('Dati non salvati per errore: ' +error.error.ex, "close");
            }
          );
        } catch (e) {
          this.errorMsgValidation = "Dati non salvati per errore: " + e;
          //this._snackBar.open('error:' +e.errors, "close");
        }
      }
      if (this.type === "modify") {
        this.campaignCreated.name = this.campaignUpdated.name;
        this.campaignCreated.territoryId = this.campaignUpdated.territoryId;
        this.campaignCreated.campaignId = this.campaignUpdated.campaignId;
        try {
          this.campaignService.updateCampaignUsingPUT(this.campaignCreated).subscribe(
            () => {
              if(this.uploadImageForModifyLogo){
                const formData = new FormData();
                formData.append('data', this.blobImageUploadLogo);//this.blobImageUploadLogo
                this.campaignService.uploadCampaignLogoUsingPOST(this.campaignCreated.campaignId,formData).subscribe(
                  () => {
                    this.onNoClick("", this.campaignCreated);
                    this._snackBar.open("Dati modificati", "close");
                  },
                  (error) => {
                    // console.log(error);
                    if(error.error && error.error.ex)
                     this.errorMsgValidation = "Tutti i dati sono stati modificati tranne il logo. Per errore: " + error.error.ex +"\n";
                     else if(error.error)
                     this.errorMsgValidation = "Tutti i dati sono stati modificati tranne il logo. Per errore: " + error.error +"\n";
                     else
                     this.errorMsgValidation = "Tutti i dati sono stati modificati tranne il logo. Per errore: " + error +"\n";
                  }
                )
              if(this.uploadImageForModifyBanner){
                const formData = new FormData();
                formData.append('data', this.blobImageUploadBanner); //this.blobImageUploadBanner
                this.campaignService.uploadCampaignBannerUsingPOST(this.campaignCreated.campaignId,{'body':this.campaignCreated.banner}).subscribe(
                  () => {
                    this.onNoClick("", this.campaignCreated);
                    this._snackBar.open("Dati modificati", "close");
                  },
                  (error) => {
                    // console.log(error);
                    if(error.error && error.error.ex)
                     this.errorMsgValidation = "Tutti i dati sono stati modificati tranne il banner. Per errore: " + error.error.ex +"\n";
                     else if(error.error)
                     this.errorMsgValidation = "Tutti i dati sono stati modificati tranne il banner. Per errore: " + error.error +"\n";
                     else
                     this.errorMsgValidation = "Tutti i dati sono stati modificati tranne il banner. Per errore: " + error +"\n";
                  });
              }else{
                this.onNoClick("", this.campaignCreated);
                this._snackBar.open("Dati modificati", "close");
              }
              }else{
                this.onNoClick("", this.campaignCreated);
                this._snackBar.open("Dati modificati", "close");
              }
            },
            (error) => {
              this.errorMsgValidation = "Modifica dati non avvenuta per errore: " + error.error.ex;
            }
          );

        } catch (e) {
          this.errorMsgValidation = "error:" + e.errors;
        }
      }
    } else {
    }
  }

  upload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      const eev = event;
      this.blobImageUploadLogo = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => { 
        this.selectedLogo = new ImageClass();
        this.selectedLogo.contentType = eev.target.files[0].type;
        const prefix = this.PREFIX_SRC_IMG_C + this.selectedLogo.contentType + this.BASE64_SRC_IMG_C;
        const base64string = event.target.result.slice(prefix.length);
        if(typeof base64string === 'string'){
          this.selectedLogo.image = base64string;
        }
        this.uploadImageForModifyLogo = true;
      };
    }
  }

  uploadBanner(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      const eev = event;
      this.blobImageUploadBanner = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => { 
        this.selectedBanner = new ImageClass();
        this.selectedBanner.contentType = eev.target.files[0].type;
        const prefix = this.PREFIX_SRC_IMG_C + this.selectedBanner.contentType + this.BASE64_SRC_IMG_C;
        const base64string = event.target.result.slice(prefix.length);
        if(typeof base64string === 'string'){
          this.selectedBanner.image = base64string;
        }
        this.uploadImageForModifyBanner = true;
      };
    }
  }

  formatDate(datee: Moment): string {
    var day = (+datee.toObject().date.toString()).toString();
    if(day.length===1){
      day = "0"+day;
    }
    var month = (+datee.toObject().months.toString() + 1).toString();
    if(month.length===1){
      month = "0"+month;
    }
    const year = datee.toObject().years.toString();
    return year + "-" + month + "-" + day;
  }

  get descriptionRichControl() {
    return this.validatingForm.controls.description as FormControl;
  }

  get privacyRichControl() {
    return this.validatingForm.controls.privacy as FormControl;
  }

  get rulesRichControl() {
    return this.validatingForm.controls.rules as FormControl;
  }

  toggleDescription() {
    this.stateDescription =
      this.stateDescription === "collapsed" ? "expanded" : "collapsed";
  }

  // togglePrivacy() {
  //   this.
  //   this.statePrivacy =
  //     this.statePrivacy === "collapsed" ? "expanded" : "collapsed";
  // }

  // toggleRules() {
  //   this.stateRules =
  //     this.stateRules === "collapsed" ? "expanded" : "collapsed";
  // }

  validDates(startt: string, endd: string): boolean {
    this.errorMsgValidation = "";
    const dateStart = startt + "";
    const dateEnd = endd + "";
    const start = dateStart.split("-");
    const startDay = +start[2];
    const startMonth = +start[1];
    const startYear = +start[0];
    const end = dateEnd.split("-");
    const endDay = +end[2];
    const endMonth = +end[1];
    const endYear = +end[0];
    if (startYear > endYear) {
      return false;
    } else if (startYear < endYear) {
      return true;
    } else {
      //startYear===endYear
      if (startMonth > endMonth) {
        return false;
      } else if (startMonth < endMonth) {
        return true;
      } else {
        // startMonth===endMonth
        if (startDay >= endDay) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  setDetails(details: CampaignDetail[]) :DetailsForAddModifyModule[]{
    var result = [];
    for(let el of details){
      let item = new DetailsForAddModifyModule();
      item.collapsed = true;
      item.created = true;
      item.detail = el;
      item.form = this.formBuilder.group({
        name: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        url: new FormControl(""),
        content:new FormControl(""),
      });
      item.form.patchValue({
        name: el.name,
        type: el.type,
        url: el.extUrl,
        content: el.content
      });
      result.push(item);
    }
    console.log('result:',result);
    return result;
  }

  addDetail(){
    var item = new DetailsForAddModifyModule();
    item.collapsed = true;
    item.created = true;
    item.detail = new CampaignDetailClass;
    item.form = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      url: new FormControl(""),
      content:new FormControl(""),
    });
    this.details.push(item);
  }

  deleteDetail(removeEl : DetailsForAddModifyModule){
    this.details= this.details.filter((item)=>item != removeEl);
  }

  toggleDetail(detail : DetailsForAddModifyModule){
    this.details.forEach((item,index)=>{
      if(item ===detail){
        this.details[index].collapsed = !this.details[index].collapsed;
      }
    });
  }

  initDetailsType(){
    this.detailsType = [];
    for (var enumMember in CampaignDetail.TypeEnum) {
      this.detailsType.push({'value':CampaignDetail.TypeEnum[enumMember],'used':false});
   }
  }


}
