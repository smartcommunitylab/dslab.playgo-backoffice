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

export interface CampaignWebhook {
  campaignId?: string;
  endpoint?: string;
  events?: Array<CampaignWebhook.EventsEnum>;
  id?: string;
}
export namespace CampaignWebhook {
  export type EventsEnum = "register" | "unregister" | "validTrack";
  export const EventsEnum = {
    Register: "register" as EventsEnum,
    Unregister: "unregister" as EventsEnum,
    ValidTrack: "validTrack" as EventsEnum,
  };
}
