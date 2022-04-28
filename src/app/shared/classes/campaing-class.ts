import { Logo } from "./logo-class";

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
    logo?: Logo;
    name?: string;
    validationData?: ValidationData;
    privacy?: string;
    rules?: string;
    startDayOfWeek?: number;
    territoryId?: string;
    type?: string;


    setClassWithourError(element: CampaignClass){
        const nullString = "valueNotProvided";
        if(element.active){
            this.active = element.active;
        }else{
            this.active = false;
        }
        if(element.campaignId){
            this.campaignId = element.campaignId;
        }else{
            this.campaignId = "";
        }
        if(element.communications){
            this.communications = element.communications;
        }else{
            this.communications = false;
        }
        if(element.dateFrom){
            this.dateFrom = element.dateFrom;
        }else{
            this.dateFrom = "";
        }
        if(element.dateTo){
            this.dateTo = element.dateTo;
        }else{
            this.dateTo = "";
        }
        if(element.description){
            this.description = element.description;
        }else{
            this.description = "";
        }
        if(element.gameId){
            this.gameId = element.gameId;
        }else{
            this.gameId = "";
        }
        if(element.logo){
            this.logo = element.logo;
        }else{
            this.logo = new Logo();
        }
        if(element.name){
            this.name = element.name;
        }else{
            this.name = "";
        }
        if(element.validationData){
            this.validationData = element.validationData;
        }else{
            this.validationData = new ValidationData();
        }
        if(element.privacy){
            this.privacy = element.privacy;
        }else{
            this.privacy = "";
        }
        if(element.rules){
            this.rules = element.rules;
        }else{
            this.rules = "";
        }
        if(element.startDayOfWeek){
            this.startDayOfWeek = element.startDayOfWeek;
        }else{
            this.startDayOfWeek = 1;
        }
        if(element.territoryId){
            this.territoryId = element.territoryId;
        }else{
            this.territoryId = "";
        }
        if(element.type){
            this.type = element.type;
        }else{
            this.type = "";
        }
    }
}
