    <script lang="ts">
    import { onMount } from "svelte";
    import { Vector2, type Vector3 } from "three";
    import { RaptorUI } from "../structs/ui/RaptorUI";
    import { starshipSettings, superHeavySettings, telemetry } from "../ui-stores/ui-store";
    import { MathHelper } from "../helpers/MathHelper";
    import s25 from "../images/s25.png";
    import b9 from "../images/b9.png";
    import s25b9 from "../images/s25b9.png";
    import { RaptorConstants } from "../constants/RaptorConstants";
    import { LaunchHelper } from "../helpers/LaunchHelper";
    import { StarshipConstants } from "../constants/objects/StarshipConstants";
    import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

    let starshipRaptors: RaptorUI[] = [];
    let superHeavyRaptors: RaptorUI[] = [];

    const sizeMult = 44;
    const posOffset = 12;
    const rSeaRadius = 4.5;
    const rVacRadius = RaptorConstants.RADIUS_SEA_TO_VAC * rSeaRadius;
    const border = 1.275;
    const rSeaRealRadius = rSeaRadius + border;
    const rVacRealRadius = rVacRadius + border;

    let starshipOptions: any = {
        rSeaRadius: 0,
        numRSeas: 0,
        rSeaAngularOffset: 0,
        rSeaType: 0,

        rVacRadius: 0,
        numRVacs: 0,
        rVacAngularOffset: 0,
        rVacType: 0,
    };
    let superHeavyOptions: any = {
        rSeaRadius1: 0,
        numRSeas1: 0,
        rSeaAngularOffset1: 0,
        rSeaType1: 0,

        rSeaRadius2: 0,
        numRSeas2: 0,
        rSeaAngularOffset2: 0,
        rSeaType2: 0,

        rSeaRadius3: 0,
        numRSeas3: 0,
        rSeaAngularOffset3: 0,
        rSeaType3: 0,
    };
    let telemetryValues: any = {
        dt: 0,

        starshipAngle: 0,
        starshipSpeed: 0,
        starshipAltitude: 0,
        starshipLOX: 0,
        starshipCH4: 0,
        starshipDisabled: false,
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
    };

    function setupUpdator() {
        starshipSettings.subscribe((value) => {
            starshipOptions.rSeaAngularOffset = value.rSeaAngularOffset;
            starshipOptions.rVacAngularOffset = value.rVacAngularOffset;

            starshipOptions.rSeaRadius = value.rSeaRadius;
            starshipOptions.numRSeas = value.numRSeas;
            starshipOptions.rSeaType = value.rSeaType;

            starshipOptions.rVacRadius = value.rVacRadius;
            starshipOptions.numRVacs = value.numRVacs;
            starshipOptions.rVacType = value.rVacType;
            
            createRaptors();
        });
        superHeavySettings.subscribe((value) => {
            starshipRaptors = [];
            superHeavyRaptors = [];

            superHeavyOptions.rSeaAngularOffset1 = value.rSeaAngularOffset1;
            superHeavyOptions.rSeaAngularOffset2 = value.rSeaAngularOffset2;
            superHeavyOptions.rSeaAngularOffset3 = value.rSeaAngularOffset3;

            superHeavyOptions.rSeaRadius1 = value.rSeaRadius1;
            superHeavyOptions.numRSeas1 = value.numRSeas1;
            superHeavyOptions.rSeaType1 = value.rSeaType1;

            superHeavyOptions.rSeaRadius2 = value.rSeaRadius2;
            superHeavyOptions.numRSeas2 = value.numRSeas2;
            superHeavyOptions.rSeaType2 = value.rSeaType2;

            superHeavyOptions.rSeaRadius3 = value.rSeaRadius3;
            superHeavyOptions.numRSeas3 = value.numRSeas3;
            superHeavyOptions.rSeaType3 = value.rSeaType3;

            createRaptors();
        });
        telemetry.subscribe((value) => {
            telemetryValues.dt = value.dt;

            telemetryValues.starshipAngle = value.starshipAngle;
            telemetryValues.starshipSpeed = value.starshipSpeed;
            telemetryValues.starshipAltitude = value.starshipAltitude;
            telemetryValues.starshipLOX = value.starshipLOX;
            telemetryValues.starshipCH4 = value.starshipCH4;
            telemetryValues.starshipDisabled = value.starshipDisabled;
            telemetryValues.rSeaThrottles = value.rSeaThrottles;
            telemetryValues.rVacThrottles = value.rVacThrottles;

            telemetryValues.superHeavyAngle = value.superHeavyAngle;
            telemetryValues.superHeavySpeed = value.superHeavySpeed;
            telemetryValues.superHeavyAltitude = value.superHeavyAltitude;
            telemetryValues.superHeavyLOX = value.superHeavyLOX;
            telemetryValues.superHeavyCH4 = value.superHeavyCH4;
            telemetryValues.superHeavyDisabled = value.superHeavyDisabled;
            telemetryValues.rSeaThrottles1 = value.rSeaThrottles1;
            telemetryValues.rSeaThrottles2 = value.rSeaThrottles2;
            telemetryValues.rSeaThrottles3 = value.rSeaThrottles3;

            telemetryValues.separated = value.separated;
            
            createRaptors();
        });
    }

    function createRaptors(): void {
        starshipRaptors = [];
        superHeavyRaptors = [];
        createStarshipRaptors();
        createSuperHeavyRaptors();
    }

    function createStarshipRaptors(): void {
        let rSeaPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRSeas, starshipOptions.rSeaRadius / StarshipConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rSeaAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(true, starshipOptions.rSeaType, telemetryValues.rSeaThrottles[i], new Vector2(sizeMult - rSeaPositions[i].z - rSeaRealRadius, rSeaPositions[i].x + sizeMult - rSeaRealRadius))];
        }
        let rVacPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRVacs, starshipOptions.rVacRadius / StarshipConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rVacAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(false, starshipOptions.rVacType, telemetryValues.rVacThrottles[i], new Vector2(sizeMult - rVacPositions[i].z - rVacRealRadius, rVacPositions[i].x + sizeMult - rVacRealRadius))];
        }
    }

    function createSuperHeavyRaptors(): void {
        let rSeaPositions1: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas1, superHeavyOptions.rSeaRadius1 / SuperHeavyConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset1 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType1, telemetryValues.rSeaThrottles1[i], new Vector2(rSeaPositions1[i].z + sizeMult - rSeaRealRadius, rSeaPositions1[i].x + sizeMult - rSeaRealRadius))];
        }
        let rSeaPositions2: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas2, superHeavyOptions.rSeaRadius2 / SuperHeavyConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset2 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType2, telemetryValues.rSeaThrottles2[i], new Vector2(rSeaPositions2[i].z + sizeMult - rSeaRealRadius, rSeaPositions2[i].x + sizeMult - rSeaRealRadius))];
        }
        let rSeaPositions3: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas3, superHeavyOptions.rSeaRadius3 / SuperHeavyConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset3 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType3, telemetryValues.rSeaThrottles3[i], new Vector2(rSeaPositions3[i].z + sizeMult - rSeaRealRadius, rSeaPositions3[i].x + sizeMult - rSeaRealRadius))];
        }
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

    @keyframes slideUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
        }
    }
    
    @keyframes rightLeft {
        0% {
            width: 0;
        }
        50% {
            width: 100%;
        }
        100% {
            width: 0;
        }
    }

    @keyframes inOut {
        0% {
            width: 0;
            height: 0;
        }
        50% {
            width: 110%;
            height: 110%;
        }
        100% {
            width: 0;
            height: 0;
        }
    }

    .launch-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 110px;
        background-color: rgba(0, 0, 0, 0.5);
        
        animation: slideUp 0.5s, increaseOpacity 1s;
    }

    .launch-raptor {
        position: absolute;
        border: solid white;
        border-radius: 100%;

        animation: increaseOpacity 0.5s;
    }

    .launch-raptor-throttle {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background-color: white;

        animation: inOut 5s;
    }

    .launch-bar-container {
        position: absolute;
        width: 160px;
        height: 9px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .launch-bar {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.25), white);

        animation: rightLeft 5s;
    }

    .launch-fuel {
        position: absolute;
        font-size: 12px;
    }

    .launch-telem-container {
        display: flex;
        position: absolute;
    }

    .launch-telem {
        font-size: 14px;
    }

    .launch-telem-spacer {
        flex-grow: 1;
    }

    .launch-image {
        position: absolute;
        height: 80px;
        width: auto;
        top: 15px;

        animation: slideUp 2s, increaseOpacity 1s;
    }

    .launch-line {
        position: absolute;
        top: 54px;
        width: 120px;
        height: 0;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .launch-time {
        position: absolute;
        left: 50%;
        top: 30px;
        transform: translate(-50%);
        font-weight: bold;
        font-size: 24px;
    }

    .launch-event {
        position: absolute;
        left: 50%;
        top: 60px;
        transform: translate(-50%);
        font-weight: bold;
        font-size: 12px;
    }
</style>
<div class="launch-container" style="user-select: none;">
    <div class="launch-time">{ LaunchHelper.getTString(telemetryValues.dt) }</div>
    <div class="launch-event">INTEGRATED FLIGHT TEST X</div>
    <div style="opacity: {telemetryValues.starshipDisabled ? 0.5 : 1};">
        {#each starshipRaptors as raptor}
            <div class="launch-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; height: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; right: {raptor.position.x + posOffset}px; top: {raptor.position.y + posOffset}px;">
                <div class="launch-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px"></div>
            </div>
        {/each}

        <span class="launch-fuel" style="right: 293px; top: 57px;">LOX</span>
        <div class="launch-bar-container"
            style="right: 125px; top: 60px;"
        >
            <div class="launch-bar" style="width:{telemetryValues.starshipLOX * 100}%"></div>
        </div>
        <span class="launch-fuel" style="right: 293px; top: 77px;">CH4</span>
        <div class="launch-bar-container"
            style="right: 125px; top: 80px;"
        >
            <div class="launch-bar" style="width:{telemetryValues.starshipCH4 * 100}%"></div>
        </div>

        <div class="launch-telem-container" style="right: 125px; top: 12px; width: 185px">
            <span class="launch-telem">SPEED</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">{telemetryValues.starshipSpeed}KM/H</span>
        </div>
        <div class="launch-telem-container" style="right: 139px; top: 30px; width: 171px">
            <span class="launch-telem">ALTITUDE</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">{telemetryValues.starshipAltitude}KM</span>
        </div>
        
        <div class="launch-line" style="right: 337px;"></div>
        <img class="launch-image" style="right: 380px; transform: rotate({telemetryValues.starshipAngle}rad);" src={s25} alt="ship">
    </div>
    <div style="opacity: {telemetryValues.superHeavyDisabled ? 0.5 : 1};">
        {#each superHeavyRaptors as raptor}
            <div class="launch-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; height: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; left: {raptor.position.x + posOffset}px; top: {raptor.position.y + posOffset}px;">
                <div class="launch-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px"></div>
            </div>
        {/each}

        <span class="launch-fuel" style="left: 125px; top: 57px;">LOX</span>
        <div class="launch-bar-container"
            style="left: 150px; top: 60px;"
        >
            <div class="launch-bar" style="width:{telemetryValues.superHeavyLOX * 100}%"></div>
        </div>
        <span class="launch-fuel" style="left: 125px; top: 77px;">CH4</span>
        <div class="launch-bar-container"
            style="left: 150px; top: 80px;"
        >
            <div class="launch-bar" style="width:{telemetryValues.superHeavyCH4 * 100}%"></div>
        </div>
        
        <div class="launch-telem-container" style="left: 125px; top: 12px; width: 185px">
            <span class="launch-telem">SPEED</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">{telemetryValues.superHeavySpeed}KM/H</span>
        </div>
        <div class="launch-telem-container" style="left: 125px; top: 30px; width: 171px">
            <span class="launch-telem">ALTITUDE</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">{telemetryValues.superHeavyAltitude}KM</span>
        </div>
        
        <div class="launch-line" style="left: 336px;"></div>
        <img class="launch-image" style="left: {telemetryValues.separated ? 385 : 390}px; transform: rotate({telemetryValues.superHeavyAngle}rad);" src={telemetryValues.separated ? b9 : s25b9} alt="booster">
    </div>
</div>