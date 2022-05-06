import { PageTrackedInstance } from "src/app/core/api/generated/model/pageTrackedInstance";
import { Sort } from "src/app/core/api/generated/model/sort";
import { SwaggerPageable } from "src/app/core/api/generated/model/swaggerPageable";
import { TrackedInstance } from "src/app/core/api/generated/model/trackedInstance";
import { Geolocation } from "src/app/core/api/generated/model/geolocation";
import { ValidationResult } from "src/app/core/api/generated/model/validationResult";
import { PlayerClass } from "./PagePlayerInfoConsole-class";

export class  PageTrackedInstanceClass implements PageTrackedInstance {
    content?: Array<TrackedInstanceClass>;
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
    startTime?: Date;
    started?: boolean;
    suspect?: boolean;
    territoryId?: string;
    time?: string;
    toCheck?: boolean;
    userId?: string;
    validating?: boolean;
    validationResult?: ValidationResult;
    userValues?: PlayerClass;
}

export class GeolocationClass implements Geolocation{
    accuracy?: number;
    activityConfidence?: number;
    activityType?: string;
    altitude?: number;
    batteryIsCharging?: boolean;
    batteryLevel?: number;
    certificate?: string;
    createdAt?: Date;
    deviceId?: string;
    deviceModel?: string;
    geocoding?: Array<number>;
    geofence?: any;
    heading?: number;
    isMoving?: boolean;
    latitude?: number;
    longitude?: number;
    multimodalId?: string;
    recordedAt?: Date;
    sharedTravelId?: string;
    speed?: number;
    travelId?: string;
    userId?: string;
    uuid?: string;
}