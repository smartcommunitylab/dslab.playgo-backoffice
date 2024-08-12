import { Campaign } from "src/app/core/api/generated/model/campaign";
import { CampaignDetail } from "src/app/core/api/generated/model/campaignDetail";
import { CampaignWeekConf } from "src/app/core/api/generated/model/campaignWeekConf";
import { Image } from "src/app/core/api/generated/model/image";
import { SurveyRequest } from "src/app/core/api/generated/model/surveyRequest";
import { CampaignPlacement } from "src/app/core/api/generated/model/campaignPlacement";

export interface CampaignTypeInterface{
    weekStart?: string;
    gameID?: string;
}

export class CampaignHSCClass implements CampaignTypeInterface{
    weekStart?: string;
    gameID?: string;
}
export class CampaignCityClass implements CampaignTypeInterface{
    weekStart?: string;
    gameID?: string;
}
export class CampaignPGAClass implements CampaignTypeInterface{
    weekStart?: string;
    gameID?: string;
}

export class ValidationData {
    means?: string[];
}


export class CampaignClass implements Campaign {
    active?: boolean;
    allSurveys?: { [key: string]: string };
    banner?: Image;
    campaignId?: string;
    communications?: boolean;
    dateFrom?: number;
    dateTo?: number;
    defaultSurvey?: SurveyRequest;
    description?: { [key: string]: string };
    details?: { [key: string]: Array<CampaignDetail> };
    gameId?: string;
    logo?: Image;
    name?: { [key: string]: string };
    specificData?: any;
    startDayOfWeek?: number;
    surveys?: Array<SurveyRequest>;
    territoryId?: string;
    type?: Campaign.TypeEnum;
    validationData?: any;
    weekConfs?: Array<CampaignWeekConf>;
    visible?: boolean;
    campaignPlacement?: CampaignPlacement;
}

export class ImageClass implements Image {
    contentType?: string;
    image?: string;
    url?: string;
}