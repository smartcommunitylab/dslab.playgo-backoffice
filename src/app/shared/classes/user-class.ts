import { PlayerRole } from "src/app/core/api/generated/model/playerRole";

export class UserClass implements PlayerRole{
    id?: string;
    entityId?: string;
    playerId?: string;
    preferredUsername?: string; //email
    role?: PlayerRole.RoleEnum;
}