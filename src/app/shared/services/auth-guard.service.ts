import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import { ADMIN } from "../constants/constants";
import { RoleService } from "./role.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router,private roleService: RoleService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.auth.logout();
      //this.router.navigate(['login']);
      return false;
    } else {
      const expectedRoles = route.data.expectedRoles;
      const foundRoles = this.roleService.getRoles();
      const res = this.isInside(foundRoles,expectedRoles);
      if(!res){
        this.router.navigate(['404']);
      }
      return res;
    }
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
