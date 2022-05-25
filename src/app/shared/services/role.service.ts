import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
import { PlayerRole } from "src/app/core/api/generated/model/playerRole";

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
      this.rolesSubject.next(listRoles);
      this.simpleRoles = listRoles;
    });
  }

  getInitializedJustOncePerUserSecond(): Observable<PlayerRole[]> {
    return this.roleService.getMyRolesUsingGET();
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

  setRolesSubcejt(obj){
    this.rolesSubject.next(obj);
  }

  setSimpleRoles(obj){
    this.simpleRoles = obj;
  }

}
