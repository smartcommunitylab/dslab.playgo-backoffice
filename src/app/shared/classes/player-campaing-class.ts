import { CampaignClass } from "./campaing-class";
import { UserClass } from "./user-class";

export class PlayerCampaign{
    campaigns?: CampaignSubscription[];
    player?: Player;
}


export class CampaignSubscription{
    campaign?: CampaignClass;
    subscription?: Subscription;
}

export class Subscription{
    campaignData?: any;
    campaignId?: string;
    id?: string;
    mail?: string;
    playerId?: string;
    registrationDate?: string;
    sendMail?: boolean;
    territoryId?: string;
}

export class Player{
    familyName?: string;
    givenName?: string;
    language?: string;
    mail?: string;
    nickname?: string;
    playerId?: string;
    sendMail?: boolean;
    territoryId?: string;
    
}