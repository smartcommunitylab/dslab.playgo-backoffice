import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginator } from '../classes/paginator-class';
import { TRAKING_BASE_PATH } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private http: HttpClient) {}

  getPlayers<T>(
    pageNumber:number,
    itemPerPage:number,
    sort:string,
    territoryId:string,
    trackId:string,
    playerId:string,
    modelType:string,
    dateFrom:string,
    dateTo:string,
    campaignId:string,
    status:string): Observable<Paginator<T>> {
    const body = {params:{
      page: pageNumber,
      size: itemPerPage,
      sort: sort,
      territoryId: territoryId,
      trackId:trackId,
      playerId:playerId,
      modelType:modelType,
      dateFrom:dateFrom,
      dateTo:dateTo,
      campaignId:campaignId,
      status:status
    }};
    return this.http.get<Paginator<T>>(TRAKING_BASE_PATH,body);
  }

}
