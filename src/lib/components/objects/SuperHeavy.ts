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
import { FlightController } from "../controllers/FlightController";
import { CelestialConstants } from "../constants/CelestialConstants";
import { LandingController } from "../controllers/LandingController";

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

    public startStartupSequence: boolean = false;

    public startMECOSequence: boolean = false;
    public endMECOSequence: boolean = false;

    public startSepGridFinSequence: boolean = false;

    public startBoostbackSequence: boolean = false;
    public endBoostbackSequence: boolean = false;

    public startBoostbackShutdownSequence: boolean = false;
    public endBoostbackShutdownSequence: boolean = false;

    public startLandingSequence: boolean = false;
    public endLandingSequence: boolean = false;
    
    public flightController: FlightController = null;

    public doneLandingSetup: boolean = false;
    public passedStableInner: boolean = false;
    public landingController: LandingController = null;
    public landingPosition: Vector3 = new Vector3(0, 0, 0);
    public landingRotation: Quaternion = new Quaternion();

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

    public getLOXVolume(perc: number = this.LOX): number {
        let useableHeight: number = this.options.boosterRingHeight - (SuperHeavyConstants.LOX_BOTTOM_FIXED + SuperHeavyConstants.CH4_TOP_FIXED + SuperHeavyConstants.LOX_CH4_GAP_FIXED) * LaunchConstants.REAL_LIFE_SCALE.y;
        return MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, useableHeight * SuperHeavyConstants.LOX_PERCENTAGE * perc);
    }

    public getCH4Volume(perc: number = this.CH4): number {
        let useableHeight: number = this.options.boosterRingHeight - (SuperHeavyConstants.LOX_BOTTOM_FIXED + SuperHeavyConstants.CH4_TOP_FIXED + SuperHeavyConstants.LOX_CH4_GAP_FIXED) * LaunchConstants.REAL_LIFE_SCALE.y;
        return MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, useableHeight * SuperHeavyConstants.CH4_PERCENTAGE * perc);
    }

    public getLOXMass(perc: number = this.LOX): number {
        return this.getLOXVolume(perc) * LaunchConstants.LOX_DENSITY;
    }

    public getCH4Mass(perc: number = this.CH4): number {
        return this.getCH4Volume(perc) * LaunchConstants.CH4_DENSITY;
    }

    public getDryMass(): number {
        return SuperHeavyConstants.HSR_DRY_MASS * this.options.hsrHeight / (SuperHeavyConstants.HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y) + SuperHeavyConstants.BOOSTER_RING_DRY_MASS * this.options.boosterRingHeight / LaunchConstants.REAL_LIFE_SCALE.y + SuperHeavyConstants.GRID_FIN_DRY_MASS * this.options.numGridFins * this.options.gridFinLengthScale * this.options.gridFinWidthScale + SuperHeavyConstants.CHINE_DRY_MASS * this.options.numChines * this.options.chineHeightScale + (this.options.numRSeas1 + this.options.numRSeas2 + this.options.numRSeas3) * RaptorConstants.DRY_MASS;
    }

    public getMass(): number {
        return this.getLOXMass() + this.getCH4Mass() + this.getDryMass();
    }

    public getWeight(altitude: number): number {
        return this.getMass() * LaunchHelper.getGEarth(altitude);
    }

    public getCOM(): Vector3 { // this is real life scale so that it is accurate in the flightcontroller. The position addition number will have to be scaled down after it is rotated and moved to the correct position
        let COM: Vector3 = new Vector3(0, 0, 0);
        COM.add(new Vector3(0, this.hsr.position.y / SuperHeavyConstants.SUPER_HEAVY_SCALE.y * LaunchConstants.REAL_LIFE_SCALE.y + this.options.hsrHeight / 2, 0).multiplyScalar(SuperHeavyConstants.HSR_DRY_MASS * this.options.hsrHeight));
        COM.add(new Vector3(0, this.options.boosterRingHeight / 2, 0).multiplyScalar(SuperHeavyConstants.BOOSTER_RING_DRY_MASS));
        for (let gridFin of this.gridFins) {
            COM.add(gridFin.position.clone().divide(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiplyScalar(SuperHeavyConstants.GRID_FIN_DRY_MASS * this.options.gridFinLengthScale * this.options.gridFinWidthScale));
        }
        for (let chine of this.chines) {
            COM.add(chine.position.clone().divide(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(SuperHeavyConstants.CHINE_DRY_MASS * this.options.chineHeightScale));
        }
        for (let rSea of this.rSeas) {
            COM.add(rSea.position.clone().divide(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(RaptorConstants.DRY_MASS));
        }
        COM.add(new Vector3(0, this.LOXFrost.position.y / SuperHeavyConstants.SUPER_HEAVY_SCALE.y * LaunchConstants.REAL_LIFE_SCALE.y + this.options.boosterRingHeight * SuperHeavyConstants.LOX_PERCENTAGE / 2, 0).multiplyScalar(this.getLOXMass()));
        COM.add(new Vector3(0, this.CH4Frost.position.y / SuperHeavyConstants.SUPER_HEAVY_SCALE.y * LaunchConstants.REAL_LIFE_SCALE.y + this.options.boosterRingHeight * SuperHeavyConstants.CH4_PERCENTAGE / 2, 0).multiplyScalar(this.getCH4Mass()));
        return COM.divide(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(SuperHeavyConstants.SUPER_HEAVY_SCALE_VALUE).multiplyScalar(CelestialConstants.REAL_SCALE).divideScalar(this.getMass());
    }

    public getMOIRoll(): number {
        return 1/2 * this.getMass() * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, 2);
    }

    public getMOIPitchYaw(): number {
        return 1/4 * this.getMass() * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, 2) + 1/12 * this.getMass() * Math.pow(this.options.boosterRingHeight * LaunchConstants.REAL_LIFE_SCALE.y, 2);
    }

    public getThrustVector(altitude: number): Vector3 {
        let F: Vector3 = new Vector3(0, 0, 0);
        for (let i = 0; i < this.options.numRSeas1; i++) {
            let rSea = this.rSeas[i];
            if (rSea.userData.raptor != null) {
                F.add(new Vector3(0, LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle * (1 -  LaunchHelper.getThrustLoss(altitude)), 0).applyQuaternion(rSea.quaternion));
            }
        }
        for (let i = 0; i < this.options.numRSeas2; i++) {
            let rSea = this.rSeas[i + this.options.numRSeas1];
            if (rSea.userData.raptor != null) {
                F.add(new Vector3(0, LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle * (1 -  LaunchHelper.getThrustLoss(altitude)), 0).applyQuaternion(rSea.quaternion));
            }
        }
        for (let i = 0; i < this.options.numRSeas3; i++) {
            let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
            if (rSea.userData.raptor != null) {
                F.add(new Vector3(0, LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle * (1 -  LaunchHelper.getThrustLoss(altitude)), 0).applyQuaternion(rSea.quaternion));
            }
        }
        return F;
    }

    public getThrustTorque(COM: Vector3, altitude: number): Vector3 {
        let R = new Vector3(0, SuperHeavyConstants.R_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y, 0).sub(COM);
        let F: Vector3 = this.getThrustVector(altitude);
        return R.clone().cross(F);
    }

    public getGridFinPitchYawTorque(rotation: Quaternion, velocity: Vector3, COM: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot < 0) dot = -dot;
        let generic_R = new Vector3(0, this.options.boosterRingHeight - SuperHeavyConstants.GRID_FIN_TOP_OFFSET * LaunchConstants.REAL_LIFE_SCALE.y, 0).sub(COM);
        let T: Vector3 = new Vector3(0, 0, 0);
        for (let gridFin of this.gridFins) {
            let R: Vector3 = generic_R.clone().add(new Vector3(0, 0, SuperHeavyConstants.GRID_FIN_SURFACE_RADIUS).applyEuler(new Euler(0, gridFin.rotation.z, 0)));
            let forceScalar: number = dot * gridFin.userData.gridFin.angle * GridFinConstants.FORCE_MULTIPLIER * (1 - LaunchHelper.getGridFinForceLoss(altitude)) * velocity.length();
            let forceDirection: Euler = new Euler(0, gridFin.rotation.z, 0);
            let force: Vector3 = new Vector3(forceScalar, 0, 0).applyEuler(forceDirection);
            force.x = -force.x;
            T.add(R.clone().cross(force));
        }
        return T;
    }

    public getGridFinRollTorque(rotation: Quaternion, velocity: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot < 0) dot = -dot;
        let generic_R = new Vector3(0, 0, SuperHeavyConstants.GRID_FIN_SURFACE_RADIUS);
        let T: Vector3 = new Vector3(0, 0, 0);
        for (let gridFin of this.gridFins) {
            let R: Vector3 = generic_R.clone().applyEuler(new Euler(0, gridFin.rotation.z, 0));
            let forceScalar: number = dot * gridFin.userData.gridFin.angle * GridFinConstants.FORCE_MULTIPLIER * (1 - LaunchHelper.getGridFinForceLoss(altitude)) * velocity.length();
            let forceDirection: Euler = new Euler(0, gridFin.rotation.z, 0);
            let force: Vector3 = new Vector3(forceScalar, 0, 0).applyEuler(forceDirection);
            force.negate();
            T.add(R.clone().cross(force));
        }
        return T;
    }

    public getDragVector(rotation: Quaternion, velocity: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        // basically it starts at 0 at the edges, and peaks at 1 in the middle
        let topSA: number = Math.PI * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2, 2); // pi * r^2
        let sideSA: number = Math.PI * SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2 * this.options.boosterRingHeight; // 2 * pi * r * h / 2 since it is a cylinder and we are only looking at one side
        let SA: number = dot * (sideSA - topSA) + topSA;
        let forceScalar: number = -LaunchHelper.getDragForce(velocity, SA, velocity.length(), LaunchConstants.DRAG_FORCE_COEF, altitude);
        return velocity.clone().normalize().multiplyScalar(forceScalar);
    }

    public getDragPitchYawTorque(rotation: Quaternion, velocity: Vector3, angVel: Vector3, COM: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let angVelPitch: number = angVel.x;
        let angVelYaw: number = angVel.z;
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        // basically it starts at 0 at the edges, and peaks at 1 in the middle
        let topSA: number = Math.PI * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2, 2); // pi * r^2
        let sideSA: number = Math.PI * SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2 * this.options.boosterRingHeight; // 2 * pi * r * h / 2 since it is a cylinder and we are only looking at one side
        let SA: number = dot * (sideSA - topSA) + topSA;
        let pitchForceScalar: number = -LaunchHelper.getDragForce(velocity, SA, angVelPitch, LaunchConstants.DRAG_PITCH_YAW_FORCE_COEF, altitude);
        let yawForceScalar: number = -LaunchHelper.getDragForce(velocity, SA, angVelYaw, LaunchConstants.DRAG_PITCH_YAW_FORCE_COEF, altitude);
        return new Vector3(pitchForceScalar * COM.length(), 0, yawForceScalar * COM.length());
    }

    public getDragRollTorque(rotation: Quaternion, velocity: Vector3, angVel: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let angVelRoll: number = angVel.y;
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        // basically it starts at 0 at the edges, and peaks at 1 in the middle
        let topSA: number = Math.PI * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2, 2); // pi * r^2
        let sideSA: number = Math.PI * SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2 * this.options.boosterRingHeight; // 2 * pi * r * h / 2 since it is a cylinder and we are only looking at one side
        let SA: number = dot * (sideSA - topSA) + topSA;
        let forceScalar: number = -LaunchHelper.getDragForce(velocity, SA, angVelRoll, LaunchConstants.DRAG_FORCE_COEF, altitude);
        return new Vector3(0, forceScalar * SuperHeavyConstants.BOOSTER_RING_SCALE.x / 2, 0);
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
            
            let useableHeight: number = this.options.boosterRingHeight / LaunchConstants.REAL_LIFE_SCALE.y - SuperHeavyConstants.LOX_BOTTOM_FIXED - SuperHeavyConstants.CH4_TOP_FIXED - SuperHeavyConstants.LOX_CH4_GAP_FIXED;

            this.CH4Frost.scale.copy(SuperHeavyConstants.CRYOGENIC_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.CH4 * SuperHeavyConstants.CH4_PERCENTAGE * useableHeight, 1)));
            this.CH4Frost.position.copy(this.boosterRing.position.clone().add(new Vector3(0, SuperHeavyConstants.SUPER_HEAVY_SCALE.y * (SuperHeavyConstants.LOX_BOTTOM_FIXED + SuperHeavyConstants.LOX_PERCENTAGE * useableHeight + SuperHeavyConstants.LOX_CH4_GAP_FIXED), 0)));

            if (this.LOX == 0) {
                this.LOXFrost.visible = false;
            }
            else {
                this.LOXFrost.visible = true;
                this.LOXFrost.scale.y = this.LOX / 100;
            }

            this.LOXFrost.scale.copy(SuperHeavyConstants.CRYOGENIC_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.LOX * SuperHeavyConstants.LOX_PERCENTAGE * useableHeight, 1)));
            this.LOXFrost.position.copy(this.boosterRing.position.clone().add(new Vector3(0, SuperHeavyConstants.SUPER_HEAVY_SCALE.y * SuperHeavyConstants.LOX_BOTTOM_FIXED, 0)));
        }
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
    }

    public gridFinTest(): void {
        for (let gridFin of this.gridFins) {
            if (gridFin.userData.gridFin.angle == GridFinConstants.MAX_ANGLE) {
                gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
            }
            else if (gridFin.userData.gridFin.angle == GridFinConstants.MIN_ANGLE) {
                gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
            }
        }
    }

    public controlRaptors(): void {
        if (!this.startLandingSequence) {
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
            if (combinedVector.length() > 0) {
                if (this.options.canRSea1Gimbal) {
                    for (let i = 0; i < this.options.numRSeas1; i++) {
                        let rSea = this.rSeas[i];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);
                        }
                    }
                }
                if (this.options.canRSea2Gimbal) {
                    for (let i = 0; i < this.options.numRSeas2; i++) {
                        let rSea = this.rSeas[i + this.options.numRSeas1];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);
                        }
                    }
                }
                if (this.options.canRSea3Gimbal) {
                    for (let i = 0; i < this.options.numRSeas3; i++) {
                        let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);
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
                        }
                    }
                }
                if (this.options.canRSea2Gimbal) {
                    for (let i = 0; i < this.options.numRSeas2; i++) {
                        let rSea = this.rSeas[i + this.options.numRSeas1];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setGimbalTarget(0, 0);
                        }
                    }
                }
                if (this.options.canRSea3Gimbal) {
                    for (let i = 0; i < this.options.numRSeas3; i++) {
                        let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setGimbalTarget(0, 0);
                        }
                    }
                }
            }
        }
    }

    public controlGridFins(): void {
        let isWPressed: boolean = this.controls.isWPressed;
        let isSPressed: boolean = this.controls.isSPressed;
        let isAPressed: boolean = this.controls.isAPressed;
        let isDPressed: boolean = this.controls.isDPressed;
        let isQPressed: boolean = this.controls.isQPressed;
        let isEPressed: boolean = this.controls.isEPressed;

        if (this.controls.isWPressed && this.controls.isSPressed) {
            isWPressed = false;
            isSPressed = false;
        }
        if (this.controls.isAPressed && this.controls.isDPressed) {
            isAPressed = false;
            isDPressed = false;
        }
        if (this.controls.isQPressed && this.controls.isEPressed) {
            isQPressed = false;
            isEPressed = false;
        }

        if (this.startSepGridFinSequence) {
            isWPressed = true;
        }

        for (let gridFin of this.gridFins) {
            if (isWPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= -45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= 135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= -45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else if (gridFin.rotation.z >= 135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isSPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= -45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= 135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= -45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else if (gridFin.rotation.z >= 135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isAPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= 45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= -135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= -45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= 45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else if (gridFin.rotation.z >= -135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= -45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isDPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= 45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= -135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= -45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= 45 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 135 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else if (gridFin.rotation.z >= -135 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= -45 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isQPressed) {
                // if (this.separated) {
                    // gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                // }
                // else {
                    gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                // }
            }
            else if (isEPressed) {
                // if (this.separated) {
                    // gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                // }
                // else {
                    gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                // }
            }
            else {
                gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
            }
            
            if (isWPressed && isAPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= 0 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= 180 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= 0 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else if (gridFin.rotation.z >= 180 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isSPressed && isDPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= 0 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= 180 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= 0 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else if (gridFin.rotation.z >= 180 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -90 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isWPressed && isDPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= 90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -180 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= -90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 0 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= 90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -180 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else if (gridFin.rotation.z >= -90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 0 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
            else if (isSPressed && isAPressed) {
                // if (this.separated) {
                    // if (gridFin.rotation.z >= 90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -180 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    // }
                    // else if (gridFin.rotation.z >= -90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 0 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    // }
                    // else {
                    //     gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    // }
                // }
                // else {
                    if (gridFin.rotation.z >= 90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY || gridFin.rotation.z <= -180 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MAX_ANGLE);
                    }
                    else if (gridFin.rotation.z >= -90 * Math.PI / 180 - SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY && gridFin.rotation.z <= 0 * Math.PI / 180 + SuperHeavyConstants.GRID_FIN_ANGLE_LEEWAY) {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.MIN_ANGLE);
                    }
                    else {
                        gridFin.userData.gridFin.setTarget(GridFinConstants.NEUTRAL_ANGLE);
                    }
                // }
            }
        }
    }

    public runForceShutdown(): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(0);
            }
        }
    }
    
    public runStartupSequence(): void {
        let areAllRSea1Ready: boolean = true;
        for (let i = 0; i < this.options.numRSeas1; i++) {
            let rSea = this.rSeas[i];
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);
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
                    }
                    if (rSea.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                        areAllRSea3Ready = false;
                    }
                }

                if (areAllRSea3Ready) {
                    this.startStartupSequence = false;
                }
            }
        }
    }

    public runMECOSequence(): void {
        let areAllRSea3Ready: boolean = true;
        for (let i = 0; i < this.options.numRSeas3; i++) {
            let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(0);
            }
            if (rSea.userData.raptor.throttle != 0) {
                areAllRSea3Ready = false;
            }
        }
        if (areAllRSea3Ready) {
            let areAllRSea2Ready: boolean = true;
            for (let i = 0; i < this.options.numRSeas2; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1];
                if (rSea.userData.raptor != null) {
                    rSea.userData.raptor.setThrottleTarget(0);
                }
                if (rSea.userData.raptor.throttle != 0) {
                    areAllRSea2Ready = false;
                }
            }
            if (areAllRSea2Ready) {
                if (this.options.hsrHeight > SuperHeavyConstants.MIN_HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y) {
                    this.startMECOSequence = false;
                    this.endMECOSequence = true;
                    // this.startSepGridFinSequence = true;
                }
                else {
                    let areAllRSea1Ready: boolean = true;
                    for (let i = 0; i < this.options.numRSeas1; i++) {
                        let rSea = this.rSeas[i];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setThrottleTarget(0);
                        }
                        if (rSea.userData.raptor.throttle != 0) {
                            areAllRSea1Ready = false;
                        }
                    }
    
                    if (areAllRSea1Ready) {
                        this.startMECOSequence = false;
                        this.endMECOSequence = true;
                        // this.startSepGridFinSequence = true;
                    }   
                }
            }
        }
    }

    public runBoostbackSequence(): void {
        let areAllRSea1Ready: boolean = true;
        for (let i = 0; i < this.options.numRSeas1; i++) {
            let rSea = this.rSeas[i];
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);
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
                }
                if (rSea.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                    areAllRSea2Ready = false;
                }
            }
            if (areAllRSea2Ready) {
                this.startBoostbackSequence = false;
                this.endBoostbackSequence = true;
            }
        }
    }

    public runBoostbackShutdownSequence(): void {
        let areAllRSea2Ready: boolean = true;
        for (let i = 0; i < this.options.numRSeas2; i++) {
            let rSea = this.rSeas[i + this.options.numRSeas1];
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(0);
            }
            if (rSea.userData.raptor.throttle != 0) {
                areAllRSea2Ready = false;
            }
        }
        if (areAllRSea2Ready) {
            let areAllRSea1Ready: boolean = true;
            for (let i = 0; i < this.options.numRSeas1; i++) {
                let rSea = this.rSeas[i];
                if (rSea.userData.raptor != null) {
                    rSea.userData.raptor.setThrottleTarget(0);
                }
                if (rSea.userData.raptor.throttle != 0) {
                    areAllRSea1Ready = false;
                }
            }

            if (areAllRSea1Ready) {
                this.startBoostbackShutdownSequence = false;
                this.endBoostbackShutdownSequence = true;
            }
        }
    }

    public runLandingSequence(delta: number): void {
        if (!this.doneLandingSetup) {
            this.landingPosition = this.flightController.position.clone().normalize().multiplyScalar(CelestialConstants.EARTH_EFFECTIVE_RADIUS * CelestialConstants.REAL_SCALE);
            this.landingRotation = MathHelper.getAngleBetweenVectors(this.landingPosition, new Vector3(0, 1, 0));
            this.landingController = new LandingController(new Vector3(), new Vector3());
            this.doneLandingSetup = true;
        }
        else {
            let relPosition: Vector3 = this.flightController.position.clone().sub(this.landingPosition.clone()).applyQuaternion(this.landingRotation);
            this.landingController.update(relPosition, this.flightController.angularVelocity, this.getMass(), this.getMOIPitchYaw(), this.getMOIRoll(), delta);
            let thrust: number = this.landingController.getThrust();
            let rSea1Thrust: number = LaunchHelper.getThrust(true, this.options.rSeaType1)
            let rSea2Thrust: number = (rSea1Thrust + LaunchHelper.getThrust(true, this.options.rSeaType2)) / 2;
            let throttle1: number = (thrust / this.options.numRSeas1) / rSea1Thrust;
            let throttle2: number = (thrust / (this.options.numRSeas1 + this.options.numRSeas2)) / rSea2Thrust;
            throttle1 = MathHelper.clamp(throttle1, 0, 1);
            throttle2 = MathHelper.clamp(throttle2, 0, 1);
            if (this.passedStableInner) {
                if (throttle2 >= RaptorConstants.MIN_THROTTLE) {
                    this.passedStableInner = false;
                }
            }
            // console.log(relPosition.y, this.landingController.getThrust(), throttle1, throttle2);
            if (thrust > rSea1Thrust * this.options.numRSeas1 && throttle2 >= RaptorConstants.MIN_THROTTLE && !this.passedStableInner) {
                for (let i = 0; i < this.options.numRSeas1; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setThrottleTarget(throttle2);
                    }
                }
                for (let i = 0; i < this.options.numRSeas2; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setThrottleTarget(throttle2);
                    }
                }
            }
            else {
                for (let i = 0; i < this.options.numRSeas1; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setThrottleTarget(throttle1);
                    }
                }
                if (throttle1 >= RaptorConstants.STABLE_THROTTLE) {
                    this.passedStableInner = true;
                    for (let i = 0; i < this.options.numRSeas2; i++) {
                        let rSea = this.rSeas[i + this.options.numRSeas1];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setThrottleTarget(0);
                        }
                    }
                }
                else {
                    for (let i = 0; i < this.options.numRSeas2; i++) {
                        let rSea = this.rSeas[i + this.options.numRSeas1];
                        if (rSea.userData.raptor != null) {
                            rSea.userData.raptor.setThrottleTarget(throttle2);
                        }
                    }
                }
            }
        }
    }

    public updateRaptors(delta: number): void {
        let rSeaGimbalingAngles1: number[] = [];
        let rSeaGimbalYs1: number[] = [];
        let rSeaGimbalingAngles2: number[] = [];
        let rSeaGimbalYs2: number[] = [];
        let rSeaGimbalingAngles3: number[] = [];
        let rSeaGimbalYs3: number[] = [];

        let rSeaThrottles1: number[] = [];
        let rSeaThrottles2: number[] = [];
        let rSeaThrottles3: number[] = [];

        for (let i = 0; i < this.rSeas.length; i++) {
            let rSea = this.rSeas[i];
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.update(delta);

                rSea.quaternion.copy(new Quaternion().setFromEuler(rSea.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rSea.userData.raptor.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rSea.userData.raptor.gimbalAngle))));
            
                if (i < this.options.numRSeas1) {
                    if (this.options.canRSea1Gimbal) {
                        rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.raptor.angleY];
                    }
                    rSeaThrottles1 = [...rSeaThrottles1, rSea.userData.raptor.throttle];
                }
                else if (i < this.options.numRSeas1 + this.options.numRSeas2) {
                    if (this.options.canRSea2Gimbal) {
                        rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.raptor.angleY];
                    }
                    rSeaThrottles2 = [...rSeaThrottles2, rSea.userData.raptor.throttle];
                }
                else {
                    if (this.options.canRSea3Gimbal) {
                        rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.raptor.angleY];
                    }
                    rSeaThrottles3 = [...rSeaThrottles3, rSea.userData.raptor.throttle];
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

            value.rSeaThrottles1 = rSeaThrottles1;
            value.rSeaThrottles2 = rSeaThrottles2;
            value.rSeaThrottles3 = rSeaThrottles3;
            return value;
        });
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
        let rSeaPositions1 = MathHelper.getCircularPositions(this.options.numRSeas1, this.options.rSeaRadius1 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x / LaunchConstants.REAL_LIFE_SCALE.y, this.options.rSeaAngularOffset1 * Math.PI / 180);
        let rSeaRotations1 = MathHelper.getCircularRotations(this.options.numRSeas1, this.options.rSeaAngularOffset1 * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas1; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions1[i].clone().add(new Vector3(0, SuperHeavyConstants.R_HEIGHT * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations1[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType1);

            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions2 = MathHelper.getCircularPositions(this.options.numRSeas2, this.options.rSeaRadius2 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x / LaunchConstants.REAL_LIFE_SCALE.y, this.options.rSeaAngularOffset2 * Math.PI / 180);
        let rSeaRotations2 = MathHelper.getCircularRotations(this.options.numRSeas2, this.options.rSeaAngularOffset2 * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas2; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions2[i].clone().add(new Vector3(0, SuperHeavyConstants.R_HEIGHT * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations2[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType2);

            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions3 = MathHelper.getCircularPositions(this.options.numRSeas3, this.options.rSeaRadius3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x / LaunchConstants.REAL_LIFE_SCALE.y, this.options.rSeaAngularOffset3 * Math.PI / 180);
        let rSeaRotations3 = MathHelper.getCircularRotations(this.options.numRSeas3, this.options.rSeaAngularOffset3 * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas3; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions3[i].clone().add(new Vector3(0, SuperHeavyConstants.R_HEIGHT * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations3[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType3);

            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupOuterCylinders(): void {
        if (this.options.rSeaRadius3 > SuperHeavyConstants.OUTER_CYLINDER_THRESHOLD) {
            let outerCylinderPositions = MathHelper.getCircularPositions(this.options.numRSeas3, (this.options.rSeaRadius3 / LaunchConstants.REAL_LIFE_SCALE.y + SuperHeavyConstants.OUTER_CYLINDER_ADDITIONAL_RADIUS) * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.rSeaAngularOffset3 * Math.PI / 180);
            let outerCylinderRotations = MathHelper.getCircularRotations(this.options.numRSeas3, this.options.rSeaAngularOffset3 * Math.PI / 180);
            
            for (let i = 0; i < this.options.numRSeas3; i++) {
                let outerCylinder = new Object3D();
                outerCylinder.position.copy(outerCylinderPositions[i].clone().add(new Vector3(0, SuperHeavyConstants.R_HEIGHT * SuperHeavyConstants.SUPER_HEAVY_SCALE.y + SuperHeavyConstants.OUTER_CYLINDER_ADDITONAL_HEIGHT * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
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

            this.hsr.scale.copy(SuperHeavyConstants.HSR_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, (this.options.hsrHeight < SuperHeavyConstants.MIN_HSR_HEIGHT ? SuperHeavyConstants.MIN_HSR_HEIGHT : this.options.hsrHeight) / (SuperHeavyConstants.HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y), 1)));
            this.boosterRing.scale.copy(SuperHeavyConstants.BOOSTER_RING_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE).multiply(new Vector3(1, this.options.boosterRingHeight / LaunchConstants.REAL_LIFE_SCALE.y, 1)));
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
            this.controlRaptors();
            this.controlGridFins();

            if (this.startStartupSequence) {
                this.runStartupSequence();
            }
            else if (this.startMECOSequence) {
                this.runMECOSequence();
            }
            else if (this.startBoostbackSequence) {
                this.runBoostbackSequence();
            }
            else if (this.startBoostbackShutdownSequence) {
                this.runBoostbackShutdownSequence();
            }
            else if (this.startLandingSequence) {
                this.runLandingSequence(delta);
            }
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