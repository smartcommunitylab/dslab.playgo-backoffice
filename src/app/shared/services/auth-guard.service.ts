import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "src/app/core/auth/auth.service";
import decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.auth.logout();
      //this.router.navigate(['login']);
      return false;
    } else {
      const expectedRoles = route.data.expectedRoles;
      const role = this.auth.getRole(); // TODO call API authority
      return this.isInside(role,expectedRoles);
      }
  }

  isInside(value: string, list: string[]): boolean {
    const res = list.filter((x) => x === value);
    if (res.length >0) {
      return true;
    } else {
      return false;
    }
  }
}
