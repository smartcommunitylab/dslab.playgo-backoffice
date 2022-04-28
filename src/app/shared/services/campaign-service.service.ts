import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { __param } from 'tslib';
import { CampaignClass } from '../classes/campaing-class';
import { Logo } from '../classes/logo-class';
import { CAMPAIGN_BASE_PATH } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private http: HttpClient) { }

  get(territoryId: string): Observable<CampaignClass[]>{

    let params = new HttpParams().set('territoryId', territoryId);
    return this.http.get<CampaignClass[]>(CAMPAIGN_BASE_PATH,{params: params});
  }

  put(campaign: CampaignClass): Observable<any>{
    return this.http.put<any>(CAMPAIGN_BASE_PATH,campaign);
  }

  post(campaign: CampaignClass): Observable<any>{
    return this.http.post<any>(CAMPAIGN_BASE_PATH,campaign);
  }

  postLogo(campaignId:string, logo: Logo): Observable<any>{
    return this.http.post<any>(CAMPAIGN_BASE_PATH+'/'+campaignId+'/'+'logo',logo);
  }

  getById(id : string): Observable<CampaignClass>{
    return this.http.get<CampaignClass>(CAMPAIGN_BASE_PATH+'/'+id);
  }

  delete(id : string): Observable<any>{
    return this.http.delete<void>(CAMPAIGN_BASE_PATH+'/'+id);
  }
}
