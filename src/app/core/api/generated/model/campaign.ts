/**
 * Play&Go Project
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 2.0
 * Contact: info@smartcommunitylab.it
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CampaignDetail } from "./campaignDetail";
import { Image } from "./image";

export interface Campaign {
  active?: boolean;
  banner?: Image;
  campaignId?: string;
  communications?: boolean;
  dateFrom?: string;
  dateTo?: string;
  description?: string;
  details?: Array<CampaignDetail>;
  gameId?: string;
  logo?: Image;
  name?: string;
  startDayOfWeek?: number;
  territoryId?: string;
  type?: Campaign.TypeEnum;
  validationData?: any;
}
export namespace Campaign {
  export type TypeEnum = "city" | "company" | "personal" | "school";
  export const TypeEnum = {
    City: "city" as TypeEnum,
    Company: "company" as TypeEnum,
    Personal: "personal" as TypeEnum,
    School: "school" as TypeEnum,
  };
}