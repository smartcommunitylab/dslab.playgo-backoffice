import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
  CONST_LANGUAGES_SUPPORTED,
  DAILY_LIMIT,
  DEFAULT_SURVEY_KEY,
  LANGUAGE_DEFAULT,
  MONTHLY_LIMIT,
  MY_DATE_FORMATS,
  PREFIX_SRC_IMG,
  TERRITORY_ID_LOCAL_STORAGE_KEY,
  TYPE_CAMPAIGN,
  WEEKLY_LIMIT,
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
import {
  CampaignDetailClass,
  DetailsForAddModifyModule,
} from "src/app/shared/classes/campaign-details-class";
import { CampaignDetail } from "src/app/core/api/generated/model/campaignDetail";
import { Image } from "src/app/core/api/generated/model/image";
import { DEFAULT_LANGUAGE, TranslateService } from "@ngx-translate/core";
import { ConfirmCancelComponent } from "./confirm-cancel/confirm-cancel.component";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

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
  meansSelected: string[]=[];
  selectedLimits: SelectedLimits;
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
  BASE64_SRC_IMG_C = BASE64_SRC_IMG;
  uploadImageForModifyLogo: boolean = false;
  blobImageUploadLogo: Blob;
  uploadImageForModifyBanner: boolean = false;
  blobImageUploadBanner: Blob;
  activeValue = false;
  languageDefault: any;
  languagesSupported = CONST_LANGUAGES_SUPPORTED;
  languageSelected: string;

  @Input() set formTerritory(value: CampaignClass) {
    this.campaignUpdated = value;
    this.selectedLogo = value.logo;
    this.selectedBanner = value.banner;
    // this.selectedLogo = new ImageClass();
    // this.selectedLogo.contentType = value.logo.contentType;
    // this.selectedLogo.image = value.logo.image;
    // this.selectedLogo.url = value.logo.url;
    // this.selectedLogo.contentType = value.logo.contentType;
    // this.selectedBanner = new ImageClass();
    // this.selectedBanner.contentType = value.banner.contentType;
    // this.selectedBanner.image = value.banner.image;
    // this.selectedBanner.url = value.banner.url;
    this.details = this.setDetails(value.details);
    this.initializaValidatingForm();
  }

  constructor(
    private territoryService: TerritoryControllerService,
    private confirmCancel: MatDialog,
    private translate: TranslateService,
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
    this.languageDefault = this.translate.currentLang;
    this.campaignCreated = new CampaignClass();
    this.campaignCreated.validationData = new ValidationData();
    this.initializaValidatingForm();
    this.territoryService
      .getTerritoriesUsingGET()
      .subscribe((result) => (this.territoryList = result));
    this.territoryService
      .getTerritoryUsingGET(
        localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY)
      )
      .subscribe((result) => {
        this.territorySelected = result;
        this.means = this.territorySelected.territoryData.means;
        if(this.type ==='add'){
          this.selectedLimits = new SelectedLimits();
          for(let mean of this.means){
            this.selectedLimits[mean] = new LimitsClass();
          }
        }else{
          this.means = this.campaignUpdated.validationData.means;
        }
      });
      this.initDetailsType();
  }

  initializaValidatingForm() {
    if (this.type === "add") {
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl("", [Validators.required]),
        languages: new FormControl(""),
        //name: new FormControl("", [Validators.required]),
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
        active: false,
      });
    } else {
      this.validatingForm = this.formBuilder.group({
        languages: new FormControl(""),
        description: new FormControl(""),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl("")
      });
      this.validatingForm.patchValue({
        means: this.campaignUpdated.validationData.means,
        active: this.campaignUpdated.active,
        dateFrom: moment(this.campaignUpdated.dateFrom), //moment(this.campaignUpdated.dateFrom, "YYYY-MM-DD"),
        dateTo: moment(this.campaignUpdated.dateTo), //moment(this.campaignUpdated.dateTo, "YYYY-MM-DD"),
        type: this.campaignUpdated.type,
        gameId: this.campaignUpdated.gameId,
        startDayOfWeek: this.campaignUpdated.startDayOfWeek
      });
      this.meansSelected = this.campaignUpdated.validationData.means;
      this.selectedLimits = this.campaignUpdated.specificData;
    }
    // language common for add and update
    this.addFormControlMultilanguage();
    this.languageSelected = LANGUAGE_DEFAULT;
    this.validatingForm.patchValue({ languages: LANGUAGE_DEFAULT });
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

  chengeSelectedMeans(event:any){
    if(this.type!=='add'){
      if(this.meansSelected.length>this.validatingForm.get('means').value.length){
        // a mean was deleted
        const found = this.findDiffInArray(this.validatingForm.get('means').value,this.meansSelected);
        this.selectedLimits[found] = new LimitsClass();
      }
    }
    this.meansSelected = this.validatingForm.get('means')?  this.validatingForm.get('means').value : [];
  }

  findDiffInArray(shortArr: any[],longArr: any[]): any{
    var result;
    var found = true;
    for(let i=0;i<longArr.length;i++){
      var checkThisValue =false;
      for(let j=0;j<shortArr.length;j++){
        if(shortArr[j]===longArr[i]){
          checkThisValue= true;
        }
      }
      if(!checkThisValue){
        //if not found in short array it's the result
        result = longArr[i];
        break;
      }
    }
    return result;
  }

  validate(): void {
    this.errorMsgValidation = "";
    if (this.validatingForm.valid) {
      const resValDetails = this.checkValidityDetails();
      if (!resValDetails["bool"]) {
        this.errorMsgValidation =
          this.translate.instant("detailsForLanguageDefaultNotValid") +
          LANGUAGE_DEFAULT +
          ", " +
          resValDetails["name"];
        return;
      } else {
        this.addMultilanguageFields();
      }
      this.fillCampaingCreated();
      if (
        !this.validDates(
          this.campaignCreated.dateFrom,
          this.campaignCreated.dateTo
        )
      ) {
        this.errorMsgValidation = "dateNotValid";
        return;
      }
      if (this.type === "add") {
        this.campaignCreated.territoryId =
          this.validatingForm.get("territoryId").value;
        this.campaignService
          .addCampaignUsingPOST(this.campaignCreated)
          .subscribe(
            (campaignSubmitted) => {
              this.campaignCreated.campaignId = campaignSubmitted.campaignId;
              if (
                this.uploadImageForModifyBanner &&
                this.uploadImageForModifyLogo
              ) {
                //upload logo and banner
                this.uploadBannerAndLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyLogo) {
                //upload just logo
                this.uploadLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyBanner) {
                //upload just banner
                this.uploadBannerPost(this.campaignCreated.campaignId);
              } else {
                // no upload for logo and banner
                this.onNoClick("", this.campaignCreated);
                this._snackBar.openFromComponent(SnackbarSavedComponent,
                 {
                  data:{displayText: 'savedData'},
                  duration: 4999
                });
              }
            },
            (error) => {
              this.errorMsgValidation =
                this.translate.instant("dataNotSavedForError") + error.error.ex;
            }
          );
      }else if (this.type === "modify") {
        this.campaignCreated.name = this.campaignUpdated.name;
        this.campaignCreated.territoryId = this.campaignUpdated.territoryId;
        this.campaignCreated.campaignId = this.campaignUpdated.campaignId;
        this.campaignService
          .updateCampaignUsingPUT(this.campaignCreated)
          .subscribe(
            () => {
              if (
                this.uploadImageForModifyBanner &&
                this.uploadImageForModifyLogo
              ) {
                //upload logo and banner
                this.uploadBannerAndLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyLogo) {
                //upload just logo
                this.uploadLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyBanner) {
                //upload just banner
                this.uploadBannerPost(this.campaignCreated.campaignId);
              } else {
                // no upload for logo and banner
                this.onNoClick("", this.campaignCreated);
                this._snackBar.openFromComponent(SnackbarSavedComponent,
                  {
                   data:{displayText: 'savedData'},
                   duration: 4999
                 });
              }
            },
            (error) => {
              this.errorMsgValidation =
                this.translate.instant("dataNotSavedForError") + ': '+(error.error.ex ? error.error.ex : this.translate.instant('errorNotProvidedByresponse'));
            }
          );
      }
    } else {
      const nameName = "name" + LANGUAGE_DEFAULT;
      if (
        !!!this.validatingForm.get(nameName) &&
        !!!this.validatingForm.get(nameName).value
      ) {
        this.errorMsgValidation =
          this.translate.instant("nameCampaingForLanguageDefaultNotValid") +
          LANGUAGE_DEFAULT;
      } else {
        this.errorMsgValidation = this.translate.instant("fillAllfields");
      }
    }
  }

  uploadBannerPost(campaignId: string) {
    const formData = new FormData();
    formData.append("data", this.blobImageUploadBanner);
    this.campaignService
      .uploadCampaignBannerUsingPOST({
        campaignId: campaignId,
        body: formData,
      })
      .subscribe(
        () => {
          this.onNoClick("", this.campaignCreated);
          this._snackBar.openFromComponent(SnackbarSavedComponent,
            {
             data:{displayText: 'savedData'},
             duration: 4999
           });
        },
        (error) => {
          this.errorMsgValidation =
            this.translate.instant("allDataModifiedExceptBanner") + (error.error.ex ? error.error.ex : this.translate.instant('errorNotProvidedByresponse'));
        }
      );
  }

  uploadLogoPost(campaignId: string) {
    const formData = new FormData();
    formData.append("data", this.blobImageUploadLogo); //this.blobImageUploadLogo
    this.campaignService
      .uploadCampaignLogoUsingPOST({
        campaignId: campaignId,
        body: formData,
      })
      .subscribe(
        () => {
          this.onNoClick("", this.campaignCreated);
          this._snackBar.openFromComponent(SnackbarSavedComponent,
            {
             data:{displayText: 'savedData'},
             duration: 4999
           });
        },
        (error) => {
          this.errorMsgValidation =
            this.translate.instant("allDataModifiedExceptLogo") +
            (error.error.ex ? error.error.ex : this.translate.instant('errorNotProvidedByresponse'));
        }
      );
  }

  uploadBannerAndLogoPost(campaignId: string) {
    const formData = new FormData();
    formData.append("data", this.blobImageUploadBanner);
    this.campaignService
      .uploadCampaignBannerUsingPOST({
        campaignId: campaignId,
        body: formData,
      })
      .subscribe(
        () => {
          this.uploadLogoPost(campaignId);
        },
        (error) => {
          this.errorMsgValidation =
            this.translate.instant("allDataModifiedExceptBannerAndLogo") +
            (error.error.ex ? error.error.ex : this.translate.instant('errorNotProvidedByresponse'));
        }
      );
  }

  fillCampaingCreated(){
    this.campaignCreated.active = this.validatingForm.get("active").value;
    //const dataFrom: Moment = this.validatingForm.get("dateFrom").value;
    this.campaignCreated.dateFrom = this.validatingForm.get("dateFrom").value; //dataFrom.toDate();// this.formatDate(dataFrom); //
    //const dataTo: Moment = this.validatingForm.get("dateTo").value;
    this.campaignCreated.dateTo = this.validatingForm.get("dateTo").value; //dataTo.toDate();//this.formatDate(dataTo); //
    this.campaignCreated.logo = new ImageClass();
    if (!!this.selectedLogo) {
      this.campaignCreated.logo.contentType = this.selectedLogo.contentType;
      this.campaignCreated.logo.image = this.selectedLogo.image;
      this.campaignCreated.logo.url = this.selectedLogo.url;
    }
    this.campaignCreated.banner = new ImageClass();
    if (!!this.selectedBanner) {
      this.campaignCreated.banner.contentType =
        this.selectedBanner.contentType;
      this.campaignCreated.banner.image = this.selectedBanner.image;
      this.campaignCreated.banner.url = this.selectedBanner.url;
    }
    this.campaignCreated.type = this.validatingForm.get("type").value;
    this.campaignCreated.validationData.means =
      this.validatingForm.get("means").value;
    if (this.validatingForm.get("type").value !== "company") {
      if (!!this.validatingForm.get("gameId").value) {
        this.campaignCreated.gameId = this.validatingForm.get("gameId").value;
      } else {
        const currentDate = new Date();
        const timestamp = currentDate.getTime().toString();
        this.campaignCreated.gameId = timestamp; //timestamp as ID
      }
      if (!!this.validatingForm.get("startDayOfWeek").value) {
        this.campaignCreated.startDayOfWeek =
          this.validatingForm.get("startDayOfWeek").value;
      } else {
        this.campaignCreated.startDayOfWeek = 1; //default value
      }
    }
    this.campaignCreated.specificData = {};
    if(this.type==='modify'){
      // make it better copy every map and then override
      this.campaignCreated.specificData[DEFAULT_SURVEY_KEY] = this.campaignUpdated.specificData[DEFAULT_SURVEY_KEY];
    }
    this.campaignCreated.specificData = new SelectedLimits();
    for(let mean of this.validatingForm.get('means').value){
      this.campaignCreated.specificData[mean] = new LimitsClass();
      this.campaignCreated.specificData[mean][DAILY_LIMIT] = this.selectedLimits[mean][DAILY_LIMIT] ;
      this.campaignCreated.specificData[mean][WEEKLY_LIMIT] = this.selectedLimits[mean][WEEKLY_LIMIT] ;
      this.campaignCreated.specificData[mean][MONTHLY_LIMIT] = this.selectedLimits[mean][MONTHLY_LIMIT] ;
    }
  }

  uploadLogo(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      const eev = event;
      this.blobImageUploadLogo = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.selectedLogo = new ImageClass();
        this.selectedLogo.contentType = eev.target.files[0].type;
        const prefix =
          this.PREFIX_SRC_IMG_C +
          this.selectedLogo.contentType +
          this.BASE64_SRC_IMG_C;
        const base64string = event.target.result.slice(prefix.length);
        if (typeof base64string === "string") {
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
        const prefix =
          this.PREFIX_SRC_IMG_C +
          this.selectedBanner.contentType +
          this.BASE64_SRC_IMG_C;
        const base64string = event.target.result.slice(prefix.length);
        if (typeof base64string === "string") {
          this.selectedBanner.image = base64string;
        }
        this.uploadImageForModifyBanner = true;
      };
    }
  }

  formatDate(datee: Moment): string {
    var day = (+datee.toObject().date.toString()).toString();
    if (day.length === 1) {
      day = "0" + day;
    }
    var month = (+datee.toObject().months.toString() + 1).toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    const year = datee.toObject().years.toString();
    return year + "-" + month + "-" + day;
  }

  get descriptionRichControl() {
    const name = "description" + this.languageSelected;
    // var obj = {};
    // obj[name] = this.campaignUpdated.description[this.languageSelected] ?  this.campaignUpdated.description[this.languageSelected] : '';
    // this.validatingForm.patchValue(obj);
    return this.validatingForm.controls[name] as FormControl;
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

  addMultilanguageFields() {
    this.campaignCreated.name = {};
    this.campaignCreated.description = {};
    this.campaignCreated.details = {};
    for (let l of CONST_LANGUAGES_SUPPORTED) {
      //name
      const nameName = "name" + l;
      this.campaignCreated.name[l] = this.validatingForm.get(nameName).value;
      //description
      const nameDescription = "description" + l;
      this.campaignCreated.description[l] = this.validatingForm.get(
        nameDescription
      ).value
        ? this.validatingForm.get(nameDescription).value
        : undefined;
      //details
      this.campaignCreated.details[l] = [];
      if (this.details) {
        this.details.forEach((item) => {
          var detail = new CampaignDetailClass();
          detail.content = item.form[l].get("content").value;
          detail.extUrl = item.form[l].get("url").value
            ? item.form[l].get("url").value
            : item.form[LANGUAGE_DEFAULT].get("url").value;
          detail.name = item.form[l].get("name").value;
          detail.type = item.form[l].get("type").value
            ? item.form[l].get("type").value
            : item.form[LANGUAGE_DEFAULT].get("type").value;
          this.campaignCreated.details[l].push(detail);
        });
      }
    }
  }

  checkValidityDetails(): {} {
    var result = { bool: true, name: "" };
    this.details.forEach((item) => {
      item.form[LANGUAGE_DEFAULT].markAllAsTouched();
      if (!item.form[LANGUAGE_DEFAULT].valid) {
        if (item.detail.name) {
          result = { bool: false, name: item.detail.name };
        } else {
          result = {
            bool: false,
            name: this.translate.instant("nameNotDefined"),
          };
        }
      }
    });
    return result;
  }

  validDatesOld(startt: string, endd: string): boolean {
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

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  cancelGoBack(event:any){
    if(this.hasBeenModified()){
      const dialogRef = this.confirmCancel.open(ConfirmCancelComponent, {
        width: "40%",
        //height: "150px",
      });
      let instance = dialogRef.componentInstance;
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if(result){
            this.onNoClick('',undefined);
          }
        }
      });
    }else{
      this.onNoClick('',undefined);
    }
  }

  hasBeenModified():boolean{
    return this.validatingForm.touched;
  }

  setDetails(details: {
    [key: string]: CampaignDetail[];
  }): DetailsForAddModifyModule[] {
    var result = [];
    if(!!details && details[LANGUAGE_DEFAULT]){
      var totalNumberOfDetail = details[LANGUAGE_DEFAULT].length; 
      var keys = Object.keys(details); // subset of CONST_LANGUAGES_SUPPORTED
      for(let i=0;i<totalNumberOfDetail;i++){
        //iterate over the campaignDetails supposed that the default language is the one that has all the campaigns
        let item = new DetailsForAddModifyModule();
        item.collapsed = true;
        item.created = false;
        item.detail = {};
        item.form = {};
        for(let l of CONST_LANGUAGES_SUPPORTED){
          item.form[l] = this.formBuilder.group({
            name: new FormControl("", [Validators.required]),
            type: new FormControl("", [Validators.required]),
            url: new FormControl(""),
            content: new FormControl(""),
          });
          if(details[l]){
            //json object with the language exists
            if(details[l][i]){
              //campaingDetail-iesimo exists
              item.form[l].patchValue({
                name: details[l][i].name? details[l][i].name : details[LANGUAGE_DEFAULT][i].name,
                type: details[l][i].type? details[l][i].type : details[LANGUAGE_DEFAULT][i].type,
                url: details[l][i].extUrl? details[l][i].extUrl : details[LANGUAGE_DEFAULT][i].extUrl,
                content: details[l][i].content ? details[l][i].content : '',
              });
            }else{
              //campaingDetail-iesimo doesn't exists (copy data from default)
              //should enter here if data on 'it':[1,2,3] while 'en':[1,2] so there are some campaigndetails missing on the others languages
              item.form[l].patchValue({
                name: details[LANGUAGE_DEFAULT][i].name,
                type: details[LANGUAGE_DEFAULT][i].type,
                url: details[LANGUAGE_DEFAULT][i].extUrl,
                content: '',
              });
            }
          }else{
            //json object with language doesn't exists
            // for example {'it':[details1,details2]} doesn't have 'en' add a full-empty form copying the default values
            item.form[l].patchValue({
              name: details[LANGUAGE_DEFAULT][i].name,
              type: details[LANGUAGE_DEFAULT][i].type,
              url: details[LANGUAGE_DEFAULT][i].extUrl,
              content: '',
            });
          }
        }
        result.push(item);
      }
    }
    return result;
  }

  addDetail() {
    var item = new DetailsForAddModifyModule();
    item.collapsed = false;
    item.created = true;
    item.detail = new CampaignDetailClass();
    item.form = {};
    for (let l of this.languagesSupported) {
      let controlName;
      let controlType;
      if (l === LANGUAGE_DEFAULT) {
        controlName = new FormControl("", [
          Validators.required,
          Validators.maxLength(40),
        ]);
        controlType = new FormControl("", [Validators.required]);
      } else {
        controlName = new FormControl("", [Validators.maxLength(40)]);
        controlType = new FormControl("");
      }
      item.form[l] = this.formBuilder.group({
        name: controlName,
        type: controlType,
        url: new FormControl(""),
        content: new FormControl(""),
      });
    }
    this.details.push(item);
  }

  deleteDetail(removeEl: DetailsForAddModifyModule) {
    this.details = this.details.filter((item) => item != removeEl);
  }

  toggleDetail(detail: DetailsForAddModifyModule) {
    this.details.forEach((item, index) => {
      if (item === detail) {
        this.details[index].collapsed = !this.details[index].collapsed;
      }
    });
  }

  initDetailsType() {
    this.detailsType = [];
    for (var enumMember in CampaignDetail.TypeEnum) {
      this.detailsType.push({
        value: CampaignDetail.TypeEnum[enumMember],
        used: false,
      });
    }
  }

  addFormControlMultilanguage() {
    for (let l of this.languagesSupported) {
      const nameName = "name" + l;
      const nameDescription = "description" + l;
      let controlName;
      let controlDescription = new FormControl("");
      if (l === LANGUAGE_DEFAULT) {
        controlName = new FormControl("", [
          Validators.required,
          Validators.maxLength(40),
        ]);
      } else {
        controlName = new FormControl("", [Validators.maxLength(40)]);
      }
      this.validatingForm.addControl(nameName, controlName);
      this.validatingForm.addControl(nameDescription, controlDescription);
      if(this.type !== "add"){
        var obj = {};
        obj[nameName] = this.campaignUpdated.name[l];
        obj[nameDescription] = this.campaignUpdated.description[l] ?  this.campaignUpdated.description[l] : '';
        this.validatingForm.patchValue(obj);
      }
    }

  }

  selectedLanguageClick(event: any) {
    this.languageSelected = event;
  }

  transformActiveBoolean(val:boolean): string{
    if(val){
      return 'active';
    }else{
      return 'inactive';
    }
  }

}

export class SelectedLimits{
  walk?: LimitsClass;
  bike?:LimitsClass;
  bus?:LimitsClass;
  car?:LimitsClass;
  train?:LimitsClass;
  boat?:LimitsClass;
}

export class LimitsClass{
  dailyLimit?: number;
  weeklyLimit?: number;
  monthlyLimit?: number;
}