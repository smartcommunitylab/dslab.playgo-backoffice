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

export interface PlayerRole {
  entityId?: string;
  id?: string;
  playerId?: string;
  preferredUsername?: string;
  role?: PlayerRole.RoleEnum;
}
export namespace PlayerRole {
  export type RoleEnum = "admin" | "campaign" | "territory";
  export const RoleEnum = {
    Admin: "admin" as RoleEnum,
    Campaign: "campaign" as RoleEnum,
    Territory: "territory" as RoleEnum,
  };
}