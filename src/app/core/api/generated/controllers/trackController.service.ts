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

import { GeolocationsEvent } from "../model/geolocationsEvent";
import { PageTrackedInstanceInfo } from "../model/pageTrackedInstanceInfo";
import { TrackedInstanceInfo } from "../model/trackedInstanceInfo";

@Injectable({
  providedIn: "root",
})
export class TrackControllerService {
  constructor(private http: HttpClient) {}
  /**
   * getTrackedInstanceInfoList
   *
   * @param page Results page you want to retrieve (0..N)
   * @param size Number of records per page
   * @param dateFrom yyyy-MM-dd HH:mm:ss
   * @param sort Sorting option: field,[asc,desc]
   * @param dateTo yyyy-MM-dd HH:mm:ss
   * @param campaignId campaignId
   */
  public getTrackedInstanceInfoListUsingGET(
    page: number,
    size: number,
    dateFrom?: Date,
    sort?: string,
    dateTo?: Date,
    campaignId?: string
  ): Observable<PageTrackedInstanceInfo> {
    return this.http.request<PageTrackedInstanceInfo>(
      "get",
      environment.serverUrl.api + `/playandgo/api/track/player`,
      {
        params: removeNullOrUndefined({
          dateFrom,
          page,
          size,
          sort,
          dateTo,
          campaignId,
        }),
      }
    );
  }

  /**
   * getTrackedInstanceInfo
   *
   * @param trackedInstanceId trackedInstanceId
   * @param campaignId campaignId
   */
  public getTrackedInstanceInfoUsingGET(
    trackedInstanceId: string,
    campaignId?: string
  ): Observable<TrackedInstanceInfo> {
    return this.http.request<TrackedInstanceInfo>(
      "get",
      environment.serverUrl.api +
        `/playandgo/api/track/player/${encodeURIComponent(
          String(trackedInstanceId)
        )}`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * storeGeolocationEvent
   *
   * @param body
   */
  public storeGeolocationEventUsingPOST(
    body?: GeolocationsEvent
  ): Observable<any> {
    return this.http.request<any>(
      "post",
      environment.serverUrl.api + `/playandgo/api/track/player/geolocations`,
      {
        body: body,
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