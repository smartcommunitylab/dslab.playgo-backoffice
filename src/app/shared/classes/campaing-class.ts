import { TerritoryClass } from "./territory-class";


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


export class CampaignClass {

    active?: boolean;
    campaignId?: string;
    communications?: boolean;
    dateFrom?: string;
    dateTo?: string;
    description?: string;
    gameId?: string;
    logo?: File;
    name?: string;
    validationData?: ValidationData;
    privacy?: string;
    rules?: string;
    startDayOfWeek?: number;
    territoryId?: string;
    type?: string;
}
