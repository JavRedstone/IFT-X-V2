<script lang="ts">
	import { StringHelper } from './../helpers/StringHelper';
    import { onMount } from "svelte";
    import { Vector2, type Vector3 } from "three";
    import { RaptorUI } from "../structs/ui/RaptorUI";
    import { starshipSettings, superHeavySettings } from "../ui-stores/ui-store";
    import { MathHelper } from "../helpers/MathHelper";
    import s25 from "../images/s25.png";
    import b9 from "../images/b9.png";
    import s25b9 from "../images/s25b9.png";
    import { StarshipConstants } from '../constants/objects/StarshipConstants';
    import { SuperHeavyConstants } from '../constants/objects/SuperHeavyConstants';
    import { RaptorConstants } from '../constants/RaptorConstants';
    import { FuelConstants } from '../constants/objects/FuelConstants';
    import { LaunchHelper } from '../helpers/LaunchHelper';
    import { PhysicsConstants } from '../constants/PhysicsConstants';

    let starshipRaptors: RaptorUI[] = [];
    let superHeavyRaptors: RaptorUI[] = [];
    
    let stackHeight: number = 0;
    let boosterHeight: number = 0;
    let shipHeight: number = 0;
    
    let stackTWR: string = '0';
    let boosterTWR: string = '0';
    let shipTWR: string = '0';

    const sizeMult = 66;
    const topOffset = 70;
    const rSeaRadius = 7.5;
    const rVacRadius = RaptorConstants.RADIUS_SEA_TO_VAC * rSeaRadius;
    const border = 1.275;
    const rSeaRealRadius = rSeaRadius + border;
    const rVacRealRadius = rVacRadius + border;
    const defaultThrottle = 1;

    let starshipOptions: any = {        
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
            
            createRaptors();
            estimateHeight();
            estimateTWR();
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
            
            createRaptors();
            estimateHeight();
            estimateTWR();
        });
    }

    function createRaptors() {
        starshipRaptors = [];
        superHeavyRaptors = [];
        setTimeout(() => {
            createStarshipRaptors();
            createSuperHeavyRaptors();
            // to make html catch up so the animation doesn't break
        }, 0);
    }

    function estimateHeight(): void {
        shipHeight = Math.round(starshipOptions.shipRingHeight * StarshipConstants.SHIP_RING_SCALE.y + StarshipConstants.NOSECONE_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y);
        boosterHeight = Math.round(superHeavyOptions.boosterRingHeight * SuperHeavyConstants.BOOSTER_RING_SCALE.y + superHeavyOptions.hsrHeight * SuperHeavyConstants.HSR_SCALE.y);
        stackHeight = Math.round(shipHeight + boosterHeight);
    }

    function estimateTWR() {
        let shipLOXMass: number = LaunchHelper.getFuelMass(StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, starshipOptions.shipRingHeight * StarshipConstants.SHIP_RING_SCALE.y * StarshipConstants.LOX_PERCENTAGE, FuelConstants.LOX_DENSITY);
        let shipCH4Mass: number = LaunchHelper.getFuelMass(StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, starshipOptions.shipRingHeight * StarshipConstants.SHIP_RING_SCALE.y * StarshipConstants.CH4_PERCENTAGE, FuelConstants.CH4_DENSITY);
        let shipDryMass: number = StarshipConstants.DRY_MASS + starshipRaptors.length * RaptorConstants.DRY_MASS;
        let shipWetMass: number = shipLOXMass + shipCH4Mass + shipDryMass;

        let shipThrust: number = starshipOptions.numRSeas * LaunchHelper.getThrust(true, starshipOptions.rSeaType) + starshipOptions.numRVacs * LaunchHelper.getThrust(false, starshipOptions.rVacType);

        let boosterLOXMass: number = LaunchHelper.getFuelMass(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, superHeavyOptions.boosterRingHeight * SuperHeavyConstants.BOOSTER_RING_SCALE.y * SuperHeavyConstants.LOX_PERCENTAGE, FuelConstants.LOX_DENSITY);
        let boosterCH4Mass: number = LaunchHelper.getFuelMass(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, superHeavyOptions.boosterRingHeight * SuperHeavyConstants.BOOSTER_RING_SCALE.y * SuperHeavyConstants.CH4_PERCENTAGE, FuelConstants.CH4_DENSITY);
        let boosterDryMass: number = SuperHeavyConstants.DRY_MASS + superHeavyRaptors.length * RaptorConstants.DRY_MASS;
        let boosterWetMass: number = boosterLOXMass + boosterCH4Mass + boosterDryMass;

        let boosterThrust: number = superHeavyOptions.numRSeas1 * LaunchHelper.getThrust(true, superHeavyOptions.rSeaType1) + superHeavyOptions.numRSeas2 * LaunchHelper.getThrust(true, superHeavyOptions.rSeaType2) + superHeavyOptions.numRSeas3 * LaunchHelper.getThrust(true, superHeavyOptions.rSeaType3);
        
        shipTWR = StringHelper.formatNumber(LaunchHelper.getTWR(shipThrust, shipWetMass, PhysicsConstants.EARTH_GRAVITY_SURFACE), 2);
        boosterTWR = StringHelper.formatNumber(LaunchHelper.getTWR(boosterThrust, boosterWetMass, PhysicsConstants.EARTH_GRAVITY_SURFACE), 2);
        stackTWR = StringHelper.formatNumber(LaunchHelper.getTWR(boosterThrust, shipWetMass + boosterWetMass, PhysicsConstants.EARTH_GRAVITY_SURFACE), 2);
    }

    function createStarshipRaptors() {
        let rSeaPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRSeas, starshipOptions.rSeaRadius / StarshipConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rSeaAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(true, starshipOptions.rSeaType, defaultThrottle, new Vector2(sizeMult - rSeaPositions[i].z - rSeaRealRadius, rSeaPositions[i].x + sizeMult - rSeaRealRadius))];
        }
        let rVacPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRVacs, starshipOptions.rVacRadius / StarshipConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rVacAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(false, starshipOptions.rVacType, defaultThrottle, new Vector2(sizeMult - rVacPositions[i].z - rVacRealRadius, rVacPositions[i].x + sizeMult - rVacRealRadius))];
        }
    }

    function createSuperHeavyRaptors() {
        let rSeaPositions1: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas1, superHeavyOptions.rSeaRadius1 / SuperHeavyConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset1 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType1, defaultThrottle, new Vector2(sizeMult - rSeaRealRadius - rSeaPositions1[i].z, rSeaPositions1[i].x + sizeMult - rSeaRealRadius))];
        }
        let rSeaPositions2: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas2, superHeavyOptions.rSeaRadius2 / SuperHeavyConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset2 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType2, defaultThrottle, new Vector2(sizeMult - rSeaRealRadius - rSeaPositions2[i].z, rSeaPositions2[i].x + sizeMult - rSeaRealRadius))];
        }
        let rSeaPositions3: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas3, superHeavyOptions.rSeaRadius3 / SuperHeavyConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset3 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType3, defaultThrottle, new Vector2(sizeMult - rSeaRealRadius - rSeaPositions3[i].z, rSeaPositions3[i].x + sizeMult - rSeaRealRadius))];
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
        let isCompletelyValidated: boolean = true;

        if (isCompletelyValidated) {
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
    }

    function resetStarship(): void {
        starshipOptions = {
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
        };
        validateStarship();
    }

    function validateSuperHeavy(): void {
        let isCompletelyValidated: boolean = true;

        if (isCompletelyValidated) {
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
    }

    function resetSuperHeavy(): void {
        superHeavyOptions = {
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
        };
        validateSuperHeavy();
    }

    function updateHsr() {
        if (superHeavyOptions.hasHsr && superHeavyOptions.hsrHeight === 0) {
            superHeavyOptions.hasHsr = false;
            // before the html updates (b/c checkbox checked after update)
        }
        setTimeout(
            () => {
                if (superHeavyOptions.hasHsr && superHeavyOptions.hsrHeight === 0) {
                    superHeavyOptions.hsrHeight = SuperHeavyConstants.HSR_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y;
                }
                // wait until the html catches up
            }
        ,0)
    }

    let hasLeftBar: boolean = true;
    let hasRightBar: boolean = true;

    function hideShowLeftBar() {
        hasLeftBar = !hasLeftBar;
    }

    function hideShowRightBar() {
        hasRightBar = !hasRightBar;
    }

    onMount(() => {
        setupUpdator();
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
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 14px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;
        transition: background-color 0.2s, color 0.2s;

        &:hover {
            background-color: rgba(0, 0, 0, 0.75);
        }
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
        border: solid white;
        border-radius: 100%;

        animation: increaseOpacity 0.5s;
    }

    .customize-raptor-throttle {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background-color: white;

        animation: grow 2s infinite alternate;
    }
    
    .customize-banner {
        position: fixed;
        top: 0;
        height: 32px;
        background-color: rgba(0, 0, 0, 0.5);
        user-select: none;
    }

    .customize-action {
        position: absolute;
        border: none;
        outline: none;
        background-color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.75);
            color: black;
            cursor: pointer;
        }
    }
