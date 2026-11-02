import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CampaignAcceptanceControllerService {
  constructor(private http: HttpClient) {}

  /**
   * updateSubscriptionsAcceptance
   *
   * @param campaignId campaignId
   * @param privacyAcceptance privacyAcceptance
   * @param rulesAcceptance rulesAcceptance
   */
  public updateSubscriptionsAcceptanceUsingPUT(args: {
    campaignId: string;
    privacyAcceptance: boolean;
    rulesAcceptance: boolean;
  }): Observable<any> {
    const { campaignId, privacyAcceptance, rulesAcceptance } = args;
    const params = new HttpParams()
      .set("privacyAcceptance", String(privacyAcceptance))
      .set("rulesAcceptance", String(rulesAcceptance));
    return this.http.request<any>(
      "put",
      environment.serverUrl.api +
        `/playandgo/api/campaign-acceptance/subscriptions/${encodeURIComponent(
          String(campaignId)
        )}`,
      {
        params: params,
      }
    );
  }
}
