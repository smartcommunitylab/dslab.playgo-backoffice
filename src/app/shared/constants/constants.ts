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
export const LIST_STATES_TRACK = ["valid","pending", "invalid","all"];
export const LIST_ERROR_STATES_TRACK = ["TOO_SHORT", "TOO_SLOW", "TOO_FAST", "OUT_OF_AREA", "DOES_NOT_MATCH", "DATA_HOLE", "NO_DATA", "SHARED_DOES_NOT_MATCH"];
export const CHANNELS_COMMUNICATION = ["email","news","push"];
export const PRE_TEXT_JSON_ASSIGN_SURVAY = '{}';
export const CONST_LANGUAGES_SUPPORTED = ['it','en'];
export const LANGUAGE_DEFAULT = 'it'; 
export const LANGUAGE_LOCAL_STORAGE = 'language';
export const VALUE_EMPTY_SELECT_LIST = 'all';
export const DEFAULT_SURVEY_KEY = 'defaultSurvey';
export const PERIODS_KEY = 'periods';
export const DAILY_LIMIT = 'dailyLimit';
export const WEEKLY_LIMIT = 'weeklyLimit';
export const MONTHLY_LIMIT = 'monthlyLimit';
export const WEEB_HOOK_EVENT = ['register','unregister','validTrack'];
export const CONST_TIMEZONES_SUPPORTED = ['Europe/Rome'];
export const END_YEAR_FIXED = 7777777777000;
export const START_YEAR_FIXED = 0;
export const CHALLENGE_PLAYER_PROPOSER = "challengePlayerProposed"
export const CHALLENGE_PLAYER_ASSIGNED ="challengePlayerAssigned"
export const DAY_WEEK_KEY_VALUE = [{"day":"MON","value":1},{"day":"TUE","value":2},{"day":"WED","value":3},{"day":"THU","value":4},{"day":"FRI","value":5},{"day":"SAT","value":6},{"day":"SUN","value":7}]
export const HOURS_CONST = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
export const LIST_SCORE_STATUS = ["UNASSIGNED", "COMPUTED", "SENT"];
export const LIST_TYPE_EVALUATION_FOR_MEANS = ["distance","co2","tracks","time"];
export const METRIC = "metric";
export const COEFFICIENT = "coefficient";
export const VIRTUAL_SCORE = "virtualScore";
export const METRIC_EVALUATION = "metricEvaluation";
export const POINTS = "points";
export const LABEL_ADD_MODIFY_CAMPIGN = "labelAddModifyCampaign";
export const LABEL = "label";
export const DAILY_LIMIT_VIRTUAL_POINTS= "dailyLimitvirtualPoints";
export const WEEKLY_LIMIT_VIRTUAL_POINTS= "weeklyLimitvirtualPoints";
export const MONTHLY_LIMIT_VIRTUAL_POINTS= "monthlyLimitvirtualPoints";
export const DAILY_LIMIT_TRIPS_NUMBER= "dailyLimitTripsNumber";
export const WEEKLY_LIMIT_TRIPS_NUMBER= "weeklyLimitTripsNumber";
export const MONTHLY_LIMIT_TRIPS_NUMBER= "weeklyLimitTripsNumber";
export const DAILY_LIMIT_VIRTUAL_POINTS_SPEC_LABLE= "scoreDailyLimit";
export const WEEKLY_LIMIT_VIRTUAL_POINTS_SPEC_LABLE= "scoreWeeklyLimit";
export const MONTHLY_LIMIT_VIRTUAL_POINTS_SPEC_LABLE= "scoreMonthlyLimit";
export const DAILY_LIMIT_TRIPS_NUMBER_SPEC_LABLE= "trackDailyLimit";
export const WEEKLY_LIMIT_TRIPS_NUMBER_SPEC_LABLE= "trackWeeklyLimit";
export const MONTHLY_LIMIT_TRIPS_NUMBER_SPEC_LABLE= "trackMonthlyLimit";
export const USE_MULTI_LOCATION= "useMultiLocation";
export const USE_EMPLOYEE_LOCATION= "useEmployeeLocation";