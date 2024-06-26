    <script lang="ts">
    import { onMount } from "svelte";
    import { Vector2, type Vector3 } from "three";
    import { RaptorUI } from "../../structs/ui/RaptorUI";
    import { gameSettings, keyPresses, starshipSettings, superHeavySettings, telemetry } from "../../stores/ui-store";
    import { MathHelper } from "../../helpers/MathHelper";
    import s25 from "../../images/s25.png";
    import b9 from "../../images/b9.png";
    import s25b9 from "../../images/s25b9.png";
    import { RaptorConstants } from "../../constants/controls/RaptorConstants";
    import { LaunchHelper } from "../../helpers/LaunchHelper";
    import { LaunchConstants } from "../../constants/objects/LaunchConstants";
    import Keybinds from "./../popups/keybinds.svelte";
    import { SceneConstants } from "../../constants/SceneConstants";
    import Settings from "../popups/settings.svelte";
    import Restart from "../popups/restart.svelte";

    let starshipRaptors: RaptorUI[] = [];
    let superHeavyRaptors: RaptorUI[] = [];
    let speedUp: number = SceneConstants.SPEEDUP_DEFAULT;

    const sizeMult = 44;
    const posOffset = 12;
    const rSeaRadius = sizeMult * RaptorConstants.R_SEA_RADIUS;
    const rVacRadius = sizeMult * RaptorConstants.R_VAC_RADIUS;
    const border = 1.275;
    const rSeaFakeRadius = rSeaRadius - border;
    const rVacFakeRadius = rVacRadius - border;

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

        separated: false,
    };

    let currBoosterEvent: string = LaunchConstants.BOOSTER_LAUNCH_EVENTS[0];
    let isBoosterEventEnabled: boolean = false;
    let nextBoosterEvent: string = LaunchConstants.BOOSTER_LAUNCH_EVENTS[1];

    let currShipEvent: string = LaunchConstants.SHIP_LAUNCH_EVENTS[0];
    let isShipEventEnabled: boolean = false;
    let nextShipEvent: string = LaunchConstants.SHIP_LAUNCH_EVENTS[1];

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
            
            starshipRaptors = [];
            createStarshipRaptors(); 
        });
        superHeavySettings.subscribe((value) => {
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

            superHeavyRaptors = [];
            createSuperHeavyRaptors();
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

            telemetryValues.rSeaGimbalingAngles = value.rSeaGimbalingAngles;
            telemetryValues.rVacGimbalingAngles = value.rVacGimbalingAngles;
            telemetryValues.rSeaGimbalYs = value.rSeaGimbalYs;
            telemetryValues.rVacGimbalYs = value.rVacGimbalYs;

            telemetryValues.forwardLAngle = value.forwardLAngle;
            telemetryValues.forwardRAngle = value.forwardRAngle;
            telemetryValues.aftLAngle = value.aftLAngle;
            telemetryValues.aftRAngle = value.aftRAngle;
            
            telemetryValues.rSeaGimbalingAngles1 = value.rSeaGimbalingAngles1;
            telemetryValues.rSeaGimbalingAngles2 = value.rSeaGimbalingAngles2;
            telemetryValues.rSeaGimbalingAngles3 = value.rSeaGimbalingAngles3;
            telemetryValues.rSeaGimbalYs1 = value.rSeaGimbalYs1;
            telemetryValues.rSeaGimbalYs2 = value.rSeaGimbalYs2;
            telemetryValues.rSeaGimbalYs3 = value.rSeaGimbalYs3;

            telemetryValues.separated = value.separated;

            currBoosterEvent = LaunchConstants.BOOSTER_LAUNCH_EVENTS[value.currBoosterEvent];
            isBoosterEventEnabled = value.isBoosterEventEnabled;
            nextBoosterEvent = LaunchConstants.BOOSTER_LAUNCH_EVENTS[value.currBoosterEvent + 1];
            
            currShipEvent = LaunchConstants.SHIP_LAUNCH_EVENTS[value.currShipEvent];
            isShipEventEnabled = value.isShipEventEnabled;
            nextShipEvent = LaunchConstants.SHIP_LAUNCH_EVENTS[value.currShipEvent + 1];

            updateThrottles();
            updateGimbals();
        });
    }

    function updateThrottles(): void {
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            // starshipRaptors[i].throttle = telemetryValues.rSeaThrottles[i];
            starshipRaptors[i].throttle = telemetryValues.rSeaThrottles[i];
        }
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors[i + starshipOptions.numRSeas].throttle = telemetryValues.rVacThrottles[i];
        }

        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors[i].throttle = telemetryValues.rSeaThrottles1[i];
        }
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors[i + superHeavyOptions.numRSeas1].throttle = telemetryValues.rSeaThrottles2[i];
        }
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2].throttle = telemetryValues.rSeaThrottles3[i];
        }

        starshipRaptors = starshipRaptors;
        superHeavyRaptors = superHeavyRaptors;
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
                    superHeavyRaptors[i].updateGimbal(telemetryValues.rSeaGimbalingAngles1[i], telemetryValues.rSeaGimbalYs1[i], sizeMult, true);
                }
            }
        }
        if (telemetryValues.rSeaGimbalingAngles2.length == superHeavyOptions.numRSeas2 && telemetryValues.rSeaGimbalYs2.length == superHeavyOptions.numRSeas2) {
            for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
                if (superHeavyRaptors[i + superHeavyOptions.numRSeas1] != undefined && superHeavyRaptors[i + superHeavyOptions.numRSeas1].isValidated) {
                    superHeavyRaptors[i + superHeavyOptions.numRSeas1].updateGimbal(telemetryValues.rSeaGimbalingAngles2[i], telemetryValues.rSeaGimbalYs2[i], sizeMult, true);
                }
            }
        }
        if (telemetryValues.rSeaGimbalingAngles3.length == superHeavyOptions.numRSeas3 && telemetryValues.rSeaGimbalYs3.length == superHeavyOptions.numRSeas3) {
            for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
                if (superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2] != undefined && superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2].isValidated) {
                    superHeavyRaptors[i + superHeavyOptions.numRSeas1 + superHeavyOptions.numRSeas2].updateGimbal(telemetryValues.rSeaGimbalingAngles3[i], telemetryValues.rSeaGimbalYs3[i], sizeMult, true);
                }
            }
        }

        starshipRaptors = starshipRaptors;
        superHeavyRaptors = superHeavyRaptors;
    }

    function createStarshipRaptors(): void {
        let rSeaPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRSeas, starshipOptions.rSeaRadius / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rSeaAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(true, starshipOptions.rSeaType, telemetryValues.rSeaThrottles[i], new Vector2(sizeMult - rSeaPositions[i].z - rSeaRadius, rSeaPositions[i].x + sizeMult - rSeaRadius))];
        }
        let rVacPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRVacs, starshipOptions.rVacRadius / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, starshipOptions.rVacAngularOffset * Math.PI / 180);
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(false, starshipOptions.rVacType, telemetryValues.rVacThrottles[i], new Vector2(sizeMult - rVacPositions[i].z - rVacRadius, rVacPositions[i].x + sizeMult - rVacRadius))];
        }
    }

    function createSuperHeavyRaptors(): void {
        let rSeaPositions1: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas1, superHeavyOptions.rSeaRadius1 / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset1 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType1, telemetryValues.rSeaThrottles1[i], new Vector2(rSeaPositions1[i].z + sizeMult - rSeaRadius, rSeaPositions1[i].x + sizeMult - rSeaRadius))];
        }
        let rSeaPositions2: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas2, superHeavyOptions.rSeaRadius2 / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset2 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType2, telemetryValues.rSeaThrottles2[i], new Vector2(rSeaPositions2[i].z + sizeMult - rSeaRadius, rSeaPositions2[i].x + sizeMult - rSeaRadius))];
        }
        let rSeaPositions3: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas3, superHeavyOptions.rSeaRadius3 / LaunchConstants.REAL_LIFE_SCALE.x * sizeMult, superHeavyOptions.rSeaAngularOffset3 * Math.PI / 180);
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, superHeavyOptions.rSeaType3, telemetryValues.rSeaThrottles3[i], new Vector2(rSeaPositions3[i].z + sizeMult - rSeaRadius, rSeaPositions3[i].x + sizeMult - rSeaRadius))];
        }
    }

    function sendBoosterEvent(): void {
        if (isBoosterEventEnabled) {
            telemetry.update((value) => {
                value.isBoosterEventClicked = true;
                return value;
            });
        }
    }

    function sendShipEvent(): void {
        if (isShipEventEnabled) {
            telemetry.update((value) => {
                value.isShipEventClicked = true;
                return value;
            });
        }
    }

    function setSpeedUp(): void {
        if (speedUp == Math.round(speedUp) && speedUp >= SceneConstants.SPEEDUP_MIN && speedUp <= SceneConstants.SPEEDUP_MAX) {
            speedUp = Math.round(speedUp);
        }
        else {
            if (speedUp >= SceneConstants.SPEEDUP_MAX) {
                speedUp = SceneConstants.SPEEDUP_MAX;
            }
            else if (speedUp <= SceneConstants.SPEEDUP_MIN) {
                speedUp = SceneConstants.SPEEDUP_MIN;
            }
            else {
                speedUp = SceneConstants.SPEEDUP_DEFAULT;
            }
        }
        gameSettings.update((value) => {
            value.speedUp = speedUp;
            return value;
        });
    }
    
    function setupKeybinds(): void {
        window.addEventListener("keydown", (event) => {
            if (event.key == "w" || event.key == "W") {
                keyPresses.update((value) => {
                    value.isWPressed = true;
                    return value;
                });
            }
            if (event.key == "a" || event.key == "A") {
                keyPresses.update((value) => {
                    value.isAPressed = true;
                    return value;
                });
            }
            if (event.key == "s" || event.key == "S") {
                keyPresses.update((value) => {
                    value.isSPressed = true;
                    return value;
                });
            }
            if (event.key == "d" || event.key == "D") {
                keyPresses.update((value) => {
                    value.isDPressed = true;
                    return value;
                });
            }
            if (event.key == "q" || event.key == "Q") {
                keyPresses.update((value) => {
                    value.isQPressed = true;
                    return value;
                });
            }
            if (event.key == "e" || event.key == "E") {
                keyPresses.update((value) => {
                    value.isEPressed = true;
                    return value;
                });
            }
            if (event.key == "i" || event.key == "I") {
                keyPresses.update((value) => {
                    value.isIPressed = true;
                    return value;
                });
            }
            if (event.key == "k" || event.key == "K") {
                keyPresses.update((value) => {
                    value.isKPressed = true;
                    return value;
                });
            }
            if (event.key == "j" || event.key == "J") {
                keyPresses.update((value) => {
                    value.isJPressed = true;
                    return value;
                });
            }
            if (event.key == "l" || event.key == "L") {
                keyPresses.update((value) => {
                    value.isLPressed = true;
                    return value;
                });
            }
            if (event.key == "u" || event.key == "U") {
                keyPresses.update((value) => {
                    value.isUPressed = true;
                    return value;
                });
            }
            if (event.key == "o" || event.key == "O") {
                keyPresses.update((value) => {
                    value.isOPressed = true;
                    return value;
                });
            }
            if (event.key == "Shift") {
                telemetry.update((value) => {
                    value.isCameraOnStarship = !value.isCameraOnStarship;
                    return value;
                });
            }
            if (event.key == "Enter") {
                sendBoosterEvent();
            }
            if (event.key == "-") {
                speedUp -= SceneConstants.SPEEDUP_STEP;
                setSpeedUp();
            }
            if (event.key == "=") {
                speedUp += SceneConstants.SPEEDUP_STEP;
                setSpeedUp();
            }
        });
        window.addEventListener("keyup", (event) => {
            if (event.key == "w" || event.key == "W") {
                keyPresses.update((value) => {
                    value.isWPressed = false;
                    return value;
                });
            }
            if (event.key == "a" || event.key == "A") {
                keyPresses.update((value) => {
                    value.isAPressed = false;
                    return value;
                });
            }
            if (event.key == "s" || event.key == "S") {
                keyPresses.update((value) => {
                    value.isSPressed = false;
                    return value;
                });
            }
            if (event.key == "d" || event.key == "D") {
                keyPresses.update((value) => {
                    value.isDPressed = false;
                    return value;
                });
            }
            if (event.key == "q" || event.key == "Q") {
                keyPresses.update((value) => {
                    value.isQPressed = false;
                    return value;
                });
            }
            if (event.key == "e" || event.key == "E") {
                keyPresses.update((value) => {
                    value.isEPressed = false;
                    return value;
                });
            }
            if (event.key == "i" || event.key == "I") {
                keyPresses.update((value) => {
                    value.isIPressed = false;
                    return value;
                });
            }
            if (event.key == "k" || event.key == "K") {
                keyPresses.update((value) => {
                    value.isKPressed = false;
                    return value;
                });
            }
            if (event.key == "j" || event.key == "J") {
                keyPresses.update((value) => {
                    value.isJPressed = false;
                    return value;
                });
            }
            if (event.key == "l" || event.key == "L") {
                keyPresses.update((value) => {
                    value.isLPressed = false;
                    return value;
                });
            }
            if (event.key == "u" || event.key == "U") {
                keyPresses.update((value) => {
                    value.isUPressed = false;
                    return value;
                });
            }
            if (event.key == "o" || event.key == "O") {
                keyPresses.update((value) => {
                    value.isOPressed = false;
                    return value;
                });
            }
        });
    }

    onMount(() => {
        setupKeybinds();
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

    @keyframes slideDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }
    
    @keyframes expandRight {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }

    .telemetry-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 110px;
        background-color: rgba(0, 0, 0, 0.5);

        user-select: none;
        
        animation: slideUp 0.5s, increaseOpacity 1s;
    }

    .telemetry-raptor {
        position: absolute;
        border: solid white;
        border-radius: 100%;
    }

    .telemetry-raptor-throttle {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background-color: white;
    }

    .telemetry-bar-container {
        position: absolute;
        width: 160px;
        height: 9px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .telemetry-bar {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.25), white);

        animation: expandRight 1s;
    }

    .telemetry-fuel {
        position: absolute;
        font-size: 12px;
    }

    .telemetry-telem-container {
        display: flex;
        position: absolute;
    }

    .telemetry-telem {
        font-size: 14px;
    }

    .telemetry-telem-spacer {
        flex-grow: 1;
    }

    .telemetry-image {
        position: absolute;
        height: 80px;
        width: auto;
        top: 15px;

        animation: slideUp 2s, increaseOpacity 1s;
    }

    .telemetry-line {
        position: absolute;
        top: 54px;
        width: 120px;
        height: 0;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .telemetry-time {
        position: absolute;
        left: 50%;
        top: 30px;
        transform: translate(-50%);
        font-weight: bold;
        font-size: 24px;
    }

    .telemetry-event {
        position: absolute;
        left: 50%;
        top: 60px;
        transform: translate(-50%);
        font-weight: bold;
        font-size: 12px;
    }

    .telemetry-launchevents-container {
        position: fixed;
        top: 0;
        width: 300px;
        background-color: rgba(0, 0, 0, 0.5);

        animation: slideDown 0.5s, increaseOpacity 1s;

        user-select: none;
    }

    .telemetry-launchevents-title {
        position: absolute;
        margin-left: 8px;
        margin-top: 8px;
        font-size: 20px;
        font-weight: bold;
    }

    .telemetry-launchevents-normal {
        position: absolute;
    }

    .telemetry-launchevents-normal{
        position: absolute;
        width: 100%;
        height: 32px;
        margin-left: 0;
        margin-top: 40px;
        font-size: 16px;
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

    .telemetry-launchevents-disabled {
        position: absolute;
        width: 100%;
        height: 32px;
        margin-left: 0;
        margin-top: 40px;
        font-size: 16px;
        border: none;
        outline: none;
        background-color: rgba(100, 100, 100, 0.5);
        font-size: 16px;
        color: lightgray;
        font-family: "M PLUS Code Latin", monospace;

        animation: increaseOpacity 0.5s;
    }

    .telemetry-launchevents-next {
        position: absolute;
        margin-left: 8px;
        margin-top: 76px;
        opacity: 0.5;
    }

    .telemetry-launchevents-next-text {
        font-size: 14px;
    }

    .telemetry-flap-dot {
        position: absolute;
        right: 480px;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        font-size: 10px;
        text-align: center;
        line-height: 20px;
    }

    .telemetry-flap {
        position: absolute;
        height: 0;
        border: 1px solid white;
    }

    .telemetry-speedup-container {
        position: absolute;
        bottom: 120px;
        right: 8px;
        width: 140px;
        height: 10px;
        padding: 8px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }

    .telemetry-speedup-slider {
        -webkit-appearance: none;
        position: absolute;
        right: 8px;
        top: 6px;
        width: 100px;
        height: 10px;
        background: rgba(255, 255, 255, 0.5);
        outline: none;

        animation: increaseOpacity 0.5s;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 10px;
            height: 10px;
            background: white;
            cursor: pointer;
        }
    }

    .telemetry-speedup-number {
        position: absolute;
        left: 8px;
        top: 3px;
        color: white;
        font-size: 16px;

        animation: increaseOpacity 0.5s;
    }
</style>
{#if currBoosterEvent != null}
    <div class="telemetry-launchevents-container" style="left: 0; height: {nextBoosterEvent != null ? 100 : 72}px;">
        <div class="telemetry-launchevents-title">Booster Events</div>
        {#if isBoosterEventEnabled}
            <button class="telemetry-launchevents-normal" on:click="{sendBoosterEvent}">{currBoosterEvent} &#9664; &#10003;</button>
        {:else}
            <button class="telemetry-launchevents-disabled">{currBoosterEvent} &#9664; &#10007;</button>
        {/if}
        {#if nextBoosterEvent != null}
            <div class="telemetry-launchevents-next">
                <span class="telemetry-launchevents-next-text">Next: {nextBoosterEvent}</span>
            </div>
        {/if}
    </div>
{/if}
{#if currShipEvent != null}
    <div class="telemetry-launchevents-container" style="right: 0; height: {nextShipEvent != null ? 100 : 72}px;">
        <div class="telemetry-launchevents-title">Ship Events</div>
        {#if isShipEventEnabled}
            <button class="telemetry-launchevents-normal" on:click="{sendShipEvent}">{currShipEvent} &#9664; &#10003;</button>
        {:else}
            <button class="telemetry-launchevents-disabled">{currShipEvent} &#9664; &#10007;</button>
        {/if}
        {#if nextShipEvent != null}
            <div class="telemetry-launchevents-next">
                <span class="telemetry-launchevents-next-text">Next: {nextShipEvent}</span>
            </div>
        {/if}
    </div>
{/if}
<div class="telemetry-container">
    <div class="telemetry-time">{ LaunchHelper.getTString(telemetryValues.dt) }</div>
    <div class="telemetry-event">INTEGRATED FLIGHT TEST X</div>
    <div style="opacity: {telemetryValues.starshipDisabled ? 0.5 : 1};">
        {#each starshipRaptors as raptor}
            <div class="telemetry-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; height: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; right: {raptor.position.x + posOffset + border}px; top: {raptor.position.y + posOffset + border}px;">
                <div class="telemetry-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px"></div>
            </div>
        {/each}

        <span class="telemetry-fuel" style="right: 293px; top: 57px;">LOX</span>
        <div class="telemetry-bar-container"
            style="right: 125px; top: 60px;"
        >
            <div class="telemetry-bar" style="width:{telemetryValues.starshipLOX * 100}%"></div>
        </div>
        <span class="telemetry-fuel" style="right: 293px; top: 77px;">CH4</span>
        <div class="telemetry-bar-container"
            style="right: 125px; top: 80px;"
        >
            <div class="telemetry-bar" style="width:{telemetryValues.starshipCH4 * 100}%"></div>
        </div>

        <div class="telemetry-telem-container" style="right: 125px; top: 12px; width: 185px">
            <span class="telemetry-telem">SPEED</span>
            <span class="telemetry-telem-spacer"></span>
            <span class="telemetry-telem">{telemetryValues.starshipSpeed}KM/H</span>
        </div>
        <div class="telemetry-telem-container" style="right: 139px; top: 30px; width: 171px">
            <span class="telemetry-telem">ALTITUDE</span>
            <span class="telemetry-telem-spacer"></span>
            <span class="telemetry-telem">{telemetryValues.starshipAltitude}KM</span>
        </div>
        
        <div class="telemetry-line" style="right: 337px;"></div>
        <img class="telemetry-image" style="right: 380px; transform: rotate({-telemetryValues.starshipAngle}rad);" src={s25} alt="ship">
        <div class="telemetry-flap-dot" style="top: 20px;">FWD</div>
        <div class="telemetry-flap" style="top: 30px; right: 501px; width: 5px; transform-origin: right; transform: rotate({-telemetryValues.forwardLAngle}rad);"></div>
        <div class="telemetry-flap" style="top: 30px; right: 474px; width: 5px; transform-origin: left; transform: rotate({telemetryValues.forwardRAngle}rad);"></div>
        <div class="telemetry-flap-dot" style="bottom: 20px;">AFT</div>
        <div class="telemetry-flap" style="bottom: 30px; right: 501px; width: 10px; transform-origin: right; transform: rotate({-telemetryValues.aftLAngle}rad);"></div>
        <div class="telemetry-flap" style="bottom: 30px; right: 469px; width: 10px; transform-origin: left; transform: rotate({telemetryValues.aftRAngle}rad);"></div>
    </div>
    <div style="opacity: {telemetryValues.superHeavyDisabled ? 0.5 : 1};">
        {#each superHeavyRaptors as raptor}
            <div class="telemetry-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; height: {raptor.isSea ? rSeaFakeRadius*2 : rVacFakeRadius*2}px; left: {raptor.position.x + posOffset + border}px; top: {raptor.position.y + posOffset + border}px;">
                <div class="telemetry-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRadius * 2 : raptor.throttle * rVacRadius * 2}px"></div>
            </div>
        {/each}

        <span class="telemetry-fuel" style="left: 125px; top: 57px;">LOX</span>
        <div class="telemetry-bar-container"
            style="left: 150px; top: 60px;"
        >
            <div class="telemetry-bar" style="width:{telemetryValues.superHeavyLOX * 100}%"></div>
        </div>
        <span class="telemetry-fuel" style="left: 125px; top: 77px;">CH4</span>
        <div class="telemetry-bar-container"
            style="left: 150px; top: 80px;"
        >
            <div class="telemetry-bar" style="width:{telemetryValues.superHeavyCH4 * 100}%"></div>
        </div>
        
        <div class="telemetry-telem-container" style="left: 125px; top: 12px; width: 185px">
            <span class="telemetry-telem">SPEED</span>
            <span class="telemetry-telem-spacer"></span>
            <span class="telemetry-telem">{telemetryValues.superHeavySpeed}KM/H</span>
        </div>
        <div class="telemetry-telem-container" style="left: 125px; top: 30px; width: 171px">
            <span class="telemetry-telem">ALTITUDE</span>
            <span class="telemetry-telem-spacer"></span>
            <span class="telemetry-telem">{telemetryValues.superHeavyAltitude}KM</span>
        </div>
        
        <div class="telemetry-line" style="left: 336px;"></div>
        <img class="telemetry-image" style="left: {telemetryValues.separated ? 385 : 390}px; transform: rotate({-telemetryValues.superHeavyAngle}rad);" src={telemetryValues.separated ? b9 : s25b9} alt="booster">
    </div>
</div>
<div style="position:fixed; left: 8px; bottom: 136px;">
    <Keybinds />
</div>
<div style="position:fixed; left: 76px; bottom: 136px;">
    <Settings />
</div>
<div class="telemetry-speedup-container">
    <input type="range" class="telemetry-speedup-slider" min={SceneConstants.SPEEDUP_MIN} max={SceneConstants.SPEEDUP_MAX} step={SceneConstants.SPEEDUP_STEP} bind:value={speedUp} on:input={setSpeedUp}>
    <div class="telemetry-speedup-number">{speedUp}X</div>    
</div>
<Restart />