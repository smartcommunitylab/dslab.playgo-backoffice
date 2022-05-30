import { Campaign } from "src/app/core/api/generated/model/campaign";
import { CampaignDetail } from "src/app/core/api/generated/model/campaignDetail";
import { Image } from "src/app/core/api/generated/model/image";

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
    banner?: Image;
    campaignId?: string;
    communications?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    description?: string;
    details?: Array<CampaignDetail>;
    gameId?: string;
    logo?: Image;
    name?: string;
    startDayOfWeek?: number;
    territoryId?: string;
    type?: Campaign.TypeEnum;
    validationData?: ValidationData;
}

export class ImageClass implements Image {
    contentType?: string;
    image?: string;
    url?: string;
}