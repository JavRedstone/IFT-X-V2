import { Euler, Group, Object3D, Quaternion, Vector2, Vector3 } from "three";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { MathHelper } from "../helpers/MathHelper";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { keyPresses, starshipSettings, telemetry, toggles } from "../stores/ui-store";
import { LaunchConstants } from "../constants/objects/LaunchConstants";
import { LaunchHelper } from "../helpers/LaunchHelper";
import { Raptor } from "../structs/Raptor";
import { RaptorConstants } from "../constants/controls/RaptorConstants";
import { Flap } from "../structs/Flap";
import { FlapConstants } from "../constants/controls/FlapConstants";
import { FlightController } from "../controllers/FlightController";
import { CelestialConstants } from "../constants/CelestialConstants";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";
import { LandingController } from "../controllers/LandingController";
import { OLITConstants } from "../constants/objects/OLITConstants";

export class Starship {
    public nosecone: Group = new Group();
    public shipRing: Group = new Group();
    public forwardL: Group = new Group();
    public forwardR: Group = new Group();
    public aftL: Group = new Group();
    public aftR: Group = new Group();
    public thrustPuck: Group = new Group();
    public rSeas: Object3D[] = [];
    public rSeaObjs: Group[] = [];
    public rVacs: Object3D[] = [];
    public rVacObjs: Group[] = [];
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
    public visibilityCooldown: number = StarshipConstants.VISIBILITY_COOLDOWN;

    public startStartupSequence: boolean = false;
    public endStartupSequence: boolean = false;

    public startSECOSequence: boolean = false;
    public endSECOSequence: boolean = false;

    public startLandingSequence: boolean = false;
    public endLandingSequence: boolean = false;

    public flightController: FlightController = null;
    
    public doneLandingSetup: boolean = false;
    public landingController: LandingController = null;
    public landingPosition: Vector3 = new Vector3(0, 0, 0);
    public landingRotation: Quaternion = new Quaternion();

    public options: any = {
        rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET,
        rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET,

        shipRingHeight: 1,

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
        rSeaType: StarshipConstants.R_SEA_TYPE,
        canRSeaGimbal: StarshipConstants.CAN_R_SEA_GIMBAL,

        rVacRadius: StarshipConstants.R_VAC_RADIUS,
        numRVacs: StarshipConstants.NUM_R_VACS,
        rVacType: StarshipConstants.R_VAC_TYPE,
        canRVacGimbal: StarshipConstants.CAN_R_VAC_GIMBAL
    };

    public controls: any = {
        isIPressed: false,
        isKPressed: false,
        isJPressed: false,
        isLPressed: false,
        isUPressed: false,
        isOPressed: false
    };

    constructor() {
        this.setupMultiple();
        this.setupUpdator();
    }

    public setupMultiple(): void {
        this.rSeas = [];
        this.rSeaObjs = [];
        this.rVacs = [];
        this.rVacObjs = [];
        this.setupRSeas();
        this.setupRVacs();
    }

    public setupUpdator(): void {
        toggles.subscribe((value) => {
            this.isEditing = value.isEditing;
            this.isEditingSelf = value.isEditingStarship;
            this.isFueling = value.isFueling;
            this.hasStartedFueling = value.hasStartedFueling;
            this.isLaunching = value.isLaunching;
        });
        telemetry.subscribe((value) => {
            this.LOX = value.starshipLOX;
            this.CH4 = value.starshipCH4;
            this.separated = value.separated;
        });
        keyPresses.subscribe((value) => {
            this.controls.isIPressed = value.isIPressed;
            this.controls.isKPressed = value.isKPressed;
            this.controls.isJPressed = value.isJPressed;
            this.controls.isLPressed = value.isLPressed;
            this.controls.isUPressed = value.isUPressed;
            this.controls.isOPressed = value.isOPressed;
        });
        starshipSettings.subscribe((value) => {
            this.options.rSeaAngularOffset = value.rSeaAngularOffset;
            this.options.rVacAngularOffset = value.rVacAngularOffset;

            this.options.shipRingHeight = value.shipRingHeight;

            this.options.forwardLHeightScale = value.forwardLHeightScale;
            this.options.forwardLWidthScale = value.forwardLWidthScale;
            this.options.forwardRHeightScale = value.forwardRHeightScale;
            this.options.forwardRWidthScale = value.forwardRWidthScale;
            this.options.aftLHeightScale = value.aftLHeightScale;
            this.options.aftLWidthScale = value.aftLWidthScale;
            this.options.aftRHeightScale = value.aftRHeightScale;
            this.options.aftRWidthScale = value.aftRWidthScale;

            this.options.rSeaRadius = value.rSeaRadius;
            this.options.numRSeas = value.numRSeas;
            this.options.rSeaType = value.rSeaType;
            this.options.canRSeaGimbal = value.canRSeaGimbal;

            this.options.rVacRadius = value.rVacRadius;
            this.options.numRVacs = value.numRVacs;
            this.options.rVacType = value.rVacType;
            this.options.canRVacGimbal = value.canRVacGimbal;

            this.rSeas = [];
            this.rVacs = [];

            this.setupMultiple();
            this.hasSetupSingle = false;
        });
    }

