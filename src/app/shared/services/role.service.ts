import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import { UserClass } from "../classes/user-class";
import {
  ADMIN,
  TERRITORY_ADMIN,
  CAMPAIGN_ADMIN,
  ROLE_BASE_PATH,
  ROLES_LOCAL_STORAGE_KEY,
} from "../constants/constants";

@Injectable({
  providedIn: "root",
})
export class RoleService {

  private rolesSubject = new Subject<string[]>();
  private simpleRoles: string[] = [];

  constructor(private http: HttpClient,
    private roleService: ConsoleControllerService) {}

  async getInitializedJustOncePerUser(): Promise<void> {
    await this.roleService.getMyRolesUsingGET().subscribe((res) => {
      var listRoles: string[] = [];
      res.map((item) => {
        listRoles.push(item.role);
      });
      //listRoles = ["campaign"]; // used for testing different roles 
      this.rolesSubject.next(listRoles);
      this.simpleRoles = listRoles;
      console.log("QUante volte qua");
    });
  }

  getObservableRoles(): Observable<string[]> {
    // used in the components in which the roles are not already intitialized
    // https://stackoverflow.com/questions/40393703/rxjs-observable-angular-2-on-localstorage-change
    return this.rolesSubject;
  }

  getRoles(): string[]{
    // used in the components where the roles are already intitialized
    return this.simpleRoles;
  }

}
