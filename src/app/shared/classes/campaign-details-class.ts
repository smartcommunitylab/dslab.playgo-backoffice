import { FormGroup } from "@angular/forms";
import { CampaignDetail } from "src/app/core/api/generated/model/campaignDetail";

export class CampaignDetailClass implements CampaignDetail {
  content?: string;
  extUrl?: string;
  name?: string;
  type?: CampaignDetail.TypeEnum;
}

export class DetailsForAddModifyModule{
    collapsed:boolean;
    created:boolean;
    detail: CampaignDetailClass;
    form : FormGroup;
}