    public getLOXVolume(perc: number = this.LOX): number {
        let useableHeight: number = this.options.shipRingHeight - (StarshipConstants.LOX_BOTTOM_FIXED + StarshipConstants.CH4_TOP_FIXED + StarshipConstants.LOX_CH4_GAP_FIXED) * LaunchConstants.REAL_LIFE_SCALE.y;
        return MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, useableHeight * StarshipConstants.LOX_PERCENTAGE * perc);
    }

    public getCH4Volume(perc: number = this.CH4): number {
        let useableHeight: number = this.options.shipRingHeight - (StarshipConstants.LOX_BOTTOM_FIXED + StarshipConstants.CH4_TOP_FIXED + StarshipConstants.LOX_CH4_GAP_FIXED) * LaunchConstants.REAL_LIFE_SCALE.y;
        return MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, useableHeight * StarshipConstants.CH4_PERCENTAGE * perc);
    }

    public getLOXMass(perc: number = this.LOX): number {
        return this.getLOXVolume(perc) * LaunchConstants.LOX_DENSITY;
    }

    public getCH4Mass(perc: number = this.CH4): number {
        return this.getCH4Volume(perc) * LaunchConstants.CH4_DENSITY;
    }

    public getDryMass(): number {
        return StarshipConstants.NOSECONE_DRY_MASS + StarshipConstants.SHIP_RING_DRY_MASS * this.options.shipRingHeight / LaunchConstants.REAL_LIFE_SCALE.y + StarshipConstants.FORWARD_L_DRY_MASS * this.options.forwardLHeightScale * this.options.forwardLWidthScale + StarshipConstants.FORWARD_R_DRY_MASS * this.options.forwardRHeightScale * this.options.forwardRWidthScale + StarshipConstants.AFT_L_DRY_MASS * this.options.aftLHeightScale * this.options.aftLWidthScale + StarshipConstants.AFT_R_DRY_MASS * this.options.aftRHeightScale * this.options.aftRWidthScale + (this.options.numRSeas + this.options.numRVacs) * RaptorConstants.DRY_MASS;
    }

    public getMass(): number {
        return this.getLOXMass() + this.getCH4Mass() + this.getDryMass();
    }

    public getWeight(altitude: number): number {
        return this.getMass() * LaunchHelper.getGEarth(altitude);
    }

    public getCOM(): Vector3 { // this is real life scale so that it is accurate in the flightcontroller. The position addition number will have to be scaled down after it is rotated and moved to the correct position
        let COM: Vector3 = new Vector3(0, 0, 0);
        COM.add(new Vector3(0, this.nosecone.position.y / StarshipConstants.STARSHIP_SCALE.y * LaunchConstants.REAL_LIFE_SCALE.y + StarshipConstants.NOSECONE_HEIGHT / 2, 0).multiplyScalar(StarshipConstants.NOSECONE_DRY_MASS));
        COM.add(new Vector3(0, this.options.shipRingHeight / 2, 0).multiplyScalar(StarshipConstants.SHIP_RING_DRY_MASS));
        COM.add(this.forwardL.position.clone().divide(StarshipConstants.STARSHIP_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(StarshipConstants.FORWARD_L_DRY_MASS * this.options.forwardLHeightScale * this.options.forwardLWidthScale));
        COM.add(this.forwardR.position.clone().divide(StarshipConstants.STARSHIP_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(StarshipConstants.FORWARD_R_DRY_MASS * this.options.forwardRHeightScale * this.options.forwardRWidthScale));
        COM.add(this.aftL.position.clone().divide(StarshipConstants.STARSHIP_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(StarshipConstants.AFT_L_DRY_MASS * this.options.aftLHeightScale * this.options.aftLWidthScale));
        COM.add(this.aftR.position.clone().divide(StarshipConstants.STARSHIP_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(StarshipConstants.AFT_R_DRY_MASS * this.options.aftRHeightScale * this.options.aftRWidthScale));
        for (let rSea of this.rSeas) {
            COM.add(rSea.position.clone().divide(StarshipConstants.STARSHIP_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(RaptorConstants.DRY_MASS));
        }
        for (let rVac of this.rVacs) {
            COM.add(rVac.position.clone().divide(StarshipConstants.STARSHIP_SCALE).multiply(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(RaptorConstants.DRY_MASS));
        }
        COM.add(new Vector3(0, this.LOXFrost.position.y / StarshipConstants.STARSHIP_SCALE.y * LaunchConstants.REAL_LIFE_SCALE.y + this.options.shipRingHeight * StarshipConstants.LOX_PERCENTAGE / 2, 0).multiplyScalar(this.getLOXMass()));
        COM.add(new Vector3(0, this.CH4Frost.position.y / StarshipConstants.STARSHIP_SCALE.y * LaunchConstants.REAL_LIFE_SCALE.y + this.options.shipRingHeight * StarshipConstants.CH4_PERCENTAGE / 2, 0).multiplyScalar(this.getCH4Mass()));
        return COM.divide(LaunchConstants.REAL_LIFE_SCALE).multiplyScalar(SuperHeavyConstants.SUPER_HEAVY_SCALE_VALUE).multiplyScalar(CelestialConstants.REAL_SCALE).divideScalar(this.getMass());
    }

    public getMOIRoll(): number {
        return 1/2 * this.getMass() * Math.pow(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, 2);
    }

    public getMOIPitchYaw(): number {
        return 1/4 * this.getMass() * Math.pow(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, 2) + 1/12 * this.getMass() * Math.pow(this.options.shipRingHeight * LaunchConstants.REAL_LIFE_SCALE.y, 2);
    }

    public getThrustVector(altitude: number): Vector3 {
        let F: Vector3 = new Vector3(0, 0, 0);
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                F.add(new Vector3(0, LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle * (1 -  LaunchHelper.getThrustLoss(altitude)), 0).applyQuaternion(rSea.quaternion));
            }
        }
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                F.add(new Vector3(0, LaunchHelper.getThrust(false, rVac.userData.raptor.type) * rVac.userData.raptor.throttle * (1 -  LaunchHelper.getThrustLoss(altitude)), 0).applyQuaternion(rVac.quaternion));
            }
        }
        return F;
    }

    public getThrustTorque(COM: Vector3, altitude: number): Vector3 {
        let R = new Vector3(0, StarshipConstants.R_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y, 0).sub(COM);
        let F: Vector3 = this.getThrustVector(altitude);
        return R.clone().cross(F);
    }

    public getFlapPitchTorque(rotation: Quaternion, velocity: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        let forwardLSA: number = FlapConstants.DEFAULT_FORWARD_SA * this.options.forwardLWidthScale * this.options.forwardLHeightScale;
        let forwardRSA: number = FlapConstants.DEFAULT_FORWARD_SA * this.options.forwardRWidthScale * this.options.forwardRHeightScale;
        let aftLSA: number = FlapConstants.DEFAULT_AFT_SA * this.options.aftLWidthScale * this.options.aftLHeightScale;
        let aftRSA: number = FlapConstants.DEFAULT_AFT_SA * this.options.aftRWidthScale * this.options.aftRHeightScale;
        let forwardLDrag: number = -LaunchHelper.getDragForce(velocity, dot * forwardLSA, dot * forwardLSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.forwardL.userData.flap.angle), altitude);
        let forwardRDrag: number = -LaunchHelper.getDragForce(velocity, dot * forwardRSA, dot * forwardRSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.forwardR.userData.flap.angle), altitude);
        let aftLDrag: number = LaunchHelper.getDragForce(velocity, dot * aftLSA, dot * aftLSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.aftL.userData.flap.angle), altitude);
        let aftRDrag: number = LaunchHelper.getDragForce(velocity, dot * aftRSA, dot * aftRSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.aftR.userData.flap.angle), altitude);
        return new Vector3(0, 0, (forwardLDrag + forwardRDrag + aftLDrag + aftRDrag) * this.options.shipRingHeight / 2); //ik this isn't correct but it needs to be done since the COM is weird for the ship and booster
    }

    public getFlapRollTorque(rotation: Quaternion, velocity: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        let forwardLSA: number = FlapConstants.DEFAULT_FORWARD_SA * this.options.forwardLWidthScale * this.options.forwardLHeightScale;
        let forwardRSA: number = FlapConstants.DEFAULT_FORWARD_SA * this.options.forwardRWidthScale * this.options.forwardRHeightScale;
        let aftLSA: number = FlapConstants.DEFAULT_AFT_SA * this.options.aftLWidthScale * this.options.aftLHeightScale;
        let aftRSA: number = FlapConstants.DEFAULT_AFT_SA * this.options.aftRWidthScale * this.options.aftRHeightScale;
        let forwardLDrag: number = -LaunchHelper.getDragForce(velocity, dot * forwardLSA, dot * forwardLSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.forwardL.userData.flap.angle), altitude);
        let forwardRDrag: number = LaunchHelper.getDragForce(velocity, dot * forwardRSA, dot * forwardRSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.forwardR.userData.flap.angle), altitude);
        let aftLDrag: number = -LaunchHelper.getDragForce(velocity, dot * aftLSA, dot * aftLSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.aftL.userData.flap.angle), altitude);
        let aftRDrag: number = LaunchHelper.getDragForce(velocity, dot * aftRSA, dot * aftRSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.aftR.userData.flap.angle), altitude);
        return new Vector3(0, forwardLDrag * StarshipConstants.FORWARD_L_RADIUS + forwardRDrag * StarshipConstants.FORWARD_R_RADIUS + aftLDrag * StarshipConstants.AFT_L_RADIUS + aftRDrag * StarshipConstants.AFT_R_RADIUS, 0);
    }

    public getDragVector(rotation: Quaternion, velocity: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        // basically it starts at 0 at the edges, and peaks at 1 in the middle
        let topSA: number = Math.PI * Math.pow(StarshipConstants.SHIP_RING_SCALE.x / 2, 2); // pi * r^2
        let sideSA: number = Math.PI * StarshipConstants.SHIP_RING_SCALE.x / 2 * this.options.shipRingHeight; // 2 * pi * r * h / 2 since it is a cylinder and we are only looking at one side
        let SA: number = dot * (sideSA - topSA) + topSA;
        let forceScalar: number = -LaunchHelper.getDragForce(velocity, SA, velocity.length(), LaunchConstants.DRAG_FORCE_COEF, altitude);
        let forwardLSA: number = FlapConstants.DEFAULT_FORWARD_SA * this.options.forwardLWidthScale * this.options.forwardLHeightScale;
        let forwardRSA: number = FlapConstants.DEFAULT_FORWARD_SA * this.options.forwardRWidthScale * this.options.forwardRHeightScale;
        let aftLSA: number = FlapConstants.DEFAULT_AFT_SA * this.options.aftLWidthScale * this.options.aftLHeightScale;
        let aftRSA: number = FlapConstants.DEFAULT_AFT_SA * this.options.aftRWidthScale * this.options.aftRHeightScale;
        let forwardLDrag: number = -LaunchHelper.getDragForce(velocity, dot * forwardLSA, dot * forwardLSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.forwardL.userData.flap.angle), altitude);
        let forwardRDrag: number = -LaunchHelper.getDragForce(velocity, dot * forwardRSA, dot * forwardRSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.forwardR.userData.flap.angle), altitude);
        let aftLDrag: number = -LaunchHelper.getDragForce(velocity, dot * aftLSA, dot * aftLSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.aftL.userData.flap.angle), altitude);
        let aftRDrag: number = -LaunchHelper.getDragForce(velocity, dot * aftRSA, dot * aftRSA, FlapConstants.DRAG_COEFFICIENT * (FlapConstants.MAX_ANGLE - this.aftR.userData.flap.angle), altitude);
        return velocity.clone().normalize().multiplyScalar(forceScalar + forwardLDrag + forwardRDrag + aftLDrag + aftRDrag);
    }

    public getDragPitchYawTorque(rotation: Quaternion, velocity: Vector3, angVel: Vector3, COM: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let angVelPitch: number = angVel.x;
        let angVelYaw: number = angVel.z;
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        // basically it starts at 0 at the edges, and peaks at 1 in the middle
        let topSA: number = Math.PI * Math.pow(StarshipConstants.SHIP_RING_SCALE.x / 2, 2); // pi * r^2
        let sideSA: number = Math.PI * StarshipConstants.SHIP_RING_SCALE.x / 2 * this.options.shipRingHeight; // 2 * pi * r * h / 2 since it is a cylinder and we are only looking at one side
        let SA: number = dot * (sideSA - topSA) + topSA;
        let pitchForceScalar: number = -LaunchHelper.getDragForce(velocity, SA, angVelPitch, LaunchConstants.DRAG_FORCE_COEF, altitude);
        let yawForceScalar: number = -LaunchHelper.getDragForce(velocity, dot, angVelYaw, LaunchConstants.DRAG_FORCE_COEF, altitude);
        return new Vector3(pitchForceScalar * COM.length(), 0, yawForceScalar * COM.length());
    }

    public getDragRollTorque(rotation: Quaternion, velocity: Vector3, angVel: Vector3, altitude: number): Vector3 {
        let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(rotation);
        let angVelRoll: number = angVel.y;
        let dot: number = orientation.normalize().dot(velocity.clone().normalize());
        if (dot > 0) dot = -dot;
        dot += 1;
        // basically it starts at 0 at the edges, and peaks at 1 in the middle
        let topSA: number = Math.PI * Math.pow(StarshipConstants.SHIP_RING_SCALE.x / 2, 2); // pi * r^2
        let sideSA: number = Math.PI * StarshipConstants.SHIP_RING_SCALE.x / 2 * this.options.shipRingHeight; // 2 * pi * r * h / 2 since it is a cylinder and we are only looking at one side
        let SA: number = dot * (sideSA - topSA) + topSA;
        let forceScalar: number = -LaunchHelper.getDragForce(velocity, SA, angVelRoll, LaunchConstants.DRAG_FORCE_COEF, altitude);
        return new Vector3(0, forceScalar * StarshipConstants.SHIP_RING_SCALE.x / 2, 0);
    }

    public updateFuel(delta: number): void {
        if (this.isFueling && !this.hasStartedFueling) {
            telemetry.update((value) => {
                value.starshipCH4 = 0;
                value.starshipLOX = 0;

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
                value.starshipCH4 = this.CH4;
                value.starshipLOX = this.LOX;
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
            for (let rVac of this.rVacs) {
                if (rVac.userData.raptor != null) {
                    totalMassFlowCH4 += RaptorConstants.MASS_FLOW_CH4 * rVac.userData.raptor.throttle;
                    totalMassFlowLOX += RaptorConstants.MASS_FLOW_LOX * rVac.userData.raptor.throttle;
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
                value.starshipCH4 = this.CH4;
                value.starshipLOX = this.LOX;
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
            
            let useableHeight: number = this.options.shipRingHeight / LaunchConstants.REAL_LIFE_SCALE.y - StarshipConstants.LOX_BOTTOM_FIXED - StarshipConstants.CH4_TOP_FIXED - StarshipConstants.LOX_CH4_GAP_FIXED;

            this.CH4Frost.scale.copy(StarshipConstants.CRYOGENIC_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.CH4 * StarshipConstants.CH4_PERCENTAGE * useableHeight, 1)));
            this.CH4Frost.position.copy(this.shipRing.position.clone().add(new Vector3(0, StarshipConstants.STARSHIP_SCALE.y * (StarshipConstants.LOX_BOTTOM_FIXED + StarshipConstants.LOX_PERCENTAGE * useableHeight + StarshipConstants.LOX_CH4_GAP_FIXED), 0)));

            if (this.LOX == 0) {
                this.LOXFrost.visible = false;
            }
            else {
                this.LOXFrost.visible = true;
                this.LOXFrost.scale.y = this.LOX / 100;
            }

            this.LOXFrost.scale.copy(StarshipConstants.CRYOGENIC_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.LOX * StarshipConstants.LOX_PERCENTAGE * useableHeight, 1)));
            this.LOXFrost.position.copy(this.shipRing.position.clone().add(new Vector3(0, StarshipConstants.STARSHIP_SCALE.y * StarshipConstants.LOX_BOTTOM_FIXED, 0)));
        }
    }

    public gimbalTest(delta: number): void {
        if (this.options.canRSeaGimbal) {
            for (let i = 0; i < this.options.numRSeas; i++) {
                let rSea = this.rSeas[i];
                if (rSea.userData.raptor != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.raptor.gimbalAngle == 0) {
                        rSea.userData.raptor.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.raptor.angleY = 0;
                    } else {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.raptor.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }
                }
            }
        }
        if (this.options.canRVacGimbal) {
            for (let i = 0; i < this.options.numRVacs; i++) {
                let rVac = this.rVacs[i];
                if (rVac.userData.raptor != null && rVac.userData.originalRotation != null) {
                    if (rVac.userData.raptor.gimbalAngle == 0) {
                        rVac.userData.raptor.gimbalAngle = RaptorConstants.R_VAC_GIMBAL_MAX_ANGLE;
                        rVac.userData.raptor.angleY = 0;
                    } else {
                        rVac.userData.raptor.setGimbalTarget(RaptorConstants.R_VAC_GIMBAL_MAX_ANGLE, rVac.userData.raptor.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }
                }
            }
        }
    }

    public flapTest(): void {
        if (this.forwardL.userData.flap.angle == FlapConstants.MAX_ANGLE) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (this.forwardL.userData.flap.angle == FlapConstants.MIN_ANGLE) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }

        if (this.forwardR.userData.flap.angle == FlapConstants.MAX_ANGLE) {
            this.forwardR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (this.forwardR.userData.flap.angle == FlapConstants.MIN_ANGLE) {
            this.forwardR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }

        if (this.aftL.userData.flap.angle == FlapConstants.MAX_ANGLE) {
            this.aftL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (this.aftL.userData.flap.angle == FlapConstants.MIN_ANGLE) {
            this.aftL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }

        if (this.aftR.userData.flap.angle == FlapConstants.MAX_ANGLE) {
            this.aftR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (this.aftR.userData.flap.angle == FlapConstants.MIN_ANGLE) {
            this.aftR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }
    }

    public controlRaptors(): void {
        let combinedVector: Vector2 = new Vector2(0, 0);
        if (this.controls.isIPressed) {
            combinedVector.y += 1;
        }
        if (this.controls.isKPressed) {
            combinedVector.y -= 1;
        }
        if (this.controls.isJPressed) {
            combinedVector.x += 1; // gimbal angle thing is broken so workaround
        }
        if (this.controls.isLPressed) {
            combinedVector.x -= 1; // gimbal angle thing is broken so workaround
        }
        let angleY: number = Math.atan2(combinedVector.y, combinedVector.x);
        if (combinedVector.length() > 0) {
            if (this.options.canRSeaGimbal) {
                for (let i = 0; i < this.options.numRSeas; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);
                    }
                }
            }
            if (this.options.canRVacGimbal) {
                for (let i = 0; i < this.options.numRVacs; i++) {
                    let rVac = this.rVacs[i];
                    if (rVac.userData.raptor != null) {
                        rVac.userData.raptor.setGimbalTarget(RaptorConstants.R_VAC_GIMBAL_MAX_ANGLE, angleY);
                    }
                }
            }
        }
        else {
            if (this.options.canRSeaGimbal) {
                for (let i = 0; i < this.options.numRSeas; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(0, 0);
                    }
                }
            }
            if (this.options.canRVacGimbal) {
                for (let i = 0; i < this.options.numRVacs; i++) {
                    let rVac = this.rVacs[i];
                    if (rVac.userData.raptor != null) {
                        rVac.userData.raptor.setGimbalTarget(0, 0);
                    }
                }
            }
        }
    }

    public controlFlaps(): void {
        let isIPressed: boolean = this.controls.isIPressed;
        let isKPressed: boolean = this.controls.isKPressed;
        let isUPressed: boolean = this.controls.isUPressed;
        let isOPressed: boolean = this.controls.isOPressed;

        if (isIPressed && isKPressed) {
            isIPressed = false;
            isKPressed = false;
        }
        if (isUPressed && isOPressed) {
            isUPressed = false;
            isOPressed = false;
        }

        if (isIPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (isKPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }
        else if (isUPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (isOPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }
        else {
            if (this.separated) {
                this.forwardL.userData.flap.setTarget(FlapConstants.NEUTRAL_ANGLE);
                this.forwardR.userData.flap.setTarget(FlapConstants.NEUTRAL_ANGLE);
                this.aftL.userData.flap.setTarget(FlapConstants.NEUTRAL_ANGLE);
                this.aftR.userData.flap.setTarget(FlapConstants.NEUTRAL_ANGLE);
            }
            else {
                this.forwardL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
                this.forwardR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
                this.aftL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
                this.aftR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            }
        }
    }

    public runForceShutdown(): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.setThrottleTarget(0);
            }
        }
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                rVac.userData.raptor.setThrottleTarget(0);
            }
        }
    }
    
    public runStartupSequence(): void {
        let areAllRVacReady: boolean = true;
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                rVac.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);
            }
            if (rVac.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                areAllRVacReady = false;
            }
        }
        if (areAllRVacReady) {
            let areAllRSeaReady: boolean = true;
            for (let rSea of this.rSeas) {
                if (rSea.userData.raptor != null) {
                    rSea.userData.raptor.setThrottleTarget(RaptorConstants.MAX_THROTTLE);
                }
                if (rSea.userData.raptor.throttle != RaptorConstants.MAX_THROTTLE) {
                    areAllRSeaReady = false;
                }
            }

            if (areAllRSeaReady) {
                this.startStartupSequence = false;
                this.endStartupSequence = true;
            }
        }
    }

    public runSECOSequence(): void {
        let areAllRVacReady: boolean = true;
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                rVac.userData.raptor.setThrottleTarget(0);
            }
            if (rVac.userData.raptor.throttle != 0) {
                areAllRVacReady = false;
            }
        }
        if (areAllRVacReady) {
            let areAllRSeaReady: boolean = true;
            for (let rSea of this.rSeas) {
                if (rSea.userData.raptor != null) {
                    rSea.userData.raptor.setThrottleTarget(0);
                }
                if (rSea.userData.raptor.throttle != 0) {
                    areAllRSeaReady = false;
                }
            }

            if (areAllRSeaReady) {
                this.startSECOSequence = false;
                this.endSECOSequence = true;
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
            let relPosition: Vector3 = this.flightController.position.clone().sub(this.landingPosition.clone()).applyQuaternion(this.landingRotation).applyAxisAngle(new Vector3(0, 1, 0), -OLITConstants.STACK_ROTATION.y);
            this.landingController.update(relPosition, this.flightController.angularVelocity, delta);
            let thrust: number = this.landingController.getThrust();
            let rSeaThrust: number = LaunchHelper.getThrust(true, this.options.rSeaType1)
            let throttle: number = (thrust / this.options.numRSeas) / rSeaThrust;
            throttle = MathHelper.clamp(throttle, 0, 1);
            let gimbalAngle: number = this.landingController.getGimbalAngleTarget() * RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
            let gimbalY: number = this.landingController.getGimbalYTarget() - new Euler().setFromQuaternion(this.flightController.relRotation).y;
            let flapY: number = this.landingController.getGridFinFlapYTarget();
            let flapZ: number = this.landingController.getGridFinFlapZTarget();
            if (!this.controls.isIPressed && !this.controls.isKPressed && !this.controls.isJPressed && !this.controls.isLPressed && !this.controls.isUPressed && !this.controls.isOPressed) {
                let forwardLTarget: number = FlapConstants.NEUTRAL_ANGLE;
                let forwardRTarget: number = FlapConstants.NEUTRAL_ANGLE;
                let aftLTarget: number = FlapConstants.NEUTRAL_ANGLE;
                let aftRTarget: number = FlapConstants.NEUTRAL_ANGLE;

                forwardLTarget += flapY * FlapConstants.MAX_ANGLE;
                forwardRTarget += flapY * FlapConstants.MIN_ANGLE;
                aftLTarget += flapY * FlapConstants.MIN_ANGLE;
                aftRTarget += flapY * FlapConstants.MIN_ANGLE;

                forwardLTarget += flapZ * FlapConstants.MAX_ANGLE;
                forwardRTarget += flapZ * FlapConstants.MAX_ANGLE;
                aftLTarget += flapZ * FlapConstants.MIN_ANGLE;
                aftRTarget += flapZ * FlapConstants.MIN_ANGLE;

                forwardLTarget = MathHelper.clamp(forwardLTarget, FlapConstants.MIN_ANGLE, FlapConstants.MAX_ANGLE);
                forwardRTarget = MathHelper.clamp(forwardRTarget, FlapConstants.MIN_ANGLE, FlapConstants.MAX_ANGLE);
                aftLTarget = MathHelper.clamp(aftLTarget, FlapConstants.MIN_ANGLE, FlapConstants.MAX_ANGLE);
                aftRTarget = MathHelper.clamp(aftRTarget, FlapConstants.MIN_ANGLE, FlapConstants.MAX_ANGLE);

                this.forwardL.userData.flap.setTarget(forwardLTarget);
                this.forwardR.userData.flap.setTarget(forwardRTarget);
                this.aftL.userData.flap.setTarget(aftLTarget);
                this.aftR.userData.flap.setTarget(aftRTarget);
            }
            for (let i = 0; i < this.options.numRSeas; i++) {
                let rSea = this.rSeas[i];
                if (rSea.userData.raptor != null) {
                    rSea.userData.raptor.setThrottleTarget(throttle);

                    if (this.options.canRSeaGimbal) {
                        rSea.userData.raptor.setGimbalTarget(gimbalAngle, gimbalY);
                    }
                }
            }
        }
    }

    public updateRaptors(delta: number): void {
        let rSeaGimbalingAngles: number[] = [];
        let rSeaGimbalYs: number[] = [];
        let rVacGimbalingAngles: number[] = [];
        let rVacGimbalYs: number[] = [];

        let rSeaThrottles: number[] = [];
        let rVacThrottles: number[] = [];

        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.update(delta);

                rSea.quaternion.copy(new Quaternion().setFromEuler(rSea.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rSea.userData.raptor.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rSea.userData.raptor.gimbalAngle))));
            
                rSeaGimbalingAngles = [...rSeaGimbalingAngles, rSea.userData.raptor.gimbalAngle];
                rSeaGimbalYs = [...rSeaGimbalYs, rSea.userData.raptor.angleY];
                rSeaThrottles = [...rSeaThrottles, rSea.userData.raptor.throttle];
            }
        }
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                rVac.userData.raptor.update(delta);

                rVac.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(rVac.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rVac.userData.raptor.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rVac.userData.raptor.gimbalAngle)))));

                rVacGimbalingAngles = [...rVacGimbalingAngles, rVac.userData.raptor.gimbalAngle];
                rVacGimbalYs = [...rVacGimbalYs, rVac.userData.raptor.angleY];
                rVacThrottles = [...rVacThrottles, rVac.userData.raptor.throttle];
            }
        }

        telemetry.update((value) => {
            value.rSeaGimbalingAngles = rSeaGimbalingAngles;
            value.rSeaGimbalYs = rSeaGimbalYs;
            value.rVacGimbalingAngles = rVacGimbalingAngles;
            value.rVacGimbalYs = rVacGimbalYs;
            value.rSeaThrottles = rSeaThrottles;
            value.rVacThrottles = rVacThrottles;
            return value;
        });
    }

    public updateFlaps(delta: number): void {
        this.forwardL.userData.flap.update(delta);
        this.forwardL.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(this.forwardL.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -this.forwardL.userData.flap.angle))));

        this.forwardR.userData.flap.update(delta);
        this.forwardR.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(this.forwardR.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.forwardR.userData.flap.angle))));

        this.aftL.userData.flap.update(delta);
        this.aftL.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(this.aftL.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -this.aftL.userData.flap.angle))));

        this.aftR.userData.flap.update(delta);
        this.aftR.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(this.aftR.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), this.aftR.userData.flap.angle))));

        telemetry.update((value) => {
            value.forwardLAngle = this.forwardL.userData.flap.angle;
            value.forwardRAngle = this.forwardR.userData.flap.angle;
            value.aftLAngle = this.aftL.userData.flap.angle;
            value.aftRAngle = this.aftR.userData.flap.angle;
            return value;
        });
    }

    public resetRaptors(): void {
        for (let i = 0; i < this.rSeas.length; i++) {
            if (this.rSeas[i].userData.raptor != null) {
                this.rSeas[i].userData.raptor.reset();
            }
        }
        for (let i = 0; i < this.rVacs.length; i++) {
            if (this.rVacs[i].userData.raptor != null) {
                this.rVacs[i].userData.raptor.reset();
            }
        }
    }

    public resetFlaps(): void {
        this.forwardL.userData.flap.reset();
        this.forwardR.userData.flap.reset();
        this.aftL.userData.flap.reset();
        this.aftR.userData.flap.reset();

        telemetry.update((value) => {
            value.forwardLAngle = this.forwardL.userData.flap.angle;
            value.forwardRAngle = this.forwardR.userData.flap.angle;
            value.aftLAngle = this.aftL.userData.flap.angle;
            value.aftRAngle = this.aftR.userData.flap.angle;
            return value;
        });
    }

    public setupRSeas(): void {
        let rSeaPositions = MathHelper.getCircularPositions(this.options.numRSeas, this.options.rSeaRadius * StarshipConstants.STARSHIP_SCALE.x / LaunchConstants.REAL_LIFE_SCALE.x, this.options.rSeaAngularOffset * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions[i].clone().add(new Vector3(0, StarshipConstants.R_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            rSea.scale.copy(StarshipConstants.R_SEA_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType);

            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupRVacs(): void {
        let rVacPositions = MathHelper.getCircularPositions(this.options.numRVacs, this.options.rVacRadius * StarshipConstants.STARSHIP_SCALE.x / LaunchConstants.REAL_LIFE_SCALE.x, this.options.rVacAngularOffset * Math.PI / 180);

        for (let i = 0; i < this.options.numRVacs; i++) {
            let rVac = new Object3D();
            rVac.position.copy(rVacPositions[i].clone().add(new Vector3(0, StarshipConstants.R_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            rVac.scale.copy(StarshipConstants.R_VAC_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            rVac.userData.originalRotation = new Euler(0, 0, 0);
            rVac.userData.raptor = new Raptor(false, this.options.rVacType);

            this.rVacs = [...this.rVacs, rVac];
        }
    }

    public setupSingle(): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null) {
            this.nosecone.userData.aabb = null;
            this.shipRing.userData.aabb = null;
            this.forwardL.userData.aabb = null;
            this.forwardR.userData.aabb = null;
            this.aftL.userData.aabb = null;
            this.aftR.userData.aabb = null;
            this.thrustPuck.userData.aabb = null;
            this.hasUpdatedAABB = false;

            this.nosecone.scale.copy(StarshipConstants.NOSECONE_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            this.shipRing.scale.copy(StarshipConstants.SHIP_RING_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.shipRingHeight / LaunchConstants.REAL_LIFE_SCALE.y, 1)));
            
            this.forwardL.scale.copy(StarshipConstants.FORWARD_L_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.forwardLHeightScale, this.options.forwardLWidthScale)));
            this.forwardL.rotation.copy(StarshipConstants.FORWARD_L_ROTATION);
            this.forwardL.userData.originalRotation = StarshipConstants.FORWARD_L_ROTATION.clone();
            this.forwardL.userData.flap = new Flap();
            
            this.forwardR.scale.copy(StarshipConstants.FORWARD_R_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.forwardRHeightScale, this.options.forwardRWidthScale)));
            this.forwardR.rotation.copy(StarshipConstants.FORWARD_R_ROTATION);
            this.forwardR.userData.originalRotation = StarshipConstants.FORWARD_R_ROTATION.clone();
            this.forwardR.userData.flap = new Flap();

            this.aftL.scale.copy(StarshipConstants.AFT_L_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.aftLHeightScale, this.options.aftLWidthScale)));
            this.aftL.rotation.copy(new Euler(0, 0, 0));
            this.aftL.userData.originalRotation = new Euler(0, 0, 0);
            this.aftL.userData.flap = new Flap();
            
            this.aftR.scale.copy(StarshipConstants.AFT_R_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.aftRHeightScale, this.options.aftRWidthScale)));
            this.aftR.rotation.copy(new Euler(0, 0, 0));
            this.aftR.userData.originalRotation = new Euler(0, 0, 0);
            this.aftR.userData.flap = new Flap();
            
            this.thrustPuck.scale.copy(StarshipConstants.THRUST_PUCK_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            this.thrustPuck.position.copy(this.shipRing.position.clone().add(new Vector3(0, StarshipConstants.THRUST_PUCK_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            this.hasSetupSingle = true;
        }    
    }

    public updateAABB(): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null && this.thrustPuck != null) {
            if (this.nosecone.userData.aabb == null || this.shipRing.userData.aabb == null || this.forwardL.userData.aabb == null || this.forwardR.userData.aabb == null || this.aftL.userData.aabb == null || this.aftR.userData.aabb == null || this.thrustPuck.userData.aabb == null ||
                this.nosecone.userData.aabb.getSize(new Vector3).length() == 0 || this.shipRing.userData.aabb.getSize(new Vector3).length() == 0 || this.forwardL.userData.aabb.getSize(new Vector3).length() == 0 || this.forwardR.userData.aabb.getSize(new Vector3).length() == 0 || this.aftL.userData.aabb.getSize(new Vector3).length() == 0 || this.aftR.userData.aabb.getSize(new Vector3).length() == 0 || this.thrustPuck.userData.aabb.getSize(new Vector3).length() == 0) {
                this.nosecone.userData.aabb = ObjectHelper.getAabb(this.nosecone);
                this.shipRing.userData.aabb = ObjectHelper.getAabb(this.shipRing);
                this.forwardL.userData.aabb = ObjectHelper.getAabb(this.forwardL);
                this.forwardR.userData.aabb = ObjectHelper.getAabb(this.forwardR);
                this.aftL.userData.aabb = ObjectHelper.getAabb(this.aftL);
                this.aftR.userData.aabb = ObjectHelper.getAabb(this.aftR);
                this.thrustPuck.userData.aabb = ObjectHelper.getAabb(this.thrustPuck);
            }
        }
        for (let i = 0; i < this.rSeas.length; i++) {
            if (this.rSeas[i].userData.aabb == null || this.rSeas[i].userData.aabb.getSize(new Vector3).length() == 0) {
                this.rSeas[i].userData.aabb = ObjectHelper.getAabb(this.rSeas[i]);
            }
        }
        for (let i = 0; i < this.rVacs.length; i++) {
            if (this.rVacs[i].userData.aabb == null || this.rVacs[i].userData.aabb.getSize(new Vector3).length() == 0) {
                this.rVacs[i].userData.aabb = ObjectHelper.getAabb(this.rVacs[i]);
            }
        }
    }

    public updateObjects(delta: number): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null && this.nosecone.userData.aabb.getSize(new Vector3).length() != 0 && this.shipRing.userData.aabb.getSize(new Vector3).length() != 0 && this.forwardL.userData.aabb.getSize(new Vector3).length() != 0 && this.forwardR.userData.aabb.getSize(new Vector3).length() != 0 && this.aftL.userData.aabb.getSize(new Vector3).length() != 0 && this.aftR.userData.aabb.getSize(new Vector3).length() != 0) {
            this.nosecone.position.copy(this.shipRing.position.clone().add(new Vector3(0, this.shipRing.userData.aabb.getSize(new Vector3).y, 0)));
            this.forwardL.position.copy(this.shipRing.position.clone().add(new Vector3(0, this.shipRing.userData.aabb.getSize(new Vector3).y, -StarshipConstants.FORWARD_L_RADIUS * StarshipConstants.STARSHIP_SCALE.z)));
            this.forwardR.position.copy(this.shipRing.position.clone().add(new Vector3(0, this.shipRing.userData.aabb.getSize(new Vector3).y, StarshipConstants.FORWARD_R_RADIUS * StarshipConstants.STARSHIP_SCALE.z)));
            this.aftL.position.copy(this.shipRing.position.clone().add(new Vector3(0, 0, -StarshipConstants.AFT_L_RADIUS * StarshipConstants.STARSHIP_SCALE.z)));
            this.aftR.position.copy(this.shipRing.position.clone().add(new Vector3(0, 0, StarshipConstants.AFT_R_RADIUS * StarshipConstants.STARSHIP_SCALE.z)));
            this.hasUpdatedAABB = true;
        }
        
        if (this.isEditing) {
            this.gimbalTest(delta);
            this.flapTest();
        }
        if (this.isFueling) {
            this.resetRaptors();
            this.resetFlaps();
        }
        if (this.isEditingSelf) {
            if (this.visibilityCooldown > 0) {
                this.visibilityCooldown -= delta;
            }
            if (this.visibilityCooldown <= 0) {
                this.group.visible = !this.group.visible;
                this.visibilityCooldown = StarshipConstants.VISIBILITY_COOLDOWN;
            }
        }
        else {
            this.group.visible = true;
            this.visibilityCooldown = StarshipConstants.VISIBILITY_COOLDOWN;
        }
        if (this.isLaunching) {
            this.controlRaptors();
            this.controlFlaps();

            if (this.startStartupSequence) {
                this.runStartupSequence();
            }
            if (this.startSECOSequence) {
                this.runSECOSequence();
            }
            if (this.startLandingSequence) {
                this.runLandingSequence(delta);
            }
        }
        this.updateFuel(delta);
        this.updateRaptors(delta);
        this.updateFlaps(delta);
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