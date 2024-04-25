import { writable } from "svelte/store";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";
import { LaunchConstants } from "../constants/objects/LaunchConstants";

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
    doneFueling: false,
    isLaunching: false,
});

export const starshipSettings = writable({
    shipRingHeight: StarshipConstants.SHIP_RING_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y,

    forwardLHeightScale: 1,
    forwardLWidthScale: 1,
    forwardRHeightScale: 1,
    forwardRWidthScale: 1,
    aftLHeightScale: 1,
    aftLWidthScale: 1,
    aftRHeightScale: 1,
    aftRWidthScale: 1,

    rSeaRadius: StarshipConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x,
    numRSeas: StarshipConstants.NUM_R_SEAS,
    rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET * 180/Math.PI,
    rSeaType: StarshipConstants.R_SEA_TYPE,
    canRSeaGimbal: StarshipConstants.CAN_R_SEA_GIMBAL,

    rVacRadius: StarshipConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x,
    numRVacs: StarshipConstants.NUM_R_VACS,
    rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET * 180/Math.PI,
    rVacType: StarshipConstants.R_VAC_TYPE,
    canRVacGimbal: StarshipConstants.CAN_R_VAC_GIMBAL,
});

export const superHeavySettings = writable({    
    hsrHeight: SuperHeavyConstants.HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y,
    boosterRingHeight: SuperHeavyConstants.BOOSTER_RING_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y,
    
    numGridFins: SuperHeavyConstants.NUM_GRID_FINS,
    gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET * 180/Math.PI,
    gridFinLengthScale: 1,
    gridFinWidthScale: 1,

    numChines: SuperHeavyConstants.NUM_CHINES,
    chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET * 180/Math.PI,
    chineHeightScale: 1,
    
    rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1 * LaunchConstants.REAL_LIFE_SCALE.x,
    numRSeas1: SuperHeavyConstants.NUM_R_SEAS_1,
    rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1 * 180/Math.PI,
    rSeaType1: SuperHeavyConstants.R_SEA_TYPE_1,
    canRSea1Gimbal: SuperHeavyConstants.CAN_R_SEA_1_GIMBAL,

    rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2 * LaunchConstants.REAL_LIFE_SCALE.x,
    numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
    rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2 * 180/Math.PI,
    rSeaType2: SuperHeavyConstants.R_SEA_TYPE_2,
    canRSea2Gimbal: SuperHeavyConstants.CAN_R_SEA_2_GIMBAL,

    rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3 * LaunchConstants.REAL_LIFE_SCALE.x,
    numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
    rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3 * 180/Math.PI,
    rSeaType3: SuperHeavyConstants.R_SEA_TYPE_3,
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
    rSeaGimbalingAngles: [],
    rVacGimbalingAngles: [],
    rSeaGimbalYs: [],
    rVacGimbalYs: [],

    forwardLAngle: 0,
    forwardRAngle: 0,
    aftLAngle: 0,
    aftRAngle: 0,

    superHeavyAngle: 0,
    superHeavySpeed: 0,
    superHeavyAltitude: 0,
    superHeavyLOX: 0,
    superHeavyCH4: 0,
    superHeavyDisabled: false,

    rSeaThrottles1: [],
    rSeaThrottles2: [],
    rSeaThrottles3: [],
    rSeaGimbalingAngles1: [],
    rSeaGimbalingAngles2: [],
    rSeaGimbalingAngles3: [],
    rSeaGimbalYs1: [],
    rSeaGimbalYs2: [],
    rSeaGimbalYs3: [],

    separated: false,
    
    currBoosterEvent: 0,
    isBoosterEventEnabled: false,
    isBoosterEventClicked: false,
    currShipEvent: 0,
    isShipEventEnabled: false,
    isShipEventClicked: false,

    isFreeView: false,
    isCameraOnStarship: true,
});

export const keyPresses = writable({
    isWPressed: false,
    isAPressed: false,
    isSPressed: false,
    isDPressed: false,
    isQPressed: false,
    isEPressed: false,

    isIPressed: false,
    isKPressed: false,
    isJPressed: false,
    isLPressed: false,
    isUPressed: false,
    isOPressed: false,
});

export const gameSettings = writable({
    textureResolution: 1,
    volume: 1,
    muted: false,
    speedUp: 1,
});