import { HttpClient, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import { PlayerRole } from "src/app/core/api/generated/model/playerRole";

@Injectable({
  providedIn: "root",
})
export class RoleService {

  private rolesSubject = new Subject<PlayerRole[]>();
  private simpleRoles: PlayerRole[] = [];

  constructor(private roleService: ConsoleControllerService) {}

  getInitializedJustOncePerUserSecond(): Observable<PlayerRole[]> {
    return this.roleService.getMyRolesUsingGET();
  }

  getObservableRoles(): Observable<PlayerRole[]> {
    // used in the components in which the roles are not already intitialized
    // https://stackoverflow.com/questions/40393703/rxjs-observable-angular-2-on-localstorage-change
    return this.rolesSubject;
  }

  getRoles(): PlayerRole[]{
    // used in the components where the roles are already intitialized
    return this.simpleRoles;
  }

  setRolesSubcejt(obj: PlayerRole[]){
    this.rolesSubject.next(obj);
  }

  setSimpleRoles(obj: PlayerRole[]){
    this.simpleRoles = obj;
  }


}
