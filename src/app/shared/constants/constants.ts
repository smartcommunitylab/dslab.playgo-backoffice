export const DEFAULT_LATITUDE = 45.331512968961256;
export const DEFAULT_LONGITUDE = 10.612217051626212;

export const BACKEND_BASE_PATH = 'https://backenddev.playngo.it/';
export const TERRITORY_BASE_PATH = BACKEND_BASE_PATH+ 'playandgo/api/territory';
export const CAMPAIGN_BASE_PATH = BACKEND_BASE_PATH+'playandgo/api/campaign';
export const MANAGER_CAMPAIGN_BASE_PATH = BACKEND_BASE_PATH+'playandgo/api/console/role/campaign';
export const MANAGER_TERRITORY_BASE_PATH = BACKEND_BASE_PATH+'playandgo/api/console/role/territory';
export const ROLE_BASE_PATH = BACKEND_BASE_PATH+'playandgo/api/console/role/my';
export const PLAYER_BASE_PATH = BACKEND_BASE_PATH+'playandgo/api/console/player/search';
export const TRAKING_BASE_PATH = BACKEND_BASE_PATH+'playandgo/api/console/track/search';

export const TYPE_CAMPAIGN = ["personal","city","school","company"];
export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
    },
  };

export const PREFIX_SRC_IMG = "data:"
export const BASE64_SRC_IMG = ";base64,"
export const ADMIN = "admin";
export const TERRITORY_ADMIN = "territory";
export const CAMPAIGN_ADMIN = "campaign";
export const TERRITORY_ID_LOCAL_STORAGE_KEY = "TERRITORY_ID";
export const ROLES_LOCAL_STORAGE_KEY = "ROLES";
export const VALIDATIONJSON = "{}";
export const LIST_STATES_TRACK = ["valid", "invalid"];
export const LIST_ERROR_STATES_TRACK = ["TOO_SHORT", "TOO_SLOW", "TOO_FAST", "OUT_OF_AREA", "DOES_NOT_MATCH", "DATA_HOLE", "NO_DATA", "SHARED_DOES_NOT_MATCH"];
export const CHANNELS_COMMUNICATION = ["email","announcement","push"];
export const PRE_TEXT_JSON_ASSIGN_SURVAY = '{}';
export const CONST_LANGUAGES_SUPPORTED = ['it','en'];
export const LANGUAGE_DEFAULT = 'it'; 