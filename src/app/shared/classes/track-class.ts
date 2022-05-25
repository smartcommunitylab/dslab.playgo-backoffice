export class Track{
    approved?: boolean;
    changedValidity?: string;
    clientId?: string;
    complete?: boolean;
    day?: string;
    deviceInfo?: string;
    freeTrackingTransport?: string;
    geolocationEvents: GeoLocationEvent[];
    id?: string;
    multimodalId?: string;
    overriddenDistances?: Distances;
    routesPolylines?: any; // {}
    sharedTravelId?: string;
    startTime?: string;
    started?: boolean;
    suspect?: boolean;
    territoryId?: string;
    time?: string;
    toCheck?: boolean;
    userId?: string;
    validating?: boolean;
    validationResult?: ValidationResult;
}

export class GeoLocationEvent{
    accuracy?: number;
    activity_confidence?: number;
    activity_type?: string;
    altitude?: number;
    battery_is_charging?: boolean;
    battery_level?: number;
    certificate?: string;
    created_at?: string;
    device_id?: string;
    device_model?: string;
    geocoding?: number[];
    geofence?: any; // {} ?
    heading?: number;
    is_moving?: boolean;
    latitude?: number;
    longitude?: number;
    multimodalId?: string;
    recorded_at?: string;
    sharedTravelId?: string;
    speed?: number;
    travelId?: string;
    userId?: string;
    uuid?: string;
}

export class Distances{
    additionalProp1?: number;
    additionalProp2?: number;
    additionalProp3?: number;
}


export class ValidationResult{
    distance?: number;
    plannedAsFreeTracking?: boolean;
    time?: number;
    travelValidity?: string;
    valid?: boolean;
    validationStatus?: ValidationStatus;
}

export class ValidationStatus{
    accuracyRank?: number;
    averageSpeed?: number;
    certified?: boolean;
    coverageThreshold?: number;
    distance?: number;
    duration?: number;
    effectiveDistances?: Distances;
    error?: string;
    intervals?: Interval[];
    locations?: number;
    matchThreshold?: number;
    matchedIntervals?: number;
    maxSpeed?: number;
    modeType?: string;
    plannedDistances?: Distances;
    polyline?: string;
    splitMinFastDurationThreshold?: number;
    splitSpeedThreshold?: number;
    splitStopTimeThreshold?: number;
    tripType?: string;
    validationOutcome?: string;
    validityThreshold?: number;
}

export class Interval{
    distance?: number;
    end?: number;
    endTime?: number;
    match?: number;
    start?: number;
    startTime?: number;
}
