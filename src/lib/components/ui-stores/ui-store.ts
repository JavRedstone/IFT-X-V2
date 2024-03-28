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
    numRVacs: StarshipConstants.NUM_R_VACS
});

export const superHeavySettings = writable({
    gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET,
    chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET,
    
    rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1,
    rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2,
    rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3,

    rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1,
    numRSeas1: SuperHeavyConstants.NUM_R_SEAS_1,
    rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2,
    numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
    rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3,
    numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
});

export const telemetry = writable({
    dt: 0,

    starshipRaptors: [],
    starshipAngle: 0,
    starshipSpeed: 0,
    starshipAltitude: 0,
    starshipLOX: 100,
    starshipCH4: 100,

    superHeavyRaptors: [],
    superHeavyAngle: 0,
    superHeavySpeed: 0,
    superHeavyAltitude: 0,
    superHeavyLOX: 100,
    superHeavyCH4: 100,
    separated: false
});

export const gameSettings = writable({
    textureResolution: 1,
    volume: 1,
    muted: false,
});