import { Euler, Group, Object3D, Quaternion, Vector2, Vector3 } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { keyPresses, superHeavySettings, telemetry, toggles } from "../stores/ui-store";
import { LaunchConstants } from "../constants/objects/LaunchConstants";
import { Raptor } from "../structs/Raptor";
import { RaptorConstants } from "../constants/controls/RaptorConstants";
import { GridFin } from "../structs/GridFin";
import { GridFinConstants } from "../constants/controls/GridFinConstants";
import { LaunchHelper } from "../helpers/LaunchHelper";

export class SuperHeavy {
    public hsr: Group = new Group();
    public boosterRing: Group = new Group();
    public gridFins: Object3D[] = [];
    public gridFinObjs: Group[] = [];
    public chines: Object3D[] = [];
    public chineObjs: Group[] = [];
    public rSeas: Object3D[] = [];
    public rSeaObjs: Group[] = [];
    public outerCylinders: Object3D[] = [];
    public outerCylinderObjs: Group[] = [];
    public LOXFrost: Group = new Group();
    public CH4Frost: Group = new Group();

    public group: Group = null;

    public hasSetupSingle: boolean = false;
    public hasUpdatedAABB: boolean = false;

    public isEditing: boolean = false;
    public isEditingSelf: boolean = false;
    public isFueling: boolean = false;
    public hasStartedFueling: boolean = false;
    public isLaunching: boolean = false;
    public separated: boolean = false;
    public LOX: number = 0;
    public CH4: number = 0;

    public visibilityCooldown: number = SuperHeavyConstants.VISIBILITY_COOLDOWN;

    public runningStartupSequence: boolean = false;
    public completedStartupSequence: boolean = false;

    public controls: any = {
        isWPressed: false,
        isSPressed: false,
        isAPressed: false,
        isDPressed: false,
        isQPressed: false,
        isEPressed: false
    };

    public options: any = {
        gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET,
        chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET,
        rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1,
        rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2,
        rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3,

        hsrHeight: 1,
        boosterRingHeight: 1,
        chineHeightScale: 1,
        numChines: SuperHeavyConstants.NUM_CHINES,

        gridFinLengthScale: 1,
        gridFinWidthScale: 1,
        numGridFins: SuperHeavyConstants.NUM_GRID_FINS,

        rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1,
        numRSeas1: SuperHeavyConstants.NUM_R_SEAS_1,
        rSeaType1: SuperHeavyConstants.R_SEA_TYPE_1,
        canRSea1Gimbal: SuperHeavyConstants.CAN_R_SEA_1_GIMBAL,

        rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2,
        numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
        rSeaType2: SuperHeavyConstants.R_SEA_TYPE_2,
        canRSea2Gimbal: SuperHeavyConstants.CAN_R_SEA_2_GIMBAL,

        rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3,
        numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
        rSeaType3: SuperHeavyConstants.R_SEA_TYPE_3,
        canRSea3Gimbal: SuperHeavyConstants.CAN_R_SEA_3_GIMBAL
    };

    constructor() {
        this.setupMultiple();
        this.setupUpdator();
    }

    public setupMultiple(): void {
        this.gridFins = [];
        this.chines = [];
        this.rSeas = [];
        this.outerCylinders = [];
        this.setupGridFins();
        this.setupChines();
        this.setupRSeas();
        this.setupOuterCylinders();
    }

