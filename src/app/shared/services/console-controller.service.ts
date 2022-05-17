
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PageTrackedInstanceConsole } from "src/app/core/api/generated/model/pageTrackedInstanceConsole";


@Injectable({
  providedIn: "root",
})
export class ConsoleControllerInternalService {
  constructor(private http: HttpClient) {}

  public searchTrackedInstanceUsingGET(
    page: number,
    size: number,
    territoryId: string,
    sort?: string,
    trackId?: string,
    playerId?: string,
    modeType?: string,
    dateFrom?: string,
    dateTo?: string,
    campaignId?: string,
    status?: string
  ): Observable<PageTrackedInstanceConsole> {
    return this.http.request<PageTrackedInstanceConsole>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/track/search`,
      {
        params: removeNullOrUndefined({
          page,
          size,
          sort,
          territoryId,
          trackId,
          playerId,
          modeType,
          dateFrom,
          dateTo,
          campaignId,
          status,
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