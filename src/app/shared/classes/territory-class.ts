import { Territory } from "src/app/core/api/generated/model/territory";
import { TerritoryArea } from "./territory-area";
import { TerritoryData } from "./territory-data";

export class TerritoryClass implements Territory {

    territoryId?: string;
    description?: { [key: string]: string };
    name?: { [key: string]: string };
    messagingAppId?: string;
    territoryData?: TerritoryData;
}
