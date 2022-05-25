import { PagePlayerInfoConsole } from "src/app/core/api/generated/model/pagePlayerInfoConsole";
import { Player } from "src/app/core/api/generated/model/player";
import { PlayerInfoConsole } from "src/app/core/api/generated/model/playerInfoConsole";
import { Sort } from "src/app/core/api/generated/model/sort";
import { SwaggerPageable } from "src/app/core/api/generated/model/swaggerPageable";

export class  PagePlayer  implements  PagePlayerInfoConsole{
    content?: Array<PlayerInfoConsole>;
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: SwaggerPageable;
    size?: number;
    sort?: Sort;
    totalElements?: number;
    totalPages?: number;
  }

  
  export class PlayerClass implements Player{
    familyName?: string;
    givenName?: string;
    language?: string;
    mail?: string;
    nickname?: string;
    playerId?: string;
    sendMail?: boolean;
    territoryId?: string;
  }