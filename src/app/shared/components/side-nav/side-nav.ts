import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { PlayerRole } from "src/app/core/api/generated/model/playerRole";
import {
  ADMIN,
  CAMPAIGN_ADMIN,
  TERRITORY_ADMIN,
} from "../../constants/constants";
import { RoleService } from "../../services/role.service";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.html",
  styleUrls: ["./side-nav.scss"],
})
export class SideNavComponent implements OnInit {
  
  roles: PlayerRole[];
  roleAdmin = false;
  roleTerritory = false;
  roleCampaign = false;
  selected: string;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.roleService.getObservableRoles().subscribe((result)=>{
      this.roles =result;
      this.roleAdmin = this.checkIfRoleAdmin();
      this.roleCampaign = this.checkIfRoleCampaign();
      this.roleTerritory = this.checkIfRoleTerritory();
    });
    //console.log(this.roleAdmin,this.roleCampaign,this.roleTerritory);
  }

  checkIfRoleAdmin(): boolean {
    if (!!this.roles && this.roles.length > 0) {
      for (let role of this.roles) {
        if (role.role === ADMIN) {
          return true;
        }
      }
    }

    return false;
  }

  checkIfRoleTerritory(): boolean {
    if (!!this.roles && this.roles.length > 0) {
      for (let role of this.roles) {
        if (role.role === TERRITORY_ADMIN) {
          return true;
        }
      }
    }
    return false;
  }

  checkIfRoleCampaign(): boolean {
    if (!!this.roles && this.roles.length > 0) {
      for (let role of this.roles) {
        if (role.role === CAMPAIGN_ADMIN) {
          return true;
        }
      }
    }
    return false;
  }
}
