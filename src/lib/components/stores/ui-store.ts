import { writable } from "svelte/store";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

export const uiSwitches = writable({
    paused: false,
    settings: false,
    credits: false,
});

export const toggles = writable({
    isEditing: true,
    isEditingStarship: false,
    isEditingSuperHeavy: false,
    isFueling: false,
    hasStartedFueling: false,
    isLaunching: false,
});

export const starshipSettings = writable({
    shipRingHeight: StarshipConstants.SHIP_RING_HEIGHT * StarshipConstants.REAL_LIFE_SCALE.y,

    forwardLHeightScale: 1,
    forwardLWidthScale: 1,
    forwardRHeightScale: 1,
    forwardRWidthScale: 1,
    aftLHeightScale: 1,
    aftLWidthScale: 1,
    aftRHeightScale: 1,
    aftRWidthScale: 1,

    rSeaRadius: StarshipConstants.R_SEA_RADIUS * SuperHeavyConstants.REAL_LIFE_SCALE.x,
    numRSeas: StarshipConstants.NUM_R_SEAS,
    rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET * 180/Math.PI,
    rSeaType: 2,
    canRSeaGimbal: StarshipConstants.CAN_R_SEA_GIMBAL,

    rVacRadius: StarshipConstants.R_VAC_RADIUS * SuperHeavyConstants.REAL_LIFE_SCALE.x,
    numRVacs: StarshipConstants.NUM_R_VACS,
    rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET * 180/Math.PI,
    rVacType: 2,
    canRVacGimbal: StarshipConstants.CAN_R_VAC_GIMBAL,
});

export const superHeavySettings = writable({    
    hsrHeight: SuperHeavyConstants.HSR_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y,
    boosterRingHeight: SuperHeavyConstants.BOOSTER_RING_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y,
    
    numGridFins: SuperHeavyConstants.NUM_GRID_FINS,
    gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET * 180/Math.PI,
    gridFinLengthScale: 1,
    gridFinWidthScale: 1,

    numChines: SuperHeavyConstants.NUM_CHINES,
    chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET * 180/Math.PI,
    chineHeightScale: 1,
    
    rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1 * SuperHeavyConstants.REAL_LIFE_SCALE.x,
    numRSeas1: SuperHeavyConstants.NUM_R_SEAS_1,
    rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1 * 180/Math.PI,
    rSeaType1: 2,
    canRSea1Gimbal: SuperHeavyConstants.CAN_R_SEA_1_GIMBAL,

    rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2 * SuperHeavyConstants.REAL_LIFE_SCALE.x,
    numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
    rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2 * 180/Math.PI,
    rSeaType2: 2,
    canRSea2Gimbal: SuperHeavyConstants.CAN_R_SEA_2_GIMBAL,

    rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3 * SuperHeavyConstants.REAL_LIFE_SCALE.x,
    numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
    rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3 * 180/Math.PI,
    rSeaType3: 2,
    canRSea3Gimbal: SuperHeavyConstants.CAN_R_SEA_3_GIMBAL,
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
    rSeaGimbalRadii: [],
    rVacGimbalRadii: [],
    rSeaGimbalAngles: [],
    rVacGimbalAngles: [],

    superHeavyAngle: 0,
    superHeavySpeed: 0,
    superHeavyAltitude: 0,
    superHeavyLOX: 0,
    superHeavyCH4: 0,
    superHeavyDisabled: false,
    rSeaThrottles1: [],
    rSeaThrottles2: [],
    rSeaThrottles3: [],
    rSeaGimbalRadii1: [],
    rSeaGimbalRadii2: [],
    rSeaGimbalRadii3: [],
    rSeaGimbalAngles1: [],
    rSeaGimbalAngles2: [],
    rSeaGimbalAngles3: [],

    separated: false
});

export const gameSettings = writable({
    textureResolution: 1,
    volume: 1,
    muted: false,
});