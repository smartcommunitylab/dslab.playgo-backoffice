import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TerritoryClass } from '../classes/territory-class';
import { TERRITORY_BASE_PATH } from '../constants/constants';


@Injectable({
  providedIn: 'root'
})
export class TerritoryService {


  constructor(private http: HttpClient) { }

  get(): Observable<TerritoryClass[]>{
    return this.http.get<TerritoryClass[]>(TERRITORY_BASE_PATH);
  }

  put(territory: TerritoryClass): Observable<any>{
    return this.http.put<void>(TERRITORY_BASE_PATH,territory);
  }

  post(territory: TerritoryClass): Observable<any>{
    return this.http.post<void>(TERRITORY_BASE_PATH,territory);
  }

  getById(id : string): Observable<TerritoryClass>{
    return this.http.get<TerritoryClass>(TERRITORY_BASE_PATH+id);
  }

  delete(id : string): Observable<any>{
    return this.http.delete<void>(TERRITORY_BASE_PATH+id);
  }


}
