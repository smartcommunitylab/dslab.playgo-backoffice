import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Paginator } from '../classes/paginator-class';
import { PLAYER_BASE_PATH } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class PlayerHandlerService {

  constructor(private http: HttpClient) {}

  getPlayers<T>(pageNumber:number,itemPerPage:number,sort:string,territoryId:string,query:string): Observable<Paginator<T>> {
    const body = {params:{
      page: pageNumber,
      size: itemPerPage,
      sort: sort,
      territoryId: territoryId,
      text: query
    }};
    return this.http.get<Paginator<T>>(PLAYER_BASE_PATH,body);
  }

}
