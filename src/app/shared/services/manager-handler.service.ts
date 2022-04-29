import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ManagerClass } from "../classes/manager-class";
import {
  MANAGER_CAMPAIGN_BASE_PATH,
  MANAGER_TERRITORY_BASE_PATH,
} from "../constants/constants";

@Injectable({
  providedIn: "root",
})
export class ManagerHandlerService {
  constructor(private http: HttpClient) {}

  getManagerCampaign(campaignId: string): Observable<ManagerClass[]> {
    const body = {params:{campaignId: campaignId}};
    return this.http.get<ManagerClass[]>(MANAGER_CAMPAIGN_BASE_PATH,body);
  }

  postManagerCampaign(campaignId: string,userName:string): Observable<any> {
    const body = {
      params:{
        campaignId: campaignId,
        userName: userName
      }
    };
    return this.http.post<any>(MANAGER_CAMPAIGN_BASE_PATH,{}, body);
  }

  deleteManagerCampaign(campaignId: string, userName: string): Observable<any> {
    const body = {
      params: {
        campaignId: campaignId,
        userName: userName
      }
    };
    return this.http.delete<void>(MANAGER_CAMPAIGN_BASE_PATH,body);
  }

  getManagerTerritory(territoryId: string): Observable<ManagerClass[]> {
    const body = {
      params: {
        territoryId: territoryId,
      }
    };
    return this.http.get<ManagerClass[]>(MANAGER_TERRITORY_BASE_PATH,body);
  }

  postManagerTerritory(territoryId: string, userName: string): Observable<any> {
    const body = {
      params: {
        territoryId: territoryId,
        userName: userName
      }
    };
    return this.http.post<any>(MANAGER_TERRITORY_BASE_PATH,{}, body);
  }

  deleteManagerTerritory(territoryId: string,userName: string): Observable<any> {
    const body = {
      params: {
        territoryId: territoryId,
        userName: userName
      }
    };
    return this.http.delete<void>(MANAGER_TERRITORY_BASE_PATH,body);
  }
}