    public setupUpdator(): void {
        toggles.subscribe((value) => {
            this.isEditing = value.isEditing;
            this.isEditingSelf = value.isEditingSuperHeavy;
            this.isFueling = value.isFueling;
            this.hasStartedFueling = value.hasStartedFueling;
            this.isLaunching = value.isLaunching;
        });
        telemetry.subscribe((value) => {
            this.LOX = value.superHeavyLOX;
            this.CH4 = value.superHeavyCH4;
            this.separated = value.separated;
        });
        keyPresses.subscribe((value) => {
            this.controls.isWPressed = value.isWPressed;
            this.controls.isSPressed = value.isSPressed;
            this.controls.isAPressed = value.isAPressed;
            this.controls.isDPressed = value.isDPressed;
            this.controls.isQPressed = value.isQPressed;
            this.controls.isEPressed = value.isEPressed;
        });
        superHeavySettings.subscribe((value) => {
            this.options.gridFinAngularOffset = value.gridFinAngularOffset;
            this.options.chineAngularOffset = value.chineAngularOffset;
            this.options.rSeaAngularOffset1 = value.rSeaAngularOffset1;
            this.options.rSeaAngularOffset2 = value.rSeaAngularOffset2;
            this.options.rSeaAngularOffset3 = value.rSeaAngularOffset3;

            this.options.hsrHeight = value.hsrHeight;
            this.options.boosterRingHeight = value.boosterRingHeight;
            this.options.chineHeightScale = value.chineHeightScale;
            this.options.numChines = value.numChines;

            this.options.gridFinLengthScale = value.gridFinLengthScale;
            this.options.gridFinWidthScale = value.gridFinWidthScale;
            this.options.numGridFins = value.numGridFins;

            this.options.rSeaRadius1 = value.rSeaRadius1;
            this.options.numRSeas1 = value.numRSeas1;
            this.options.rSeaType1 = value.rSeaType1;
            this.options.canRSea1Gimbal = value.canRSea1Gimbal;

            this.options.rSeaRadius2 = value.rSeaRadius2;
            this.options.numRSeas2 = value.numRSeas2;
            this.options.rSeaType2 = value.rSeaType2;
            this.options.canRSea2Gimbal = value.canRSea2Gimbal;

            this.options.rSeaRadius3 = value.rSeaRadius3;
            this.options.numRSeas3 = value.numRSeas3;
            this.options.rSeaType3 = value.rSeaType3;
            this.options.canRSea3Gimbal = value.canRSea3Gimbal;

            this.setupMultiple();
            this.hasSetupSingle = false;
        });
    }