</style>

{#if hasLeftBar}
    <div class="customize-container" style="width: 390px; left: 0px;">
        <div class="customize-subtitle" style="left:16px; top:16px;">Vertical Height</div>
        <div class="customize-stats" style="left:16px;">Ship: {shipHeight}m | Booster: {boosterHeight}m | Stack: {stackHeight}m</div>
        <img class="customize-image" src={s25b9} alt="stack">
        <img class="customize-small-image" src={s25} alt="ship" style="height: 80px; top: 40px; right: 230px;">
        <div class="customize-title" style="right:170px; top: 104px;">Customize Starship</div>
        <div class="customize-options" style="right:166px; top: 154px; height: calc(100vh - 186px);">
            {#each Object.keys(starshipOptions) as option}
                {#if !convertToCustomize(option).includes('Raptor')}
                    <div class="customize-option">
                        <div class="customize-option-title">{convertToCustomize(option)}</div>
                        <input class="customize-option-input" type="number" bind:value={starshipOptions[option]}>
                    </div>
                {/if}
            {/each}
        </div>
        <img class="customize-small-image" src={b9} alt="booster" style="height: 112px; top: 25px; right: 80px;">
        <div class="customize-title" style="right:20px; top: 104px;">Customize Superheavy</div>
        <div class="customize-options" style="right:16px; top: 154px; height: calc(100vh - 186px);">
            {#each Object.keys(superHeavyOptions) as option}
                {#if !convertToCustomize(option).includes('Raptor')}
                    {#if option != 'hasHsr'}
                        {#if option === 'hsrHeight'}
                            {#if superHeavyOptions.hasHsr}
                                <div class="customize-option">
                                    <div class="customize-option-title">{convertToCustomize(option)}</div>
                                    <input class="customize-option-input" type="number" bind:value={superHeavyOptions[option]} on:input={updateHsr}>
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
                                <input class="customize-option-input" type="number" bind:value={superHeavyOptions[option]}>
                            </div>
                        {/if}
                    {:else}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-checkbox" type="checkbox" bind:checked={superHeavyOptions[option]} on:input={updateHsr}>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
        <button class="customize-action" style="left: 0; bottom: 0; width: 100%; height: 24px;" on:click={hideShowLeftBar}>Hide Left</button>
    </div>
{/if}
{#if hasRightBar}
    <div class="customize-container" style="width: 335px; right: 0px;">
        <div class="customize-subtitle" style="right:16px; top:16px;">Thrust to Weight Ratio (Sea Level)</div>
        <div class="customize-stats" style="right:16px;">Ship: {shipTWR}:1 | Booster: {boosterTWR}:1 | Stack: {stackTWR}:1</div>
        {#each starshipRaptors as raptor}
            <div class="customize-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; height: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; right: {raptor.position.x + 180}px; top: {raptor.position.y + topOffset}px;">
                <div class="customize-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px"></div>
            </div>
        {/each}
        {#each superHeavyRaptors as raptor}
            <div class="customize-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; height: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; right: {raptor.position.x + 28}px; top: {raptor.position.y + topOffset}px;">
                <div class="customize-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px"></div>
            </div>
        {/each}
        <div class="customize-title" style="right:170px; top:210px;">Customize Starship</div>
        <div class="customize-options" style="right:170px; top: 260px; height: calc(100vh - 292px);">
            {#each Object.keys(starshipOptions) as option}
                {#if convertToCustomize(option).includes('Raptor')}
                    {#if typeof starshipOptions[option] === 'boolean'}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-checkbox" type="checkbox" bind:checked={starshipOptions[option]}>
                        </div>
                    {:else}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-input" type="number" bind:value={starshipOptions[option]}>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
        <div class="customize-title" style="right:20px; top:210px;">Customize Superheavy</div>
        <div class="customize-options" style="right:20px; top: 260px; height: calc(100vh - 292px);">
            {#each Object.keys(superHeavyOptions) as option}
                {#if convertToCustomize(option).includes('Raptor')}
                    {#if typeof superHeavyOptions[option] === 'boolean'}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-checkbox" type="checkbox" bind:checked={superHeavyOptions[option]}>
                        </div>
                    {:else}
                        <div class="customize-option">
                            <div class="customize-option-title">{convertToCustomize(option)}</div>
                            <input class="customize-option-input" type="number" bind:value={superHeavyOptions[option]}>
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
        <button class="customize-action" style="right: 0; bottom: 0; width: 100%; height: 24px;" on:click={hideShowRightBar}>Hide Right</button>
    </div>
{/if}
<div class="customize-banner" style={hasLeftBar ? hasRightBar ? "left: 390px; width: calc(100vw - 390px - 335px);" : "left: 390px; width: calc(100vw - 390px);" : hasRightBar ? "left: 0; width: calc(100vw - 335px);" : "left: 0; width: 100vw;"}>
    {#if !hasLeftBar}
        <button class="customize-action" style="left:0; top: 0; width: 25%; height: 100%; border-right: 1px solid white;" on:click={hideShowLeftBar}>Show Left</button>
    {/if}
    {#if !hasRightBar}
        <button class="customize-action" style="right:0; top: 0; width: 25%; height: 100%; border-left: 1px solid white;" on:click={hideShowRightBar}>Show Right</button>
    {/if}
    <button class="customize-action" style="left:{hasLeftBar ? '0' : '25%'}; top: 0; width: {hasLeftBar && hasRightBar ? '50%' : !hasLeftBar && !hasRightBar ? '25%' : '37.5%'}; height: 100%; border-right: 1px solid white;" on:click={validate}>Validate</button>
    <button class="customize-action" style="right:{hasRightBar ? '0' : '25%'}; top: 0; width: {hasLeftBar && hasRightBar ? '50%' : !hasLeftBar && !hasRightBar ? '25%' : '37.5%'}; height: 100%;" on:click={reset}>Reset</button>
</div>