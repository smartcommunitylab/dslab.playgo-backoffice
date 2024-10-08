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

import { ChallengeChoice } from "../model/challengeChoice";
import { ChallengeConceptInfo } from "../model/challengeConceptInfo";
import { ChallengeStatsInfo } from "../model/challengeStatsInfo";
import { Invitation } from "../model/invitation";
import { PlayerChallenge } from "../model/playerChallenge";
import { Reward } from "../model/reward";

@Injectable({
  providedIn: "root",
})
export class ChallengeControllerService {
  constructor(private http: HttpClient) {}
  /**
   * activateChallengeType
   *
   * @param challengeName challengeName
   * @param campaignId campaignId
   */
  public activateChallengeTypeUsingPUT(args: {
    challengeName: string;
    campaignId: string;
  }): Observable<Array<ChallengeChoice>> {
    const { challengeName, campaignId } = args;
    return this.http.request<Array<ChallengeChoice>>(
      "put",
      environment.serverUrl.api +
        `/playandgo/api/challenge/unlock/${encodeURIComponent(
          String(challengeName)
        )}`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * addToBlackList
   *
   * @param campaignId campaignId
   * @param blockedPlayerId blockedPlayerId
   */
  public addToBlackListUsingPOST(args: {
    campaignId: string;
    blockedPlayerId: string;
  }): Observable<any> {
    const { campaignId, blockedPlayerId } = args;
    return this.http.request<any>(
      "post",
      environment.serverUrl.api + `/playandgo/api/challenge/blacklist`,
      {
        params: removeNullOrUndefined({
          campaignId,
          blockedPlayerId,
        }),
      }
    );
  }

  /**
   * changeInvitationStatus
   *
   * @param campaignId campaignId
   * @param challengeId challengeId
   * @param status status
   */
  public changeInvitationStatusUsingPOST(args: {
    campaignId: string;
    challengeId: string;
    status: string;
  }): Observable<any> {
    const { campaignId, challengeId, status } = args;
    return this.http.request<any>(
      "post",
      environment.serverUrl.api +
        `/playandgo/api/challenge/invitation/status/${encodeURIComponent(
          String(challengeId)
        )}/${encodeURIComponent(String(status))}`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * chooseChallenge
   *
   * @param challengeId challengeId
   * @param campaignId campaignId
   */
  public chooseChallengeUsingPUT(args: {
    challengeId: string;
    campaignId: string;
  }): Observable<any> {
    const { challengeId, campaignId } = args;
    return this.http.request<any>(
      "put",
      environment.serverUrl.api +
        `/playandgo/api/challenge/choose/${encodeURIComponent(
          String(challengeId)
        )}`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * deleteFromBlackList
   *
   * @param campaignId campaignId
   * @param blockedPlayerId blockedPlayerId
   */
  public deleteFromBlackListUsingDELETE(args: {
    campaignId: string;
    blockedPlayerId: string;
  }): Observable<any> {
    const { campaignId, blockedPlayerId } = args;
    return this.http.request<any>(
      "delete",
      environment.serverUrl.api + `/playandgo/api/challenge/blacklist`,
      {
        params: removeNullOrUndefined({
          campaignId,
          blockedPlayerId,
        }),
      }
    );
  }

  /**
   * getBlackList
   *
   * @param campaignId campaignId
   */
  public getBlackListUsingGET(
    campaignId: string
  ): Observable<Array<{ [key: string]: any }>> {
    return this.http.request<Array<{ [key: string]: any }>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge/blacklist`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * getChallengeStats
   *
   * @param campaignId campaignId
   * @param playerId playerId
   * @param groupMode groupMode
   * @param dateFrom yyyy-MM-dd
   * @param dateTo yyyy-MM-dd
   */
  public getChallengeStatsUsingGET(args: {
    campaignId: string;
    playerId: string;
    groupMode: string;
    dateFrom: string;
    dateTo: string;
  }): Observable<Array<ChallengeStatsInfo>> {
    const { campaignId, playerId, groupMode, dateFrom, dateTo } = args;
    return this.http.request<Array<ChallengeStatsInfo>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge/stats`,
      {
        params: removeNullOrUndefined({
          campaignId,
          playerId,
          groupMode,
          dateFrom,
          dateTo,
        }),
      }
    );
  }

  /**
   * getChallengeables
   *
   * @param campaignId campaignId
   */
  public getChallengeablesUsingGET(
    campaignId: string
  ): Observable<Array<{ [key: string]: any }>> {
    return this.http.request<Array<{ [key: string]: any }>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge/challengeables`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * getChallengesStatus
   *
   * @param campaignId campaignId
   */
  public getChallengesStatusUsingGET(
    campaignId: string
  ): Observable<Array<ChallengeChoice>> {
    return this.http.request<Array<ChallengeChoice>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge/type`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * getChallenges
   *
   * @param campaignId campaignId
   * @param filter filter
   */
  public getChallengesUsingGET(args: {
    campaignId: string;
    filter?: string;
  }): Observable<ChallengeConceptInfo> {
    const { campaignId, filter } = args;
    return this.http.request<ChallengeConceptInfo>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge`,
      {
        params: removeNullOrUndefined({
          campaignId,
          filter,
        }),
      }
    );
  }

  /**
   * getCompletedChallanges
   *
   * @param campaignId campaignId
   * @param dateFrom UTC millis
   * @param dateTo UTC millis
   */
  public getCompletedChallangesUsingGET(args: {
    campaignId: string;
    dateFrom: number;
    dateTo: number;
  }): Observable<Array<PlayerChallenge>> {
    const { campaignId, dateFrom, dateTo } = args;
    return this.http.request<Array<PlayerChallenge>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge/completed`,
      {
        params: removeNullOrUndefined({
          campaignId,
          dateFrom,
          dateTo,
        }),
      }
    );
  }

  /**
   * getGroupChallengePreview
   *
   * @param campaignId campaignId
   * @param body
   */
  public getGroupChallengePreviewUsingPOST(args: {
    campaignId: string;
    body?: Invitation;
  }): Observable<any> {
    const { campaignId, body } = args;
    return this.http.request<any>(
      "post",
      environment.serverUrl.api + `/playandgo/api/challenge/invitation/preview`,
      {
        body: body,
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * getRewards
   *
   */
  public getRewardsUsingGET(): Observable<{ [key: string]: Reward }> {
    return this.http.request<{ [key: string]: Reward }>(
      "get",
      environment.serverUrl.api + `/playandgo/api/challenge/rewards`,
      {}
    );
  }

  /**
   * sendInvitation
   *
   * @param campaignId campaignId
   * @param body
   */
  public sendInvitationUsingPOST(args: {
    campaignId: string;
    body?: Invitation;
  }): Observable<any> {
    const { campaignId, body } = args;
    return this.http.request<any>(
      "post",
      environment.serverUrl.api + `/playandgo/api/challenge/invitation`,
      {
        body: body,
        params: removeNullOrUndefined({
          campaignId,
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