    public gimbalTest(delta: number): void {
        let rSeaGimbalingAngles1: number[] = [];
        let rSeaGimbalYs1: number[] = [];
        let rSeaGimbalingAngles2: number[] = [];
        let rSeaGimbalYs2: number[] = [];
        let rSeaGimbalingAngles3: number[] = [];
        let rSeaGimbalYs3: number[] = [];
        if (this.options.canRSea1Gimbal) {
            for (let i = 0; i < this.options.numRSeas1; i++) {
                let rSea = this.rSeas[i];
                if (rSea.userData.raptor != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.raptor.gimbalAngle == 0) {
                        rSea.userData.raptor.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.raptor.angleY = 0;
                    } else {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.raptor.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }

                    rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.raptor.gimbalAngle];
                    rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.raptor.angleY];
                }
            }
        }
        if (this.options.canRSea2Gimbal) {
            for (let i = 0; i < this.options.numRSeas2; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1];
                if (rSea.userData.raptor != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.raptor.gimbalAngle == 0) {
                        rSea.userData.raptor.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.raptor.angleY = 0;
                    } else {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.raptor.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }

                    rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.raptor.gimbalAngle];
                    rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.raptor.angleY];
                }
            }
        }
        if (this.options.canRSea3Gimbal) {
            for (let i = 0; i < this.options.numRSeas3; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                if (rSea.userData.raptor != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.raptor.gimbalAngle == 0) {
                        rSea.userData.raptor.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.raptor.angleY = 0;
                    } else {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.raptor.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }

                    rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.raptor.gimbalAngle];
                    rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.raptor.angleY];
                }
            }
        }

        telemetry.update((value) => {
            value.rSeaGimbalingAngles1 = rSeaGimbalingAngles1;
            value.rSeaGimbalYs1 = rSeaGimbalYs1;
            value.rSeaGimbalingAngles2 = rSeaGimbalingAngles2;
            value.rSeaGimbalYs2 = rSeaGimbalYs2;
            value.rSeaGimbalingAngles3 = rSeaGimbalingAngles3;
            value.rSeaGimbalYs3 = rSeaGimbalYs3;
            return value;
        });
    }

    public gridFinTest(): void {
        let gridFinAngles: number[] = [];

        for (let gridFin of this.gridFins) {
            if (gridFin.userData.gridFin.angle == GridFinConstants.MAX_ANGLE) {
                gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
            }
            else if (gridFin.userData.gridFin.angle == GridFinConstants.MIN_ANGLE) {
                gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
            }
        
            gridFinAngles = [...gridFinAngles, gridFin.userData.gridFin.angle];
        }
    }

    public controlGimbals(): void {
        let combinedVector: Vector2 = new Vector2(0, 0);
        if (this.controls.isWPressed) {
            combinedVector.y += 1;
        }
        if (this.controls.isSPressed) {
            combinedVector.y -= 1;
        }
        if (this.controls.isAPressed) {
            combinedVector.x += 1; // gimbal angle thing is broken so workaround
        }
        if (this.controls.isDPressed) {
            combinedVector.x -= 1; // gimbal angle thing is broken so workaround
        }
        let angleY: number = Math.atan2(combinedVector.y, combinedVector.x);
        let rSeaGimbalingAngles1: number[] = [];
        let rSeaGimbalYs1: number[] = [];
        let rSeaGimbalingAngles2: number[] = [];
        let rSeaGimbalYs2: number[] = [];
        let rSeaGimbalingAngles3: number[] = [];
        let rSeaGimbalYs3: number[] = [];
        if (combinedVector.length() > 0) {
            if (this.options.canRSea1Gimbal) {
                for (let i = 0; i < this.options.numRSeas1; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.raptor.angleY];
                    }
                }
            }
            if (this.options.canRSea2Gimbal) {
                for (let i = 0; i < this.options.numRSeas2; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.raptor.angleY];
                    }
                }
            }
            if (this.options.canRSea3Gimbal) {
                for (let i = 0; i < this.options.numRSeas3; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.raptor.angleY];
                    }
                }
            }
        }
        else {
            if (this.options.canRSea1Gimbal) {
                for (let i = 0; i < this.options.numRSeas1; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(0, 0);

                        rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.raptor.angleY];
                    }
                }
            }
            if (this.options.canRSea2Gimbal) {
                for (let i = 0; i < this.options.numRSeas2; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(0, 0);

                        rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.raptor.angleY];
                    }
                }
            }
            if (this.options.canRSea3Gimbal) {
                for (let i = 0; i < this.options.numRSeas3; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(0, 0);

                        rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.raptor.angleY];
                    }
                }
            }
        }
        telemetry.update((value) => {
            value.rSeaGimbalingAngles1 = rSeaGimbalingAngles1;
            value.rSeaGimbalYs1 = rSeaGimbalYs1;
            value.rSeaGimbalingAngles2 = rSeaGimbalingAngles2;
            value.rSeaGimbalYs2 = rSeaGimbalYs2;
            value.rSeaGimbalingAngles3 = rSeaGimbalingAngles3;
            value.rSeaGimbalYs3 = rSeaGimbalYs3;
            return value;
        });
    }

    public controlGridFins(): void {
        for (let gridFin of this.gridFins) {
            if (this.controls.isWPressed) {
                if (this.separated) {
                    if (gridFin.rotation.z >= -45 * Math.PI / 180 && gridFin.rotation.z <= 45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    if (gridFin.rotation.z >= 135 * Math.PI / 180 || gridFin.rotation.z <= -135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                }
                else {
                    if (gridFin.rotation.z >= -45 * Math.PI / 180 && gridFin.rotation.z <= 45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    if (gridFin.rotation.z >= 135 * Math.PI / 180 || gridFin.rotation.z <= -135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                }
            }
            else if (this.controls.isSPressed) {
                if (this.separated) {
                    if (gridFin.rotation.z >= -45 * Math.PI / 180 && gridFin.rotation.z <= 45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    if (gridFin.rotation.z >= 135 * Math.PI / 180 || gridFin.rotation.z <= -135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                }
                else {
                    if (gridFin.rotation.z >= -45 * Math.PI / 180 && gridFin.rotation.z <= 45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    if (gridFin.rotation.z >= 135 * Math.PI / 180 || gridFin.rotation.z <= -135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                }
            }
            else if (this.controls.isAPressed) {
                if (this.separated) {
                    if (gridFin.rotation.z >= 45 * Math.PI / 180 && gridFin.rotation.z <= 135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    if (gridFin.rotation.z >= -135 * Math.PI / 180 && gridFin.rotation.z <= -45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                }
                else {
                    if (gridFin.rotation.z >= 45 * Math.PI / 180 && gridFin.rotation.z <= 135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    if (gridFin.rotation.z >= -135 * Math.PI / 180 && gridFin.rotation.z <= -45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                }
            }
            else if (this.controls.isDPressed) {
                if (this.separated) {
                    if (gridFin.rotation.z >= 45 * Math.PI / 180 && gridFin.rotation.z <= 135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    if (gridFin.rotation.z >= -135 * Math.PI / 180 && gridFin.rotation.z <= -45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                }
                else {
                    if (gridFin.rotation.z >= 45 * Math.PI / 180 && gridFin.rotation.z <= 135 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    if (gridFin.rotation.z >= -135 * Math.PI / 180 && gridFin.rotation.z <= -45 * Math.PI / 180) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                }
            }
            else if (this.controls.isQPressed) {
                gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
            }
            else if (this.controls.isEPressed) {
                gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
            }
            else {
                gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
            }
        }
    }
    
    public runStartupSequence(delta: number): void {
        let rSeaThrottles1: number[] = [];
        let rSeaThrottles2: number[] = [];
        let rSeaThrottles3: number[] = [];

        let areAllRSea1Ready: boolean = true;
        for (let i = 0; i < this.options.numRSeas1; i++) {
            let rSea = this.rSeas[i];
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);

                rSeaThrottles1 = [...rSeaThrottles1, rSea.userData.raptor.throttle];
            }
            if (rSea.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                areAllRSea1Ready = false;
            }
        }
        if (areAllRSea1Ready) {
            let areAllRSea2Ready: boolean = true;
            for (let i = 0; i < this.options.numRSeas2; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1];
                if (rSea.userData.raptor != null) {
                    rSea.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);

                    rSeaThrottles2 = [...rSeaThrottles2, rSea.userData.raptor.throttle];
                }
                if (rSea.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                    areAllRSea2Ready = false;
                }
            }
            if (areAllRSea2Ready) {
                let areAllRSea3Ready: boolean = true;
                for (let i = 0; i < this.options.numRSeas3; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);

                        rSeaThrottles3 = [...rSeaThrottles3, rSea.userData.raptor.throttle];
                    }
                    if (rSea.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                        areAllRSea3Ready = false;
                    }
                }

                if (areAllRSea3Ready) {
                    this.runningStartupSequence = false;
                    this.completedStartupSequence = true;
                }
            }
        }

        telemetry.update((value) => {
            value.rSeaThrottles1 = rSeaThrottles1;
            value.rSeaThrottles2 = rSeaThrottles2;
            value.rSeaThrottles3 = rSeaThrottles3;
            return value;
        });
    }

    public getLOXVolume(perc: number = this.LOX): number {
        return MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, this.options.boosterRingHeight * SuperHeavyConstants.LOX_PERCENTAGE * perc);
    }

    public getCH4Volume(perc: number = this.CH4): number {
        return MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, this.options.boosterRingHeight * SuperHeavyConstants.CH4_PERCENTAGE * perc);
    }

    public getLOXMass(perc: number = this.LOX): number {
        return this.getLOXVolume(perc) * LaunchConstants.LOX_DENSITY;
    }

    public getCH4Mass(perc: number = this.CH4): number {
        return this.getCH4Volume(perc) * LaunchConstants.CH4_DENSITY;
    }

    public getDryMass(): number {
        return SuperHeavyConstants.HSR_DRY_MASS / (SuperHeavyConstants.HSR_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y) * this.options.hsrHeight + SuperHeavyConstants.BOOSTER_RING_DRY_MASS * this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y + SuperHeavyConstants.GRID_FIN_DRY_MASS * this.options.numGridFins * this.options.gridFinLengthScale * this.options.gridFinWidthScale + SuperHeavyConstants.CHINE_DRY_MASS * this.options.numChines * this.options.chineHeightScale + (this.options.numRSeas1 + this.options.numRSeas2 + this.options.numRSeas3) * RaptorConstants.DRY_MASS;
    }

    public getMass(): number {
        return this.getLOXMass() + this.getCH4Mass() + this.getDryMass();
    }

    public getWeight(altitude: number): number {
        return this.getMass() * LaunchHelper.getGEarth(altitude);
    }

    public getCenterofMass(): Vector3 {
        let totalMass: number = this.getMass();
        let centerOfMass: Vector3 = new Vector3(0, 0, 0);
        centerOfMass.addScaledVector(this.hsr.position, SuperHeavyConstants.HSR_DRY_MASS / (SuperHeavyConstants.HSR_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y) * this.options.hsrHeight / totalMass);
        centerOfMass.addScaledVector(this.boosterRing.position, SuperHeavyConstants.BOOSTER_RING_DRY_MASS * this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y / totalMass);
        for (let gridFin of this.gridFins) {
            centerOfMass.addScaledVector(gridFin.position, SuperHeavyConstants.GRID_FIN_DRY_MASS * this.options.gridFinLengthScale * this.options.gridFinWidthScale / totalMass);
        }
        for (let chine of this.chines) {
            centerOfMass.addScaledVector(chine.position, SuperHeavyConstants.CHINE_DRY_MASS * this.options.chineHeightScale / totalMass);
        }
        for (let rSea of this.rSeas) {
            centerOfMass.addScaledVector(rSea.position, RaptorConstants.DRY_MASS / totalMass);
        }
        centerOfMass.addScaledVector(this.CH4Frost.position, this.getCH4Mass() / totalMass);
        centerOfMass.addScaledVector(this.LOXFrost.position, this.getLOXMass() / totalMass);
        return centerOfMass;
    }

    public getTotalThrust(): number {
        let totalThrust: number = 0;
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                totalThrust += LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle;
            }
        }
        return totalThrust;
    }

    public getGimbaledThrust(): number {
        let totalThrust: number = 0;
        if (this.options.canRSea1Gimbal) {
            for (let i = 0; i < this.options.numRSeas1; i++) {
                let rSea = this.rSeas[i];
                if (rSea.userData.raptor != null) {
                    totalThrust += LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle;
                }
            }
        }
        if (this.options.canRSea2Gimbal) {
            for (let i = 0; i < this.options.numRSeas2; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1];
                if (rSea.userData.raptor != null) {
                    totalThrust += LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle;
                }
            }
        }
        if (this.options.canRSea3Gimbal) {
            for (let i = 0; i < this.options.numRSeas3; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                if (rSea.userData.raptor != null) {
                    totalThrust += LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle;
                }
            }
        }
        return totalThrust;
    }

    public getNonGimbaledThrust(): number {
        return this.getTotalThrust() - this.getGimbaledThrust();
    }

    public getRealTotalThrust(altitude: number): number {
        return this.getTotalThrust() - LaunchHelper.getThrustLoss(altitude) * (this.options.numRSeas1 + this.options.numRSeas2 + this.options.numRSeas3);
    }

    public getRealGimbaledThrust(altitude: number): number {
        let totalNumber: number = 0;
        if (this.options.canRSea1Gimbal) {
            totalNumber += this.options.numRSeas1;
        }
        if (this.options.canRSea2Gimbal) {
            totalNumber += this.options.numRSeas2;
        }
        if (this.options.canRSea3Gimbal) {
            totalNumber += this.options.numRSeas3;
        }
        return this.getGimbaledThrust() - LaunchHelper.getThrustLoss(altitude) * totalNumber;
    }

    public getRealNonGimbaledThrust(altitude: number): number {
        return this.getRealTotalThrust(altitude) - this.getRealGimbaledThrust(altitude);
    }

    public updateFuel(delta: number): void {
        if (this.isFueling && !this.hasStartedFueling) {
            telemetry.update((value) => {
                value.superHeavyCH4 = 0;
                value.superHeavyLOX = 0;

                return value;
            });
        }
        if (this.hasStartedFueling) {
            let CH4Volume: number = this.getCH4Volume(1);
            let LOXVolume: number = this.getLOXVolume(1);

            let CH4Rate: number = LaunchConstants.FUELING_RATE * LaunchConstants.FUELING_SPEEDUP * delta / CH4Volume;
            let LOXRate: number = LaunchConstants.FUELING_RATE * LaunchConstants.FUELING_SPEEDUP* delta / LOXVolume;

            if (this.CH4 < 1) {
                this.CH4 += CH4Rate;
            }
            else {
                this.CH4 = 1;
            }
            if (this.LOX < 1) {
                this.LOX += LOXRate;
            }
            else {
                this.LOX = 1;
            }

            telemetry.update((value) => {
                value.superHeavyCH4 = this.CH4;
                value.superHeavyLOX = this.LOX;
                return value;
            });
        }
        if (this.isLaunching) {
            let totalMassFlowCH4: number = 0;
            let totalMassFlowLOX: number = 0;
            for (let rSea of this.rSeas) {
                if (rSea.userData.raptor != null) {
                    totalMassFlowCH4 += RaptorConstants.MASS_FLOW_CH4 * rSea.userData.raptor.throttle;
                    totalMassFlowLOX += RaptorConstants.MASS_FLOW_LOX * rSea.userData.raptor.throttle;
                }
            }
            
            let CH4Rate: number = totalMassFlowCH4 / this.getCH4Mass(1) * delta;
            let LOXRate: number = totalMassFlowLOX / this.getLOXMass(1) * delta;

            if (this.CH4 > 0) {
                this.CH4 -= CH4Rate;
            }
            else {
                this.CH4 = 0;
            }

            if (this.LOX > 0) {
                this.LOX -= LOXRate;
            }
            else {
                this.LOX = 0;
            }

            telemetry.update((value) => {
                value.superHeavyCH4 = this.CH4;
                value.superHeavyLOX = this.LOX;
                return value;
            });
        }
        if (this.CH4Frost != null && this.LOXFrost != null) {
            if (this.CH4 == 0) {
                this.CH4Frost.visible = false;
            }
            else {
                this.CH4Frost.visible = true;
                this.CH4Frost.scale.y = this.CH4 / 100;
            }
            
            this.CH4Frost.scale.copy(SuperHeavyConstants.CRYOGENIC_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.CH4 * SuperHeavyConstants.CH4_PERCENTAGE * this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y, 1)));
            this.CH4Frost.position.copy(this.boosterRing.position.clone().add(new Vector3(0, SuperHeavyConstants.SUPER_HEAVY_SCALE.y * (SuperHeavyConstants.LOX_BOTTOM_PERCENTAGE + SuperHeavyConstants.LOX_PERCENTAGE + SuperHeavyConstants.CH4_BOTTOM_PERCENTAGE) * this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y, 0)));

            if (this.LOX == 0) {
                this.LOXFrost.visible = false;
            }
            else {
                this.LOXFrost.visible = true;
                this.LOXFrost.scale.y = this.LOX / 100;
            }

            this.LOXFrost.scale.copy(SuperHeavyConstants.CRYOGENIC_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.LOX * SuperHeavyConstants.LOX_PERCENTAGE * this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y, 1)));
            this.LOXFrost.position.copy(this.boosterRing.position.clone().add(new Vector3(0, SuperHeavyConstants.SUPER_HEAVY_SCALE.y * SuperHeavyConstants.LOX_BOTTOM_PERCENTAGE * this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y, 0)));
        }
    }

    public updateRaptors(delta: number): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.update(delta);

                rSea.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(rSea.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rSea.userData.raptor.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rSea.userData.raptor.gimbalAngle)))));
            }
        }
    }

    public updateGridFins(delta: number): void {
        for (let gridFin of this.gridFins) {
            if (gridFin.userData.gridFin != null) {
                gridFin.userData.gridFin.update(delta);

                gridFin.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(gridFin.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), gridFin.userData.gridFin.angle))));
            }
        }
    }

    public resetRaptors(): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.reset();
            }
        }
        telemetry.update((value) => {
            value.rSeaGimbalingAngles1 = [];
            value.rSeaGimbalYs1 = [];
            value.rSeaGimbalingAngles2 = [];
            value.rSeaGimbalYs2 = [];
            value.rSeaGimbalingAngles3 = [];
            value.rSeaGimbalYs3 = [];
            return value;
        });
    }

    public resetGridFins(): void {
        for (let gridFin of this.gridFins) {
            if (gridFin.userData.gridFin != null) {
                gridFin.userData.gridFin.reset();
            }
        }
    }

    public setupGridFins(): void {
        let gridFinPositions = MathHelper.getCircularPositions(this.options.numGridFins, SuperHeavyConstants.GRID_FIN_RADIUS * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.gridFinAngularOffset * Math.PI / 180);
        let gridFinRotations = MathHelper.getCircularRotations(this.options.numGridFins, this.options.gridFinAngularOffset * Math.PI / 180);

        for (let i = 0; i < this.options.numGridFins; i++) {
            let gridFin = new Object3D();
            gridFin.position.copy(gridFinPositions[i]);
            gridFin.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), SuperHeavyConstants.GRID_FIN_ROTATION.x).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), gridFinRotations[i].y + SuperHeavyConstants.GRID_FIN_ROTATION.z))));
            gridFin.scale.copy(SuperHeavyConstants.GRID_FIN_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(this.options.gridFinWidthScale, this.options.gridFinLengthScale, 1)));
            gridFin.userData.originalRotation = gridFin.rotation.clone();
            gridFin.userData.gridFin = new GridFin();
            this.gridFins = [...this.gridFins, gridFin];
        }
    }

    public setupChines(): void {
        let chinePositions = MathHelper.getCircularPositions(this.options.numChines, SuperHeavyConstants.CHINE_RADIUS * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.chineAngularOffset * Math.PI / 180);
        let chineRotations = MathHelper.getCircularRotations(this.options.numChines, this.options.chineAngularOffset * Math.PI / 180);

        for (let i = 0; i < this.options.numChines; i++) {
            let chine = new Object3D();
            chine.position.copy(chinePositions[i].clone().add(new Vector3(0, SuperHeavyConstants.CHINE_BOTTOM_OFFSET * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            chine.rotation.copy(new Euler(0, -chineRotations[i].y + SuperHeavyConstants.CHINE_ROTATION.y, 0));
            chine.scale.copy(SuperHeavyConstants.CHINE_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.options.chineHeightScale, 1)));
            this.chines = [...this.chines, chine];
        }
    }

    public setupRSeas(): void {
        let rSeaPositions1 = MathHelper.getCircularPositions(this.options.numRSeas1, this.options.rSeaRadius1 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x / SuperHeavyConstants.REAL_LIFE_SCALE.y, this.options.rSeaAngularOffset1 * Math.PI / 180);
        let rSeaRotations1 = MathHelper.getCircularRotations(this.options.numRSeas1, this.options.rSeaAngularOffset1 * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas1; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions1[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_1 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations1[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType1);

            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions2 = MathHelper.getCircularPositions(this.options.numRSeas2, this.options.rSeaRadius2 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x / SuperHeavyConstants.REAL_LIFE_SCALE.y, this.options.rSeaAngularOffset2 * Math.PI / 180);
        let rSeaRotations2 = MathHelper.getCircularRotations(this.options.numRSeas2, this.options.rSeaAngularOffset2 * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas2; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions2[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_2 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations2[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType2);

            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions3 = MathHelper.getCircularPositions(this.options.numRSeas3, this.options.rSeaRadius3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x / SuperHeavyConstants.REAL_LIFE_SCALE.y, this.options.rSeaAngularOffset3 * Math.PI / 180);
        let rSeaRotations3 = MathHelper.getCircularRotations(this.options.numRSeas3, this.options.rSeaAngularOffset3 * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas3; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions3[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations3[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType3);

            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupOuterCylinders(): void {
        if (this.options.rSeaRadius3 > SuperHeavyConstants.OUTER_CYLINDER_THRESHOLD) {
            let outerCylinderPositions = MathHelper.getCircularPositions(this.options.numRSeas3, (this.options.rSeaRadius3 / SuperHeavyConstants.REAL_LIFE_SCALE.y + SuperHeavyConstants.OUTER_CYLINDER_ADDITIONAL_RADIUS) * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.rSeaAngularOffset3 * Math.PI / 180);
            let outerCylinderRotations = MathHelper.getCircularRotations(this.options.numRSeas3, this.options.rSeaAngularOffset3 * Math.PI / 180);
            
            for (let i = 0; i < this.options.numRSeas3; i++) {
                let outerCylinder = new Object3D();
                outerCylinder.position.copy(outerCylinderPositions[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y + SuperHeavyConstants.OUTER_CYLINDER_ADDITONAL_HEIGHT * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
                outerCylinder.rotation.copy(outerCylinderRotations[i]);
                outerCylinder.scale.copy(SuperHeavyConstants.OUTER_CYLINDER_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
                this.outerCylinders = [...this.outerCylinders, outerCylinder];
            }
        }
    }

    public setupSingle(): void {
        if (this.hsr != null && this.boosterRing != null) {
            this.hsr.userData.aabb = null;
            this.boosterRing.userData.aabb = null;
            this.hasUpdatedAABB = false;

            this.hsr.scale.copy(SuperHeavyConstants.HSR_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, (this.options.hsrHeight < SuperHeavyConstants.MIN_HSR_HEIGHT ? SuperHeavyConstants.MIN_HSR_HEIGHT : this.options.hsrHeight) / (SuperHeavyConstants.HSR_HEIGHT * SuperHeavyConstants.REAL_LIFE_SCALE.y), 1)));
            this.boosterRing.scale.copy(SuperHeavyConstants.BOOSTER_RING_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.options.boosterRingHeight / SuperHeavyConstants.REAL_LIFE_SCALE.y, 1)));
            this.hasSetupSingle = true;
        }
    }

    public updateAABB(): void {
        if (this.hsr != null && this.boosterRing != null) {
            if (this.hsr.userData.aabb == null || this.boosterRing.userData.aabb == null || this.hsr.userData.aabb.getSize(new Vector3).length() == 0 || this.boosterRing.userData.aabb.getSize(new Vector3).length() == 0) {
                this.hsr.userData.aabb = ObjectHelper.getAabb(this.hsr);
                this.boosterRing.userData.aabb = ObjectHelper.getAabb(this.boosterRing);
            }
        }
        for (let gridFinObj of this.gridFinObjs) {
            if (gridFinObj.userData.aabb == null || gridFinObj.userData.aabb.getSize(new Vector3).length() == 0) {
                gridFinObj.userData.aabb = ObjectHelper.getAabb(gridFinObj);
            }
        }
        for (let chineObj of this.chineObjs) {
            if (chineObj.userData.aabb == null || chineObj.userData.aabb.getSize(new Vector3).length() == 0) {
                chineObj.userData.aabb = ObjectHelper.getAabb(chineObj);
            }
        }
        for (let rSeaObj of this.rSeaObjs) {
            if (rSeaObj.userData.aabb == null || rSeaObj.userData.aabb.getSize(new Vector3).length() == 0) {
                rSeaObj.userData.aabb = ObjectHelper.getAabb(rSeaObj);
            }
        }
    }

    public updateObjects(delta: number): void {
        if (this.hsr != null && this.boosterRing != null && this.hsr.userData.aabb.getSize(new Vector3).length() != 0 && this.boosterRing.userData.aabb.getSize(new Vector3).length() != 0) {
            this.hsr.position.copy(this.boosterRing.position.clone().add(new Vector3(0, this.boosterRing.userData.aabb.getSize(new Vector3).y, 0)));
            for (let gridFin of this.gridFins) {
                if (gridFin.userData.aabb.getSize(new Vector3).length() != 0) {
                    gridFin.position.copy(new Vector3(gridFin.position.x, this.boosterRing.position.y + this.boosterRing.userData.aabb.getSize(new Vector3).y - SuperHeavyConstants.GRID_FIN_TOP_OFFSET * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, gridFin.position.z));
                }
            }
            this.hasUpdatedAABB = true;
        }

        if (this.isEditing) {
            this.gimbalTest(delta);
            this.gridFinTest();
        }
        if (this.isFueling) {
            this.resetRaptors();
            this.resetGridFins();
        }
        if (this.isEditingSelf) {
            if (this.visibilityCooldown > 0) {
                this.visibilityCooldown -= delta;
            }
            if (this.visibilityCooldown <= 0) {
                this.group.visible = !this.group.visible;
                this.visibilityCooldown = SuperHeavyConstants.VISIBILITY_COOLDOWN;
            }
        }
        else {
            this.group.visible = true;
            this.visibilityCooldown = SuperHeavyConstants.VISIBILITY_COOLDOWN;
        }
        if (this.isLaunching) {
            this.controlGimbals();
            this.controlGridFins();
        }
        this.updateFuel(delta);
        this.updateRaptors(delta);
        this.updateGridFins(delta);
    }

    public updateScene(delta: number): void {
        if (!this.hasSetupSingle) {
            this.setupSingle();
        }
        else {
            this.updateAABB();
            this.updateObjects(delta);
        }
    }
}