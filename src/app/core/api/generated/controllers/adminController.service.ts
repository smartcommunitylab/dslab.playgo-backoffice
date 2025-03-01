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

import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminControllerService {
  constructor(private http: HttpClient) {}
  /**
   * uploadCompanyCampaignSubscription
   *
   * @param territoryId territoryId
   * @param campaignId campaignId
   * @param body
   */
  public uploadCompanyCampaignSubscriptionUsingPOST(args: {
    territoryId: string;
    campaignId: string;
    body?: Object;
  }): Observable<Array<string>> {
    const { territoryId, campaignId, body } = args;
    return this.http.request<Array<string>>(
      "post",
      environment.serverUrl.api +
        `/playandgo/api/admin/company/subscribe/upload`,
      {
        body: body,
        params: removeNullOrUndefined({
          territoryId,
          campaignId,
        }),
      }
    );
  }

  /**
   * uploadPlayers
   *
   * @param territoryId territoryId
   * @param lang lang
   * @param body
   */
  public uploadPlayersUsingPOST(args: {
    territoryId: string;
    lang: string;
    body?: Object;
  }): Observable<Array<string>> {
    const { territoryId, lang, body } = args;
    return this.http.request<Array<string>>(
      "post",
      environment.serverUrl.api + `/playandgo/api/admin/player/upload`,
      {
        body: body,
        params: removeNullOrUndefined({
          territoryId,
          lang,
        }),
      }
    );
  }
}

function removeNullOrUndefined(obj: any) {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] != null) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
