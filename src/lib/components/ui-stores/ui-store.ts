import { writable } from "svelte/store";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

export const toggles = writable({
    editMode: true,
    paused: false,
    settings: false,
    credits: false,
});

export const starshipSettings = writable({
    rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET,
    rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET,
    
    bodyHeightScale: 1,

    forwardLHeightScale: 1,
    forwardLWidthScale: 1,
    forwardRHeightScale: 1,
    forwardRWidthScale: 1,
    aftLHeightScale: 1,
    aftLWidthScale: 1,
    aftRHeightScale: 1,
    aftRWidthScale: 1,

    rSeaRadius: StarshipConstants.R_SEA_RADIUS,
    numRSeas: StarshipConstants.NUM_R_SEAS,

    rVacRadius: StarshipConstants.R_VAC_RADIUS,
    numRVacs: StarshipConstants.NUM_R_VACS,
});

export const superHeavySettings = writable({
    gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET,
    chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET,
    
    rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1,
    rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2,
    rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3,

    hsrHeightScale: 1,
    bodyHeightScale: 1,
    chineHeightScale: 1,
    numChines: SuperHeavyConstants.NUM_CHINES,
    
    gridFinLengthScale: 1,
    gridFinWidthScale: 1,
    numGridFins: SuperHeavyConstants.NUM_GRID_FINS,

    rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1,
    numRSeas1: SuperHeavyConstants.NUM_R_SEAS_1,

    rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2,
    numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,

    rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3,
    numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
});

export const telemetry = writable({
    dt: 0,

    starshipAngle: 0,
    starshipSpeed: 0,
    starshipAltitude: 0,
    starshipLOX: 0,
    starshipCH4: 0,
    starshipDisabled: true,
    rSeaThrottles: [],
    rVacThrottles: [],

    superHeavyAngle: 0,
    superHeavySpeed: 0,
    superHeavyAltitude: 0,
    superHeavyLOX: 0,
    superHeavyCH4: 0,
    superHeavyDisabled: false,
    rSeaThrottles1: [],
    rSeaThrottles2: [],
    rSeaThrottles3: [],

    separated: false
});

export const gameSettings = writable({
    textureResolution: 1,
    volume: 1,
    muted: false,
});