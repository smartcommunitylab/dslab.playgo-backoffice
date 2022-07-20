import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TerritoryControllerService } from 'src/app/core/api/generated/controllers/territoryController.service';
import { Territory } from 'src/app/core/api/generated/model/territory';

@Injectable({
  providedIn: 'root'
})
export class TerritoryListService {

    private territoriesListSource = new BehaviorSubject<Territory[]>([]);
    list = this.territoriesListSource.asObservable();

    constructor(private territoryService: TerritoryControllerService,) { }

    uploadList(){
        this.territoryService.getTerritoriesUsingGET().subscribe((res) => {
            this.territoriesListSource.next(res);
        });        
    }
}
