import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/auth/auth.service";
import { RoleService } from "./role.service";
import { map } from 'rxjs/operators';
import { PlayerRole } from "src/app/core/api/generated/model/playerRole";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router,private roleService: RoleService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles = route.data.expectedRoles;
    return this.checkLogin(expectedRoles);
  }

  checkLogin(expectedRoles: string[]): Observable<boolean> {
    return this.roleService.getInitializedJustOncePerUserSecond().pipe(map((res : PlayerRole[])=>{
      var listRoles: string[] = [];
      res.map((item) => {
        listRoles.push(item.role);
      });
      return this.isInside(listRoles,expectedRoles);
    })
    );
  }

  isInside(values: string[], list: string[]): boolean {
    const res = false;
    for(let item of values){
      for(let listItem of list){
        if(item === listItem){
          return true;
        }
      }
    }
    return false;
  }
}
