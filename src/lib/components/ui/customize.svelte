<script lang="ts">
	import { StringHelper } from './../helpers/StringHelper';
    import { onMount } from "svelte";
    import { Vector2, type Vector3 } from "three";
    import { RaptorUI } from "../structs/ui/RaptorUI";
    import { starshipSettings, superHeavySettings, telemetry, toggles } from "../stores/ui-store";
    import { MathHelper } from "../helpers/MathHelper";
    import s25 from "../images/s25.png";
    import s25ss from "../images/s25ss.png";
    import b9 from "../images/b9.png";
    import b9sh from "../images/b9sh.png";
    import s25b9 from "../images/s25b9.png";
    import s25b9sssh from "../images/s25b9sssh.png";
    import s25b9ss from "../images/s25b9ss.png"
    import s25b9sh from "../images/s25b9sh.png"
    import { StarshipConstants } from '../constants/objects/StarshipConstants';
    import { SuperHeavyConstants } from '../constants/objects/SuperHeavyConstants';
    import { RaptorConstants } from '../constants/controls/RaptorConstants';
    import { LaunchConstants } from '../constants/objects/LaunchConstants';
    import { LaunchHelper } from '../helpers/LaunchHelper';
    import { PhysicsConstants } from '../constants/PhysicsConstants';
  import Keybinds from './keybinds.svelte';

    let starshipRaptors: RaptorUI[] = [];
    let superHeavyRaptors: RaptorUI[] = [];
    
    let stackHeight: number = 0;
    let boosterHeight: number = 0;
    let shipHeight: number = 0;
    
    let stackTWR: string = '0';
    let boosterTWR: string = '0';
    let shipTWR: string = '0';
    
    let starshipValidated: boolean = true;
    let superHeavyValidated: boolean = true;

    const sizeMult = 66;
    const topOffset = 70;
    const rightOffsetSH = 28;
    const rightOffsetSS = 180;
    const rSeaRadius = sizeMult * RaptorConstants.R_SEA_RADIUS;
    const rVacRadius = sizeMult * RaptorConstants.R_VAC_RADIUS;
    const border = 1.275;
    const rSeaFakeRadius = rSeaRadius - border;
    const rVacFakeRadius = rVacRadius - border;
    const defaultThrottle = 1;

    let isEditing: boolean = false;
    let isEditingStarship: boolean = false;
    let isEditingSuperHeavy: boolean = false;

    let telemetryValues: any = {
        rSeaGimbalingAngles: [],
        rVacGimbalingAngles: [],
        rSeaGimbalYs: [],
        rVacGimbalYs: [],
        
        rSeaGimbalingAngles1: [],
        rSeaGimbalingAngles2: [],
        rSeaGimbalingAngles3: [],
        rSeaGimbalYs1: [],
        rSeaGimbalYs2: [],
        rSeaGimbalYs3: [],
    };
    let starshipOptions: any = {
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
        rSeaType: 2,
        canRSeaGimbal: StarshipConstants.CAN_R_SEA_GIMBAL,

        rVacRadius: StarshipConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x,
        numRVacs: StarshipConstants.NUM_R_VACS,
        rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET * 180/Math.PI,
        rVacType: 2,
        canRVacGimbal: StarshipConstants.CAN_R_VAC_GIMBAL,
    };
    let validatedStarship: any = {
        shipRingHeight: true,

        forwardLHeightScale: true,
        forwardLWidthScale: true,
        forwardRHeightScale: true,
        forwardRWidthScale: true,
        aftLHeightScale: true,
        aftLWidthScale: true,
        aftRHeightScale: true,
        aftRWidthScale: true,

        rSeaRadius: true,
        numRSeas: true,
        rSeaAngularOffset: true,
        rSeaType: true,

        rVacRadius: true,
        numRVacs: true,
        rVacAngularOffset: true,
        rVacType: true,
    }
    let superHeavyOptions: any = {
        hasHsr: true,
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
        rSeaType1: 2,
        canRSea1Gimbal: SuperHeavyConstants.CAN_R_SEA_1_GIMBAL,

        rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2 * LaunchConstants.REAL_LIFE_SCALE.x,
        numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
        rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2 * 180/Math.PI,
        rSeaType2: 2,
        canRSea2Gimbal: SuperHeavyConstants.CAN_R_SEA_2_GIMBAL,

        rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3 * LaunchConstants.REAL_LIFE_SCALE.x,
        numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
        rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3 * 180/Math.PI,
        rSeaType3: 2,
        canRSea3Gimbal: SuperHeavyConstants.CAN_R_SEA_3_GIMBAL,
    };
    let validatedSuperHeavy: any = {
        hsrHeight: true,
        boosterRingHeight: true,

        numGridFins: true,
        gridFinAngularOffset: true,
        gridFinLengthScale: true,
        gridFinWidthScale: true,

        numChines: true,
        chineAngularOffset: true,
        chineHeightScale: true,

        numRSeas1: true,
        rSeaRadius1: true,
        rSeaAngularOffset1: true,
        rSeaType1: true,
        canRSea1Gimbal: true,

        numRSeas2: true,
        rSeaRadius2: true,
        rSeaAngularOffset2: true,
        rSeaType2: true,
        canRSea2Gimbal: true,

        numRSeas3: true,
        rSeaRadius3: true,
        rSeaAngularOffset3: true,
        rSeaType3: true,
        canRSea3Gimbal: true,
    }

    function setupUpdator() {
        toggles.subscribe((value) => {
            isEditing = value.isEditing;
            isEditingStarship = value.isEditingStarship;
            isEditingSuperHeavy = value.isEditingSuperHeavy;
        });
        telemetry.subscribe((value) => {
            telemetryValues.rSeaGimbalingAngles = value.rSeaGimbalingAngles;
            telemetryValues.rVacGimbalingAngles = value.rVacGimbalingAngles;
            telemetryValues.rSeaGimbalYs = value.rSeaGimbalYs;
            telemetryValues.rVacGimbalYs = value.rVacGimbalYs;
            
            telemetryValues.rSeaGimbalingAngles1 = value.rSeaGimbalingAngles1;
            telemetryValues.rSeaGimbalingAngles2 = value.rSeaGimbalingAngles2;
            telemetryValues.rSeaGimbalingAngles3 = value.rSeaGimbalingAngles3;
            telemetryValues.rSeaGimbalYs1 = value.rSeaGimbalYs1;
            telemetryValues.rSeaGimbalYs2 = value.rSeaGimbalYs2;
            telemetryValues.rSeaGimbalYs3 = value.rSeaGimbalYs3;
            
            updateGimbals();
        });
        starshipSettings.subscribe((value) => {
            starshipOptions.rSeaAngularOffset = value.rSeaAngularOffset;
            starshipOptions.rVacAngularOffset = value.rVacAngularOffset;

            starshipOptions.shipRingHeight = value.shipRingHeight;
            
            starshipOptions.forwardLHeightScale = value.forwardLHeightScale;
            starshipOptions.forwardLWidthScale = value.forwardLWidthScale;
            starshipOptions.forwardRHeightScale = value.forwardRHeightScale;
            starshipOptions.forwardRWidthScale = value.forwardRWidthScale;
            starshipOptions.aftLHeightScale = value.aftLHeightScale;
            starshipOptions.aftLWidthScale = value.aftLWidthScale;
            starshipOptions.aftRHeightScale = value.aftRHeightScale;
            starshipOptions.aftRWidthScale = value.aftRWidthScale;

            starshipOptions.rSeaRadius = value.rSeaRadius;
            starshipOptions.numRSeas = value.numRSeas;
            starshipOptions.rSeaType = value.rSeaType;
            starshipOptions.canRSeaGimbal = value.canRSeaGimbal;

            starshipOptions.rVacRadius = value.rVacRadius;
            starshipOptions.numRVacs = value.numRVacs;
            starshipOptions.rVacType = value.rVacType;
            starshipOptions.canRVacGimbal = value.canRVacGimbal;
            
            updateDisplay();
            starshipRaptors = [];
            setTimeout(() => {
                createStarshipRaptors();
            }, 0);
        });
        superHeavySettings.subscribe((value) => {
            superHeavyOptions.gridFinAngularOffset = value.gridFinAngularOffset;
            superHeavyOptions.chineAngularOffset = value.chineAngularOffset;

            superHeavyOptions.rSeaAngularOffset1 = value.rSeaAngularOffset1;
            superHeavyOptions.rSeaAngularOffset2 = value.rSeaAngularOffset2;
            superHeavyOptions.rSeaAngularOffset3 = value.rSeaAngularOffset3;

            superHeavyOptions.hasHsr = value.hsrHeight > 0;
            superHeavyOptions.hsrHeight = value.hsrHeight;
            superHeavyOptions.boosterRingHeight = value.boosterRingHeight;
            superHeavyOptions.chineHeightScale = value.chineHeightScale;
            superHeavyOptions.numChines = value.numChines;

            superHeavyOptions.gridFinLengthScale = value.gridFinLengthScale;
            superHeavyOptions.gridFinWidthScale = value.gridFinWidthScale;
            superHeavyOptions.numGridFins = value.numGridFins;

            superHeavyOptions.rSeaRadius1 = value.rSeaRadius1;
            superHeavyOptions.numRSeas1 = value.numRSeas1;
            superHeavyOptions.rSeaType1 = value.rSeaType1;
            superHeavyOptions.canRSea1Gimbal = value.canRSea1Gimbal;

            superHeavyOptions.rSeaRadius2 = value.rSeaRadius2;
            superHeavyOptions.numRSeas2 = value.numRSeas2;
            superHeavyOptions.rSeaType2 = value.rSeaType2;
            superHeavyOptions.canRSea2Gimbal = value.canRSea2Gimbal;

            superHeavyOptions.rSeaRadius3 = value.rSeaRadius3;
            superHeavyOptions.numRSeas3 = value.numRSeas3;
            superHeavyOptions.rSeaType3 = value.rSeaType3;
            superHeavyOptions.canRSea3Gimbal = value.canRSea3Gimbal;
            
            updateDisplay();
            superHeavyRaptors = [];
            setTimeout(() => {
                createSuperHeavyRaptors();
            }, 0);
        });
    }

    function updateDisplay(): void {
        estimateHeight();
        estimateTWR();
    }

    function updateGimbals(): void {
        for (let i = 0; i < starshipRaptors.length; i++) {
            starshipRaptors[i].position = starshipRaptors[i].originalPosition.clone();
        }
        for (let i = 0; i < superHeavyRaptors.length; i++) {
            superHeavyRaptors[i].position = superHeavyRaptors[i].originalPosition.clone();
        }

        if (telemetryValues.rSeaGimbalingAngles.length == starshipOptions.numRSeas && telemetryValues.rSeaGimbalYs.length  == starshipOptions.numRSeas) {
            for (let i = 0; i < starshipOptions.numRSeas; i++) {
                if (starshipRaptors[i] != undefined && starshipRaptors[i].isValidated) {
                    starshipRaptors[i].updateGimbal(telemetryValues.rSeaGimbalingAngles[i], telemetryValues.rSeaGimbalYs[i], sizeMult, false);
                }
            }
        }
        if (telemetryValues.rVacGimbalingAngles.length == starshipOptions.numRVacs && telemetryValues.rVacGimbalYs.length == starshipOptions.numRVacs) {
            for (let i = 0; i < starshipOptions.numRVacs; i++) {
                if (starshipRaptors[i + starshipOptions.numRSeas] != undefined && starshipRaptors[i + starshipOptions.numRSeas].isValidated) {
                    starshipRaptors[i + starshipOptions.numRSeas].updateGimbal(telemetryValues.rVacGimbalingAngles[i], telemetryValues.rVacGimbalYs[i], sizeMult, false);
                }
            }
        }

        if (telemetryValues.rSeaGimbalingAngles1.length == superHeavyOptions.numRSeas1 && telemetryValues.rSeaGimbalYs1.length == superHeavyOptions.numRSeas1) {
            for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
                if (superHeavyRaptors[i] != undefined && superHeavyRaptors[i].isValidated) {
                    superHeavyRaptors[i].updateGimbal(telemetryValues.rSeaGimbalingAngles1[i], telemetryValues.rSeaGimbalYs1[i], sizeMult, false);
                }
            }
        }
        if (telemetryValues.rSeaGimbalingAngles2.length == superHeavyOptions.numRSeas2 && telemetryValues.rSeaGimbalYs2.length == superHeavyOptions.numRSeas2) {
            for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
                if (superHeavyRaptors[i + superHeavyOptions.numRSeas1] != undefined && superHeavyRaptors[i + superHeavyOptions.numRSeas1].isValidated) {
                    superHeavyRaptors[i + superHeavyOptions.numRSeas1].updateGimbal(telemetryValues.rSeaGimbalingAngles2[i], telemetryValues.rSeaGimbalYs2[i], sizeMult, false);
                }
            }
        }
        if (telemetryValues.rSeaGimbalingAngles3.length == superHeavyOptions.numRSeas3 && telemetryValues.rSeaGimbalYs3.length == superHeavyOptions.numRSeas3) {
            for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
                if (superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2] != undefined && superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2].isValidated) {
                    superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2].updateGimbal(telemetryValues.rSeaGimbalingAngles3[i], telemetryValues.rSeaGimbalYs3[i], sizeMult, false);
                }
            }
        }

        starshipRaptors = starshipRaptors;
        superHeavyRaptors = superHeavyRaptors;
    }

    function estimateHeight(): void {
        shipHeight = Math.round(starshipOptions.shipRingHeight * StarshipConstants.SHIP_RING_SCALE.y + StarshipConstants.NOSECONE_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y);
        boosterHeight = Math.round(superHeavyOptions.boosterRingHeight * SuperHeavyConstants.BOOSTER_RING_SCALE.y + superHeavyOptions.hsrHeight * SuperHeavyConstants.HSR_SCALE.y);
        stackHeight = Math.round(shipHeight + boosterHeight);
    }

    function estimateTWR() {
        let shipUseableHeight: number = starshipOptions.shipRingHeight - (StarshipConstants.LOX_BOTTOM_FIXED + StarshipConstants.CH4_TOP_FIXED + StarshipConstants.LOX_CH4_GAP_FIXED) * LaunchConstants.REAL_LIFE_SCALE.y;

        let shipLOXMass: number = LaunchHelper.getFuelMass(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, shipUseableHeight * StarshipConstants.LOX_PERCENTAGE, LaunchConstants.LOX_DENSITY);

        let shipCH4Mass: number = LaunchHelper.getFuelMass(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, shipUseableHeight * StarshipConstants.CH4_PERCENTAGE, LaunchConstants.CH4_DENSITY);

        // these dry masses are for the real life scaled
        let shipDryMass: number = StarshipConstants.NOSECONE_DRY_MASS + StarshipConstants.SHIP_RING_DRY_MASS * starshipOptions.shipRingHeight / LaunchConstants.REAL_LIFE_SCALE.y + StarshipConstants.FORWARD_L_DRY_MASS * starshipOptions.forwardLHeightScale * starshipOptions.forwardLWidthScale + StarshipConstants.FORWARD_R_DRY_MASS * starshipOptions.forwardRHeightScale * starshipOptions.forwardRWidthScale + StarshipConstants.AFT_L_DRY_MASS * starshipOptions.aftLHeightScale * starshipOptions.aftLWidthScale + StarshipConstants.AFT_R_DRY_MASS * starshipOptions.aftRHeightScale * starshipOptions.aftRWidthScale + starshipRaptors.length * RaptorConstants.DRY_MASS;

        let shipWetMass: number = shipLOXMass + shipCH4Mass + shipDryMass;

        let shipThrust: number = starshipOptions.numRSeas * LaunchHelper.getThrust(true, starshipOptions.rSeaType) + starshipOptions.numRVacs * LaunchHelper.getThrust(false, starshipOptions.rVacType);

        let boosterUseableHeight: number = superHeavyOptions.boosterRingHeight - (SuperHeavyConstants.LOX_BOTTOM_FIXED + SuperHeavyConstants.CH4_TOP_FIXED + SuperHeavyConstants.LOX_CH4_GAP_FIXED) * LaunchConstants.REAL_LIFE_SCALE.y;

        let boosterLOXMass: number = LaunchHelper.getFuelMass(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, boosterUseableHeight * SuperHeavyConstants.LOX_PERCENTAGE, LaunchConstants.LOX_DENSITY);
        let boosterCH4Mass: number = LaunchHelper.getFuelMass(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, boosterUseableHeight * SuperHeavyConstants.CH4_PERCENTAGE, LaunchConstants.CH4_DENSITY);
        let boosterDryMass: number = SuperHeavyConstants.HSR_DRY_MASS / (SuperHeavyConstants.HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y) * superHeavyOptions.hsrHeight + SuperHeavyConstants.BOOSTER_RING_DRY_MASS * superHeavyOptions.boosterRingHeight / LaunchConstants.REAL_LIFE_SCALE.y + SuperHeavyConstants.GRID_FIN_DRY_MASS * superHeavyOptions.numGridFins * superHeavyOptions.gridFinLengthScale * superHeavyOptions.gridFinWidthScale + SuperHeavyConstants.CHINE_DRY_MASS * superHeavyOptions.numChines * superHeavyOptions.chineHeightScale + superHeavyRaptors.length * RaptorConstants.DRY_MASS;
        let boosterWetMass: number = boosterLOXMass + boosterCH4Mass + boosterDryMass;

        let boosterThrust: number = superHeavyOptions.numRSeas1 * LaunchHelper.getThrust(true, superHeavyOptions.rSeaType1) + superHeavyOptions.numRSeas2 * LaunchHelper.getThrust(true, superHeavyOptions.rSeaType2) + superHeavyOptions.numRSeas3 * LaunchHelper.getThrust(true, superHeavyOptions.rSeaType3);
        
        shipTWR = StringHelper.formatNumber(LaunchHelper.getTWR(shipThrust, shipWetMass, LaunchHelper.getGEarth(0)), 2);
        boosterTWR = StringHelper.formatNumber(LaunchHelper.getTWR(boosterThrust, boosterWetMass, LaunchHelper.getGEarth(0)), 2);
        stackTWR = StringHelper.formatNumber(LaunchHelper.getTWR(boosterThrust, shipWetMass + boosterWetMass, LaunchHelper.getGEarth(0)), 2);
    }

    function createStarshipRaptors() {
        let rSeaPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRSeas, starshipOptions.rSeaRadius / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rSeaAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(true, starshipOptions.rSeaType, defaultThrottle, new Vector2(sizeMult - rSeaPositions[i].z - rSeaRadius, rSeaPositions[i].x + sizeMult - rSeaRadius), validatedStarship.rSeaRadius && validatedStarship.rSeaAngularOffset && validatedStarship.rSeaType && validatedStarship.numRSeas)];
        }
        let rVacPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRVacs, starshipOptions.rVacRadius / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rVacAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(false, starshipOptions.rVacType, defaultThrottle, new Vector2(sizeMult - rVacPositions[i].z - rVacRadius, rVacPositions[i].x + sizeMult - rVacRadius), validatedStarship.rVacRadius && validatedStarship.rVacAngularOffset && validatedStarship.rVacType && validatedStarship.numRVacs)];
        }
    }

    function createSuperHeavyRaptors() {
        let rSeaPositions1: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas1, superHeavyOptions.rSeaRadius1 / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset1 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType1, defaultThrottle, new Vector2(sizeMult - rSeaRadius - rSeaPositions1[i].z, rSeaPositions1[i].x + sizeMult - rSeaRadius), validatedSuperHeavy.rSeaRadius1 && validatedSuperHeavy.rSeaAngularOffset1 && validatedSuperHeavy.rSeaType1 && validatedSuperHeavy.numRSeas1)];
        }
        let rSeaPositions2: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas2, superHeavyOptions.rSeaRadius2 / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset2 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType2, defaultThrottle, new Vector2(sizeMult - rSeaRadius - rSeaPositions2[i].z, rSeaPositions2[i].x + sizeMult - rSeaRadius), validatedSuperHeavy.rSeaRadius2 && validatedSuperHeavy.rSeaAngularOffset2 && validatedSuperHeavy.rSeaType2 && validatedSuperHeavy.numRSeas2)];
        }
        let rSeaPositions3: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas3, superHeavyOptions.rSeaRadius3 / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset3 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType3, defaultThrottle, new Vector2(sizeMult - rSeaRadius - rSeaPositions3[i].z, rSeaPositions3[i].x + sizeMult - rSeaRadius), validatedSuperHeavy.rSeaRadius3 && validatedSuperHeavy.rSeaAngularOffset3 && validatedSuperHeavy.rSeaType3 && validatedSuperHeavy.numRSeas3)];
        }
    }

    function convertToCustomize(str: string): string {
        str = StringHelper.makeCapitalizedSpaced(str);
        str = str.replace('Num', 'Number Of');
        str = str.replace('R Sea', 'Raptor Sea Level');
        str = str.replace('R Vac', 'Raptor Vacuum');
        str = str.replace('1', 'Inner');
        str = str.replace('2', 'Middle');
        str = str.replace('3', 'Outer');
        str = str.replace('Aft L', 'Aft Left Flap');
        str = str.replace('Aft R', 'Aft Right Flap');
        str = str.replace('Forward L', 'Forward Left Flap');
        str = str.replace('Forward R', 'Forward Right Flap');
        str = str.replace('Hsr', 'Hot Staging Ring');
        return str;
    }

    function validate(): void {
        validateStarship();
        validateSuperHeavy();
    }

    function reset(): void {
        resetStarship();
        resetSuperHeavy();
    }

    function validateStarship(): void {
        starshipValidated = true;
        if (starshipOptions.shipRingHeight < StarshipConstants.MIN_SHIP_RING_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y || starshipOptions.shipRingHeight > StarshipConstants.MAX_SHIP_RING_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y) {
            validatedStarship.shipRingHeight = false;
            starshipValidated = false;
        } else {
            validatedStarship.shipRingHeight = true;
        }

        if (starshipOptions.forwardLHeightScale < 0 || starshipOptions.forwardLHeightScale > StarshipConstants.FORWARD_L_MAX_HEIGHT_SCALE) {
            validatedStarship.forwardLHeightScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.forwardLHeightScale = true;
        }
        if (starshipOptions.forwardLWidthScale < StarshipConstants.FORWARD_L_MIN_WIDTH_SCALE || starshipOptions.forwardLWidthScale > StarshipConstants.FORWARD_L_MAX_WIDTH_SCALE) {
            validatedStarship.forwardLWidthScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.forwardLWidthScale = true;
        }
        if (starshipOptions.forwardRHeightScale < 0 || starshipOptions.forwardRHeightScale > StarshipConstants.FORWARD_R_MAX_HEIGHT_SCALE) {
            validatedStarship.forwardRHeightScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.forwardRHeightScale = true;
        }
        if (starshipOptions.forwardRWidthScale < StarshipConstants.FORWARD_R_MIN_WIDTH_SCALE || starshipOptions.forwardRWidthScale > StarshipConstants.FORWARD_R_MAX_WIDTH_SCALE) {
            validatedStarship.forwardRWidthScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.forwardRWidthScale = true;
        }
        if (starshipOptions.aftLHeightScale < 0 * starshipOptions.shipRingHeight || starshipOptions.aftLHeightScale > StarshipConstants.AFT_L_MAX_HEIGHT_PERC * starshipOptions.shipRingHeight) {
            validatedStarship.aftLHeightScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.aftLHeightScale = true;
        }
        if (starshipOptions.aftLWidthScale < StarshipConstants.AFT_L_MIN_WIDTH_SCALE || starshipOptions.aftLWidthScale > StarshipConstants.AFT_L_MAX_WIDTH_SCALE) {
            validatedStarship.aftLWidthScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.aftLWidthScale = true;
        }
        if (starshipOptions.aftRHeightScale < 0 * starshipOptions.shipRingHeight || starshipOptions.aftRHeightScale > StarshipConstants.AFT_R_MAX_HEIGHT_PERC * starshipOptions.shipRingHeight) {
            validatedStarship.aftRHeightScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.aftRHeightScale = true;
        }
        if (starshipOptions.aftRWidthScale < StarshipConstants.AFT_R_MIN_WIDTH_SCALE || starshipOptions.aftRWidthScale > StarshipConstants.AFT_R_MAX_WIDTH_SCALE) {
            validatedStarship.aftRWidthScale = false;
            starshipValidated = false;
        } else {
            validatedStarship.aftRWidthScale = true;
        }

        if (starshipOptions.rSeaRadius < 0 || (starshipOptions.numRSeas > 1 && starshipOptions.rSeaRadius < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC)) {
            validatedStarship.rSeaRadius = false;
            starshipValidated = false;
        } else {
            let outerRadius: number = 0;
            if (starshipOptions.canRSeaGimbal) {
                if (starshipOptions.numRVacs > 0) {
                    if (starshipOptions.canRVacGimbal) {
                        outerRadius = starshipOptions.rVacRadius - RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        outerRadius = starshipOptions.rVacRadius - RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                    }
                }
                else {
                    outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                }
            }
            else {
                if (starshipOptions.numRVacs > 0) {
                    if (starshipOptions.canRVacGimbal) {
                        outerRadius = starshipOptions.rVacRadius - RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_VAC_GIMBAL_SPACE_PERC - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        outerRadius = starshipOptions.rVacRadius - RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                }
                else {
                    outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                }
            }
            if (starshipOptions.rSeaRadius > outerRadius) {
                validatedStarship.rSeaRadius = false;
                starshipValidated = false;
            } else {
                validatedStarship.rSeaRadius = true;
            }
        }

        if (starshipOptions.numRSeas < 0 || (starshipOptions.numRSeas > 1 && (starshipOptions.numRSeas > MathHelper.getMaxCirclesAroundCircle(starshipOptions.rSeaRadius, RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC) || starshipOptions.rSeaRadius < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC))) {
            validatedStarship.numRSeas = false;
            starshipValidated = false;
        } else {
            validatedStarship.numRSeas = true;
        }

        if (starshipOptions.rSeaAngularOffset < 0 || starshipOptions.rSeaAngularOffset >= 360) {
            validatedStarship.rSeaAngularOffset = false;
            starshipValidated = false;
        } else {
            validatedStarship.rSeaAngularOffset = true;
        }

        if (Math.round(starshipOptions.rSeaType) != starshipOptions.rSeaType || starshipOptions.rSeaType < 0 || starshipOptions.rSeaType > 3) {
            validatedStarship.rSeaType = false;
            starshipValidated = false;
        } else {
            validatedStarship.rSeaType = true;
        }

        if (starshipOptions.rVacRadius < 0 || (starshipOptions.numRVacs > 1 && starshipOptions.rVacRadius < RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC)) {
            validatedStarship.rVacRadius = false;
            starshipValidated = false;
        } else {
            let outerRadius: number = 0;
            let innerRadius: number = 0;
            if (starshipOptions.canRVacGimbal) {
                outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_VAC_GIMBAL_SPACE_PERC;
                if (starshipOptions.numRSeas > 0) {
                    if (starshipOptions.canRSeaGimbal) {
                        innerRadius = starshipOptions.rSeaRadius + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        innerRadius = starshipOptions.rSeaRadius + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_VAC_GIMBAL_SPACE_PERC;
                    }
                }
                else {
                    innerRadius = 0; // technically it is not, but the above if statement already covers it
                }
            }
            else {
                outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                if (starshipOptions.numRSeas > 0) {
                    if (starshipOptions.canRSeaGimbal) {
                        innerRadius = starshipOptions.rSeaRadius + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC + RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        innerRadius = starshipOptions.rSeaRadius + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                }
                else {
                    innerRadius = 0; // technically it is not, but the above if statement already covers it                    
                }
            }
            if (starshipOptions.rVacRadius > outerRadius || starshipOptions.rVacRadius < innerRadius) {
                validatedStarship.rVacRadius = false;
                starshipValidated = false;
            } else {
                validatedStarship.rVacRadius = true;
            }
        }

        if (starshipOptions.numRVacs < 0 || (starshipOptions.numRVacs > 1 && (starshipOptions.numRVacs > MathHelper.getMaxCirclesAroundCircle(starshipOptions.rVacRadius, RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC) || starshipOptions.rVacRadius < RaptorConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC))) {
            validatedStarship.numRVacs = false;
            starshipValidated = false;
        } else {
            validatedStarship.numRVacs = true;
        }

        if (starshipOptions.rVacAngularOffset < 0 || starshipOptions.rVacAngularOffset >= 360) {
            validatedStarship.rVacAngularOffset = false;
            starshipValidated = false;
        } else {
            validatedStarship.rVacAngularOffset = true;
        }

        if (Math.round(starshipOptions.rVacType) != starshipOptions.rVacType || starshipOptions.rVacType < 0 || starshipOptions.rVacType > 3) {
            validatedStarship.rVacType = false;
            starshipValidated = false;
        } else {
            validatedStarship.rVacType = true;
        }

        if (starshipValidated) {
            starshipSettings.update((value) => {
                value.rSeaAngularOffset = starshipOptions.rSeaAngularOffset;
                value.rVacAngularOffset = starshipOptions.rVacAngularOffset;

                value.shipRingHeight = starshipOptions.shipRingHeight;
                
                value.forwardLHeightScale = starshipOptions.forwardLHeightScale;
                value.forwardLWidthScale = starshipOptions.forwardLWidthScale;
                value.forwardRHeightScale = starshipOptions.forwardRHeightScale;
                value.forwardRWidthScale = starshipOptions.forwardRWidthScale;
                value.aftLHeightScale = starshipOptions.aftLHeightScale;
                value.aftLWidthScale = starshipOptions.aftLWidthScale;
                value.aftRHeightScale = starshipOptions.aftRHeightScale;
                value.aftRWidthScale = starshipOptions.aftRWidthScale;

                value.rSeaRadius = starshipOptions.rSeaRadius;
                value.numRSeas = starshipOptions.numRSeas;
                value.rSeaType = starshipOptions.rSeaType;
                value.canRSeaGimbal = starshipOptions.canRSeaGimbal;

                value.rVacRadius = starshipOptions.rVacRadius;
                value.numRVacs = starshipOptions.numRVacs;
                value.rVacType = starshipOptions.rVacType;
                value.canRVacGimbal = starshipOptions.canRVacGimbal;
                
                return value;
            });
        }
        else {
            updateDisplay();
            starshipRaptors = [];
            setTimeout(() => {
                createStarshipRaptors();
            }, 0);
        }
    }

    function resetStarship(): void {
        starshipOptions = {
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
            rSeaType: 2,
            canRSeaGimbal: StarshipConstants.CAN_R_SEA_GIMBAL,

            rVacRadius: StarshipConstants.R_VAC_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x,
            numRVacs: StarshipConstants.NUM_R_VACS,
            rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET * 180/Math.PI,
            rVacType: 2,
            canRVacGimbal: StarshipConstants.CAN_R_VAC_GIMBAL,
        };
        validateStarship();
    }

    function validateSuperHeavy(): void {
        superHeavyValidated = true;

        if (superHeavyOptions.hsrHeight < 0 || superHeavyOptions.hsrHeight > SuperHeavyConstants.MAX_HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y) {
            validatedSuperHeavy.hsrHeight = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.hsrHeight = true;
        }

        if (superHeavyOptions.boosterRingHeight < SuperHeavyConstants.MIN_BOOSTER_RING_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y || superHeavyOptions.boosterRingHeight > SuperHeavyConstants.MAX_BOOSTER_RING_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y) {
            validatedSuperHeavy.boosterRingHeight = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.boosterRingHeight = true;
        }

        if (superHeavyOptions.numGridFins < 0 || Math.round(superHeavyOptions.numGridFins) != superHeavyOptions.numGridFins || superHeavyOptions.numGridFins > MathHelper.getMaxCirclesAroundCircle(SuperHeavyConstants.GRID_FIN_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x, superHeavyOptions.gridFinWidthScale * LaunchConstants.REAL_LIFE_SCALE.x * SuperHeavyConstants.GRID_FIN_WIDTH_PERC)) {
            validatedSuperHeavy.numGridFins = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.numGridFins = true;
        }

        if (superHeavyOptions.gridFinAngularOffset < 0 || superHeavyOptions.gridFinAngularOffset >= 360) {
            validatedSuperHeavy.gridFinAngularOffset = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.gridFinAngularOffset = true;
        }

        if (superHeavyOptions.gridFinLengthScale < 0 || superHeavyOptions.gridFinLengthScale > SuperHeavyConstants.GRID_FIN_MAX_LENGTH_SCALE) {
            validatedSuperHeavy.gridFinLengthScale = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.gridFinLengthScale = true;
        }

        if (superHeavyOptions.gridFinWidthScale < 0 || superHeavyOptions.gridFinWidthScale > SuperHeavyConstants.GRID_FIN_MAX_WIDTH_SCALE) {
            validatedSuperHeavy.gridFinWidthScale = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.gridFinWidthScale = true;
        }

        if (superHeavyOptions.numChines < 0 || Math.round(superHeavyOptions.numChines) != superHeavyOptions.numChines || superHeavyOptions.numChines > MathHelper.getMaxCirclesAroundCircle(SuperHeavyConstants.CHINE_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x, LaunchConstants.REAL_LIFE_SCALE.x * SuperHeavyConstants.CHINE_WIDTH_PERC)) {
            validatedSuperHeavy.numChines = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.numChines = true;
        }

        if (superHeavyOptions.chineAngularOffset < 0 || superHeavyOptions.chineAngularOffset >= 360) {
            validatedSuperHeavy.chineAngularOffset = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.chineAngularOffset = true;
        }

        if (superHeavyOptions.chineHeightScale < 0 || superHeavyOptions.chineHeightScale > Math.min(SuperHeavyConstants.CHINE_MAX_HEIGHT_SCALE, SuperHeavyConstants.CHINE_MAX_HEIGHT_PERC * superHeavyOptions.boosterRingHeight)) {
            validatedSuperHeavy.chineHeightScale = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.chineHeightScale = true;
        }

        if (superHeavyOptions.rSeaRadius1 < 0 || (superHeavyOptions.numRSeas1 > 1 && superHeavyOptions.rSeaRadius1 < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC)) {
            validatedSuperHeavy.rSeaRadius1 = false;
            superHeavyValidated = false;
        } else {
            let outerRadius: number = 0;
            if (superHeavyOptions.canRSea1Gimbal) {
                if (superHeavyOptions.numRSeas2 > 0) {
                    if (superHeavyOptions.canRSea2Gimbal) {
                        outerRadius = superHeavyOptions.rSeaRadius2 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        outerRadius = superHeavyOptions.rSeaRadius2 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                    }
                }
                else {
                    outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                }
            }
            else {
                if (superHeavyOptions.numRSeas2 > 0) {
                    if (superHeavyOptions.canRSea2Gimbal) {
                        outerRadius = superHeavyOptions.rSeaRadius2 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        outerRadius = superHeavyOptions.rSeaRadius2 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                }
                else {
                    outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                }
            }
            if (superHeavyOptions.rSeaRadius1 > outerRadius) {
                validatedSuperHeavy.rSeaRadius1 = false;
                superHeavyValidated = false;
            } else {
                validatedSuperHeavy.rSeaRadius1 = true;
            }
        }

        if (superHeavyOptions.numRSeas1 < 0 || (superHeavyOptions.numRSeas1 > 1 && (superHeavyOptions.numRSeas1 > MathHelper.getMaxCirclesAroundCircle(superHeavyOptions.rSeaRadius1, RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC) || superHeavyOptions.rSeaRadius1 < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC))) {
            validatedSuperHeavy.numRSeas1 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.numRSeas1 = true;
        }

        if (superHeavyOptions.rSeaAngularOffset1 < 0 || superHeavyOptions.rSeaAngularOffset1 >= 360) {
            validatedSuperHeavy.rSeaAngularOffset1 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.rSeaAngularOffset1 = true;
        }

        if (Math.round(superHeavyOptions.rSeaType1) != superHeavyOptions.rSeaType1 || superHeavyOptions.rSeaType1 < 0 || superHeavyOptions.rSeaType1 > 3) {
            validatedSuperHeavy.rSeaType1 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.rSeaType1 = true;
        }
        
        if (superHeavyOptions.rSeaRadius2 < 0 || (superHeavyOptions.numRSeas2 > 1 && superHeavyOptions.rSeaRadius2 < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC)) {
            validatedSuperHeavy.rSeaRadius2 = false;
            superHeavyValidated = false;
        } else {
            let innerRadius: number = 0;
            let outerRadius: number = 0;
            if (superHeavyOptions.canRSea2Gimbal) {
                if (superHeavyOptions.numRSeas1 > 0) {
                    if (superHeavyOptions.canRSea1Gimbal) {
                        innerRadius = superHeavyOptions.rSeaRadius1 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        innerRadius = superHeavyOptions.rSeaRadius1 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                    }
                }
                else {
                    innerRadius = 0; // technically it is not, but the above if statement already covers it
                }
                if (superHeavyOptions.numRSeas3 > 0) {
                    if (superHeavyOptions.canRSea3Gimbal) {
                        outerRadius = superHeavyOptions.rSeaRadius3 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        outerRadius = superHeavyOptions.rSeaRadius3 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                    }
                }
                else {
                    outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                }
            }
            else {
                if (superHeavyOptions.numRSeas1 > 0) {
                    if (superHeavyOptions.canRSea1Gimbal) {
                        innerRadius = superHeavyOptions.rSeaRadius1 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        innerRadius = superHeavyOptions.rSeaRadius1 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                }
                else {
                    innerRadius = 0; // technically it is not, but the above if statement already covers it                    
                }
                if (superHeavyOptions.numRSeas3 > 0) {
                    if (superHeavyOptions.canRSea3Gimbal) {
                        outerRadius = superHeavyOptions.rSeaRadius3 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        outerRadius = superHeavyOptions.rSeaRadius3 - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                }
                else {
                    outerRadius = LaunchConstants.REAL_LIFE_SCALE.x - RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                }
            }
            if (superHeavyOptions.rSeaRadius2 > outerRadius || superHeavyOptions.rSeaRadius2 < innerRadius) {
                validatedSuperHeavy.rSeaRadius2 = false;
                superHeavyValidated = false;
            } else {
                validatedSuperHeavy.rSeaRadius2 = true;
            }
        }

        if (superHeavyOptions.numRSeas2 < 0 || (superHeavyOptions.numRSeas2 > 1 && (superHeavyOptions.numRSeas2 > MathHelper.getMaxCirclesAroundCircle(superHeavyOptions.rSeaRadius2, RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC) || superHeavyOptions.rSeaRadius2 < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC))) {
            validatedSuperHeavy.numRSeas2 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.numRSeas2 = true;
        }

        if (superHeavyOptions.rSeaAngularOffset2 < 0 || superHeavyOptions.rSeaAngularOffset2 >= 360) {
            validatedSuperHeavy.rSeaAngularOffset2 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.rSeaAngularOffset2 = true;
        }

        if (Math.round(superHeavyOptions.rSeaType2) != superHeavyOptions.rSeaType2 || superHeavyOptions.rSeaType2 < 0 || superHeavyOptions.rSeaType2 > 3) {
            validatedSuperHeavy.rSeaType2 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.rSeaType2 = true;
        }

        if (superHeavyOptions.rSeaRadius3 < 0 || (superHeavyOptions.numRSeas3 > 1 && superHeavyOptions.rSeaRadius3 < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC)) {
            validatedSuperHeavy.rSeaRadius3 = false;
            superHeavyValidated = false;
        } else {
            let innerRadius: number = 0;
            if (superHeavyOptions.canRSea3Gimbal) {
                if (superHeavyOptions.numRSeas2 > 0) {
                    if (superHeavyOptions.canRSea2Gimbal) {
                        innerRadius = superHeavyOptions.rSeaRadius2 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        innerRadius = superHeavyOptions.rSeaRadius2 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC;
                    }
                }
                else {
                    innerRadius = 0; // technically it is not, but the above if statement already covers it
                }
            }
            else {
                if (superHeavyOptions.numRSeas2 > 0) {
                    if (superHeavyOptions.canRSea2Gimbal) {
                        innerRadius = superHeavyOptions.rSeaRadius2 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.R_SEA_GIMBAL_SPACE_PERC + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                    else {
                        innerRadius = superHeavyOptions.rSeaRadius2 + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x + RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x;
                    }
                }
                else {
                    innerRadius = 0; // technically it is not, but the above if statement already covers it                    
                }
            }
            if (superHeavyOptions.rSeaRadius3 > LaunchConstants.REAL_LIFE_SCALE.x || superHeavyOptions.rSeaRadius3 < innerRadius) {
                validatedSuperHeavy.rSeaRadius3 = false;
                superHeavyValidated = false;
            } else {
                validatedSuperHeavy.rSeaRadius3 = true;
            }
        }

        if (superHeavyOptions.numRSeas3 < 0 || (superHeavyOptions.numRSeas3 > 1 && (superHeavyOptions.numRSeas3 > MathHelper.getMaxCirclesAroundCircle(superHeavyOptions.rSeaRadius3, RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC) || superHeavyOptions.rSeaRadius3 < RaptorConstants.R_SEA_RADIUS * LaunchConstants.REAL_LIFE_SCALE.x * RaptorConstants.PACKING_RADIUS_PERC))) {
            validatedSuperHeavy.numRSeas3 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.numRSeas3 = true;
        }

        if (superHeavyOptions.rSeaAngularOffset3 < 0 || superHeavyOptions.rSeaAngularOffset3 >= 360) {
            validatedSuperHeavy.rSeaAngularOffset3 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.rSeaAngularOffset3 = true;
        }

        if (Math.round(superHeavyOptions.rSeaType3) != superHeavyOptions.rSeaType3 || superHeavyOptions.rSeaType3 < 0 || superHeavyOptions.rSeaType3 > 3) {
            validatedSuperHeavy.rSeaType3 = false;
            superHeavyValidated = false;
        } else {
            validatedSuperHeavy.rSeaType3 = true;
        }

        if (superHeavyValidated) {
            superHeavySettings.update((value) => {
                value.gridFinAngularOffset = superHeavyOptions.gridFinAngularOffset;

                value.rSeaAngularOffset1 = superHeavyOptions.rSeaAngularOffset1;
                value.rSeaAngularOffset2 = superHeavyOptions.rSeaAngularOffset2;
                value.rSeaAngularOffset3 = superHeavyOptions.rSeaAngularOffset3;

                value.hsrHeight = superHeavyOptions.hasHsr ? superHeavyOptions.hsrHeight : 0;
                value.boosterRingHeight = superHeavyOptions.boosterRingHeight;
                value.chineHeightScale = superHeavyOptions.chineHeightScale;
                value.numChines = superHeavyOptions.numChines;

                value.gridFinLengthScale = superHeavyOptions.gridFinLengthScale;
                value.gridFinWidthScale = superHeavyOptions.gridFinWidthScale;
                value.numGridFins = superHeavyOptions.numGridFins;

                value.rSeaRadius1 = superHeavyOptions.rSeaRadius1;
                value.numRSeas1 = superHeavyOptions.numRSeas1;
                value.rSeaType1 = superHeavyOptions.rSeaType1;
                value.canRSea1Gimbal = superHeavyOptions.canRSea1Gimbal;

                value.rSeaRadius2 = superHeavyOptions.rSeaRadius2;
                value.numRSeas2 = superHeavyOptions.numRSeas2;
                value.rSeaType2 = superHeavyOptions.rSeaType2;
                value.canRSea2Gimbal = superHeavyOptions.canRSea2Gimbal;

                value.rSeaRadius3 = superHeavyOptions.rSeaRadius3;
                value.numRSeas3 = superHeavyOptions.numRSeas3;
                value.rSeaType3 = superHeavyOptions.rSeaType3;
                value.canRSea3Gimbal = superHeavyOptions.canRSea3Gimbal;
                
                return value;
            });
        }
        else {
            updateDisplay();
            superHeavyRaptors = [];
            setTimeout(() => {
                createSuperHeavyRaptors();
            }, 0);
        }
    }

    function resetSuperHeavy(): void {
        superHeavyOptions = {
            hasHsr: true,
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
            rSeaType1: 2,
            canRSea1Gimbal: SuperHeavyConstants.CAN_R_SEA_1_GIMBAL,

            rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2 * LaunchConstants.REAL_LIFE_SCALE.x,
            numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
            rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2 * 180/Math.PI,
            rSeaType2: 2,
            canRSea2Gimbal: SuperHeavyConstants.CAN_R_SEA_2_GIMBAL,

            rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3 * LaunchConstants.REAL_LIFE_SCALE.x,
            numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
            rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3 * 180/Math.PI,
            rSeaType3: 2,
            canRSea3Gimbal: SuperHeavyConstants.CAN_R_SEA_3_GIMBAL,
        };
        validateSuperHeavy();
    }

    function updateHsr(): void {
        if (superHeavyOptions.hasHsr && superHeavyOptions.hsrHeight === 0) {
            superHeavyOptions.hasHsr = false;
            // before the html updates (b/c checkbox checked after update)
        }
        setTimeout(
            () => {
                if (superHeavyOptions.hasHsr && superHeavyOptions.hsrHeight === 0) {
                    superHeavyOptions.hsrHeight = SuperHeavyConstants.HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y;
                }
                // wait until the html catches up
            }
        ,0)
    }

    function setIsEditing(object: string): void {
        if (object == "SS") {
            toggles.update((value) => {
                value.isEditingStarship = true;
                return value;
            });
            toggles.update((value) => {
                value.isEditingSuperHeavy = false;
                return value;
            });
        } else if (object == "SH") {
            toggles.update((value) => {
                value.isEditingSuperHeavy = true;
                return value;
            });
            toggles.update((value) => {
                value.isEditingStarship = false;
                return value;
            });
        }
        else {
            toggles.update((value) => {
                value.isEditingStarship = false;
                return value;
            });
            toggles.update((value) => {
                value.isEditingSuperHeavy = false;
                return value;
            });
        }
    }

    let hasLeftBar: boolean = true;
    let hasRightBar: boolean = true;

    function hideShowLeftBar(): void {
        hasLeftBar = !hasLeftBar;
    }

    function hideShowRightBar(): void {
        hasRightBar = !hasRightBar;
    }

    function setupKeybinds(): void {
        window.addEventListener("keydown", (event) => {
            if (isEditing) {
                if (event.key === "ArrowLeft") {
                    hideShowLeftBar();
                }
                else if (event.key === "ArrowRight") {
                    hideShowRightBar();
                }
                else if (event.key === "Enter") {
                    validate();
                }
                else if (event.key === "r" || event.key === "R") {
                    reset();
                }
            }
        });
    }

    function startFueling(): void {
        validate();
        if (starshipValidated && superHeavyValidated) {
            localStorage.setItem('starshipSettings', JSON.stringify(starshipOptions));
            localStorage.setItem('superHeavySettings', JSON.stringify(superHeavyOptions));

            toggles.update((value) => {
                value.isEditing = false;
                value.isEditingStarship = false;
                value.isEditingSuperHeavy = false;
                value.isFueling = true;
                return value;
            });
        }
    }

    onMount(() => {
        localStorage.getItem('starshipSettings') ? starshipOptions = JSON.parse(localStorage.getItem('starshipSettings')) : resetStarship();
        localStorage.getItem('superHeavySettings') ? superHeavyOptions = JSON.parse(localStorage.getItem('superHeavySettings')) : resetSuperHeavy();
        validate();

        setupUpdator();
        setupKeybinds();
    });
</script>
<style>
    @keyframes increaseOpacity {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideInLeft {
        from {
            left: -50px;
        }
        to {
            left: 16px;
        }
    }

    @keyframes grow {
        from {
            width: 0;
            height: 0;
        }
        to {
            width: 104%;
            height: 104%;
        }
    }

    .customize-container {
        position: fixed;
        top: 0;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);

        animation: increaseOpacity 0.5s;

        user-select: none;
    }

    .customize-subtitle {
        position: absolute;
        font-size: 14px;
        font-weight: bold;
    }

    .customize-stats {
        position: absolute;
        top: 40px;
        font-size: 12px;
    }

    .customize-image {
        position: absolute;
        object-fit: contain;
        height: calc(100vh - 128px);
        max-width: 50px;
        left: 16px;
        top: 64px;

        animation: slideInLeft 0.5s, increaseOpacity 2s;
    }

    .customize-small-image {
        position: absolute;
        width: auto;

        transform: rotate(90deg);
    }
    
    .customize-options {
        position: absolute;
        width: 150px;
        overflow: auto;
    }

    .customize-title {
        position: absolute;
        width: 134px;
        padding-left: 8px;
        padding-right: 8px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }

    .customize-option-title {
        margin-top: 8px;
    }

    .customize-option {
        padding: 6px;
        text-align: center;
        font-size: 14px;
    }

    .customize-option-input {
        width: 80%;
        margin-top: 8px;
        padding-left: 6px;
        padding-right: 6px;
        padding-top: 4px;
        border: none;
        outline: none;
        border-radius: 4px;
        font-size: 14px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;
        transition: background-color 0.2s, color 0.2s;
    }

    .customize-option-checkbox {
        width: 24px;
        height: 24px;
        margin-top: 8px;
        accent-color: black;
        outline: none;
        border: none;
    }

    .customize-raptor {
        position: absolute;
        border-style: solid;
        border-radius: 100%;

        animation: increaseOpacity 0.5s;
    }

    .customize-raptor-throttle {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;

        animation: grow 2s infinite alternate;
    }

    .customize-body {
        position: absolute;
        border: solid white;
        border-radius: 100%;
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    .customize-banner {
        position: fixed;
        height: 32px;
        user-select: none;
    }

    .customize-action {
        position: absolute;
        border: none;
        outline: none;
        background-color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
        color: black;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.75);
            cursor: pointer;
        }
    }

    .customize-fueling-action {
        position: absolute;
        left:0;
        bottom:0;
        width:100%;
        height: 100%;
        border: none;
        outline: none;
        background-color: #009f6B80;
        font-size: 16px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: #009f6B;
            cursor: pointer;
        }
    }

    .customize-fueling-action-error {
        position: absolute;
        left:0;
        bottom:0;
        width:100%;
        height: 100%;
        border: none;
        outline: none;
        background-color: #ff450080;
        font-size: 16px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: #ff4500;
            cursor: pointer;
        }
    }
</style>

{#if hasLeftBar}
    <div class="customize-container" style="width: 390px; left: 0px;">
        <div class="customize-subtitle" style="left:16px; top:16px;">Vertical Height</div>
        <div class="customize-stats" style="left:16px;">Ship: {shipHeight}m | Booster: {boosterHeight}m | Stack: {stackHeight}m</div>
        <img class="customize-image" src={starshipValidated && superHeavyValidated ? s25b9 : starshipValidated ? s25b9sh : superHeavyValidated ? s25b9ss : s25b9sssh} alt="stack">
        <img class="customize-small-image" src={starshipValidated ? s25 : s25ss} alt="ship" style="height: 80px; top: 40px; right: 230px;">
        <div class="customize-title" style="right:170px; top: 104px;">Customize Starship</div>
        <div class="customize-options" style="right:166px; top: 154px; height: calc(100vh - 186px);">
            {#each Object.keys(starshipOptions) as option}
                {#if !convertToCustomize(option).includes('Raptor') && option != "isEditing"}
                    <div class="customize-option">
                        <div class="customize-option-title">{convertToCustomize(option)}</div>
                        <input class="customize-option-input" type="number" style="background-color: {validatedStarship[option] ? "rgba(0, 0, 0, 0.5)" : "#ff450080"};" bind:value={starshipOptions[option]} on:focusin={()=>{setIsEditing('SS')}} on:focusout={()=>{setIsEditing('')}}>
                    </div>
                {/if}
            {/each}
        </div>
        <img class="customize-small-image" src={superHeavyValidated ? b9 : b9sh} alt="booster" style="height: 112px; top: 25px; right: 80px;">
        <div class="customize-title" style="right:20px; top: 104px;">Customize Superheavy</div>
        <div class="customize-options" style="right:16px; top: 154px; height: calc(100vh - 186px);">
            {#each Object.keys(superHeavyOptions) as option}
                {#if !convertToCustomize(option).includes('Raptor') && option != "isEditing"}
                    {#if option != 'hasHsr'}
                        {#if option === 'hsrHeight'}
                            {#if superHeavyOptions.hasHsr}
                                <div class="customize-option">
                                    <div class="customize-option-title">{convertToCustomize(option)}</div>
                                    <input class="customize-option-input" type="number" style="background-color: {validatedSuperHeavy[option] ? "rgba(0, 0, 0, 0.5)" : "#ff450080"};" bind:value={superHeavyOptions[option]} on:input={updateHsr} on:focus={()=>{setIsEditing('SH')}} on:focusout={()=>{setIsEditing('')}}>
                                </div>
                            {:else}
                                <div class="customize-option" style="opacity: 0.5;">
                                    <div class="customize-option-title">{convertToCustomize(option)}</div>
                                    <input class="customize-option-input" type="number" value="0" disabled>
                                </div>
                            {/if}
                        {:else}
                            <div class="customize-option">
                                <div class="customize-option-title">{convertToCustomize(option)}</div>
                                <input class="customize-option-input" type="number" style="background-color: {validatedSuperHeavy[option] ? "rgba(0, 0, 0, 0.5)" : "#ff450080"};" bind:value={superHeavyOptions[option]} on:focusin={()=>{setIsEditing('SH')}} on:focusout={()=>{setIsEditing('')}}>
                            </div>
                        {/if}
                    {:else}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-checkbox" type="checkbox" bind:checked={superHeavyOptions[option]} on:input={updateHsr} on:focusin={()=>{setIsEditing('SH')}} on:focusout={()=>{setIsEditing('')}}>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
        <button class="customize-action" style="left: 0; bottom: 0; width: 100%; height: 32px;" on:click={hideShowLeftBar}>&#9664; Hide Left</button>
    </div>
{/if}
{#if hasRightBar}
    <div class="customize-container" style="width: 340px; right: 0px;">
        <div class="customize-subtitle" style="right:16px; top:16px;">Thrust to Weight Ratio (Sea Level)</div>
        <div class="customize-stats" style="right:16px;">Ship: {shipTWR}:1 | Booster: {boosterTWR}:1 | Stack: {stackTWR}:1</div>
        <div class="customize-body" style="border-width: {border}px; width: {2 * (sizeMult - border)}px; height: {2 * (sizeMult - border)}px; right: {rightOffsetSS + border}px; top: {topOffset + border}px;"></div>
        {#each starshipRaptors as raptor}
            <div class="customize-raptor" style="border-width: {border}px; border-color: {raptor.isValidated ? 'white' : 'orangered'}; width: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; height: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; right: {raptor.position.x + rightOffsetSS + border}px; top: {raptor.position.y + topOffset + border}px;">
                <div class="customize-raptor-throttle" style="background-color: {raptor.isValidated ? 'white' : 'orangered'}; width: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px"></div>
            </div>
        {/each}
        <div class="customize-body" style="border-width: {border}px; width: {2 * (sizeMult - border)}px; height: {2 * (sizeMult - border)}px; right: {rightOffsetSH + border}px; top: {topOffset + border}px;"></div>
        {#each superHeavyRaptors as raptor}
            <div class="customize-raptor" style="border-width: {border}px; border-color: {raptor.isValidated ? 'white' : 'orangered'}; width: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; height: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; right: {raptor.position.x + rightOffsetSH + border}px; top: {raptor.position.y + topOffset + border}px;">
                <div class="customize-raptor-throttle" style="background-color: {raptor.isValidated ? 'white' : 'orangered'}; width: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px"></div>
            </div>
        {/each}
        <div class="customize-title" style="right:170px; top:210px;">Customize Starship</div>
        <div class="customize-options" style="right:170px; top: 260px; height: calc(100vh - 292px);">
            {#each Object.keys(starshipOptions) as option}
                {#if convertToCustomize(option).includes('Raptor') && option != "isEditing"}
                    {#if typeof starshipOptions[option] === 'boolean'}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-checkbox" type="checkbox" bind:checked={starshipOptions[option]} on:focusin={()=>{setIsEditing('SS')}} on:focusout={()=>{setIsEditing('')}}>
                        </div>
                    {:else}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-input" type="number" style="background-color: {validatedStarship[option] ? "rgba(0, 0, 0, 0.5)" : "#ff450080"};" bind:value={starshipOptions[option]} on:focusin={()=>{setIsEditing('SS')}} on:focusout={()=>{setIsEditing('')}}>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
        <div class="customize-title" style="right:20px; top:210px;">Customize Superheavy</div>
        <div class="customize-options" style="right:20px; top: 260px; height: calc(100vh - 292px);">
            {#each Object.keys(superHeavyOptions) as option}
                {#if convertToCustomize(option).includes('Raptor') && option != "isEditing"}
                    {#if typeof superHeavyOptions[option] === 'boolean'}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-checkbox" type="checkbox" bind:checked={superHeavyOptions[option]} on:focusin={()=>{setIsEditing('SH')}} on:focusout={()=>{setIsEditing('')}}>
                        </div>
                    {:else}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-input" type="number" style="background-color: {validatedSuperHeavy[option] ? "rgba(0, 0, 0, 0.5)" : "#ff450080"};" bind:value={superHeavyOptions[option]} on:focusin={()=>{setIsEditing('SH')}} on:focusout={()=>{setIsEditing('')}}>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
        <button class="customize-action" style="right: 0; bottom: 0; width: 100%; height: 32px;" on:click={hideShowRightBar}>Hide Right &#9654;</button>
    </div>
{/if}
<div class="customize-banner" style="top: 0; {hasLeftBar ? hasRightBar ? "left: 390px; width: calc(100vw - 390px - 340px);" : "left: 390px; width: calc(100vw - 390px);" : hasRightBar ? "left: 0; width: calc(100vw - 340px);" : "left: 0; width: 100vw;"}">
    {#if !hasLeftBar}
        <button class="customize-action" style="left:0; top: 0; width: 25%; height: 100%; border-right: 1px solid white;" on:click={hideShowLeftBar}>&#9664; Show Left</button>
    {/if}
    {#if !hasRightBar}
        <button class="customize-action" style="right:0; top: 0; width: 25%; height: 100%; border-left: 1px solid white;" on:click={hideShowRightBar}>Show Right &#9654;</button>
    {/if}
    <button class="customize-action" style="left:{hasLeftBar ? '0' : '25%'}; top: 0; width: {hasLeftBar && hasRightBar ? '50%' : !hasLeftBar && !hasRightBar ? '25%' : '37.5%'}; height: 100%; border-right: 1px solid white;" on:click={validate}>Test &#128504;</button>
    <button class="customize-action" style="right:{hasRightBar ? '0' : '25%'}; top: 0; width: {hasLeftBar && hasRightBar ? '50%' : !hasLeftBar && !hasRightBar ? '25%' : '37.5%'}; height: 100%;" on:click={reset}>Reset &#8634;</button>
</div>
<div class="customize-banner" style="bottom: 0; {hasLeftBar ? hasRightBar ? "left: 390px; width: calc(100vw - 390px - 340px);" : "left: 390px; width: calc(100vw - 390px);" : hasRightBar ? "left: 0; width: calc(100vw - 340px);" : "left: 0; width: 100vw;"}">
    {#if starshipValidated && superHeavyValidated}
        <button class="customize-fueling-action" style="border-left: {hasLeftBar ? '1px solid white' : ''}; border-right: {hasRightBar ? '1px solid white' : ''}" on:click={startFueling}>Fuel &#10054;</button>
    {:else}
        <button class="customize-fueling-action-error" style="border-left: {hasLeftBar ? '1px solid white' : ''}; border-right: {hasRightBar ? '1px solid white' : ''}" on:click={startFueling}>Fuel &#10054;</button>
    {/if}
</div>
<div style="position:fixed; left: 8px; bottom: 58px;">
    <Keybinds />
</div>