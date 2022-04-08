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

  put(){}

  post(){}

  getById(id : string){}

  delete(id : string){

  }


}
