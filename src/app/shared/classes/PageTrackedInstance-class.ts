
import { Sort } from "src/app/core/api/generated/model/sort";
import { SwaggerPageable } from "src/app/core/api/generated/model/swaggerPageable";
import { TrackedInstance } from "src/app/core/api/generated/model/trackedInstance";
import { Geolocation } from "src/app/core/api/generated/model/geolocation";
import { ValidationResult } from "src/app/core/api/generated/model/validationResult";
import { PlayerClass } from "./PagePlayerInfoConsole-class";
import { PageTrackedInstanceConsole } from "src/app/core/api/generated/model/pageTrackedInstanceConsole";
import { TrackedInstanceConsole } from "src/app/core/api/generated/model/trackedInstanceConsole";

export class  PageTrackedInstanceClass implements PageTrackedInstanceConsole {
    content?: Array<TrackedInstanceConsoleClass>;
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

export class TrackedInstanceConsoleClass implements TrackedInstanceConsole{
    playerInfo?: PlayerClass;
    trackedInstance?: TrackedInstanceClass;
}

export class TrackedInstanceClass implements TrackedInstance{
    approved?: boolean;
    changedValidity?: TrackedInstance.ChangedValidityEnum;
    clientId?: string;
    complete?: boolean;
    day?: string;
    deviceInfo?: string;
    freeTrackingTransport?: string;
    geolocationEvents?: Array<GeolocationClass>;
    id?: string;
    multimodalId?: string;
    overriddenDistances?: { [key: string]: number };
    routesPolylines?: any;
    sharedTravelId?: string;
    startTime?: number;
    started?: boolean;
    suspect?: boolean;
    territoryId?: string;
    time?: string;
    toCheck?: boolean;
    userId?: string;
    validating?: boolean;
    validationResult?: ValidationResult;
}

export class GeolocationClass implements Geolocation{
    // geolocation is created with wrong parameters for example 
    // activiryConfidence should be activity_confidence (from the data recived)
    // the generator for Geolocation interface not correct??
    accuracy?: number;
    activityConfidence?: number;
    activityType?: string;
    altitude?: number;
    batteryIsCharging?: boolean;
    batteryLevel?: number;
    certificate?: string;
    createdAt?: number;
    deviceId?: string;
    deviceModel?: string;
    geocoding?: Array<number>;
    geofence?: any;
    heading?: number;
    isMoving?: boolean;
    latitude?: number;
    longitude?: number;
    multimodalId?: string;
    recordedAt?: number;
    sharedTravelId?: string;
    speed?: number;
    travelId?: string;
    userId?: string;
    uuid?: string;
}