import { CampaignSubscription } from "src/app/core/api/generated/model/campaignSubscription";
import { Player } from "src/app/core/api/generated/model/player";
import { PlayerCampaign } from "src/app/core/api/generated/model/playerCampaign";
import { PlayerInfoConsole } from "src/app/core/api/generated/model/playerInfoConsole";
import { CampaignClass } from "./campaing-class";

export class PlayerCampaignClass implements PlayerInfoConsole {
    campaigns?: CampaignSubscriptionClass[];
    player?: PlayerClass;
}


export class CampaignSubscriptionClass implements PlayerCampaign {
    campaign?: CampaignClass;
    subscription?: Subscription;
}

export class Subscription implements CampaignSubscription{
    campaignData?: any;
    campaignId?: string;
    id?: string;
    mail?: string;
    playerId?: string;
    registrationDate?: string;
    sendMail?: boolean;
    territoryId?: string;
}

export class PlayerClass implements Player{
    familyName?: string;
    givenName?: string;
    language?: string;
    mail?: string;
    nickname?: string;
    playerId?: string;
    sendMail?: boolean;
    territoryId?: string;
}