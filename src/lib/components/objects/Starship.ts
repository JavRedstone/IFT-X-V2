import { Euler, Group, Mesh, Object3D, Quaternion, Vector2, Vector3 } from "three";
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

    public gimbalTest(delta: number): void {
        let rSeaGimbalingAngles: number[] = [];
        let rSeaGimbalYs: number[] = [];
        let rVacGimbalingAngles: number[] = [];
        let rVacGimbalYs: number[] = [];
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

                    rSeaGimbalingAngles = [...rSeaGimbalingAngles, rSea.userData.raptor.gimbalAngle];
                    rSeaGimbalYs = [...rSeaGimbalYs, rSea.userData.raptor.angleY];
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

                    rVacGimbalingAngles = [...rVacGimbalingAngles, rVac.userData.raptor.gimbalAngle];
                    rVacGimbalYs = [...rVacGimbalYs, rVac.userData.raptor.angleY];
                }
            }
        }

        telemetry.update((value) => {
            value.rSeaGimbalingAngles = rSeaGimbalingAngles;
            value.rSeaGimbalYs = rSeaGimbalYs;
            value.rVacGimbalingAngles = rVacGimbalingAngles;
            value.rVacGimbalYs = rVacGimbalYs;
            return value;
        });
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

        telemetry.update((value) => {
            value.forwardLAngle = this.forwardL.userData.flap.angle;
            value.forwardRAngle = this.forwardR.userData.flap.angle;
            value.aftLAngle = this.aftL.userData.flap.angle;
            value.aftRAngle = this.aftR.userData.flap.angle;
            return value;
        });
    }

    public getLOXVolume(perc: number = this.LOX): number {
        return MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, this.options.shipRingHeight * StarshipConstants.LOX_PERCENTAGE * perc);
    }

    public getCH4Volume(perc: number = this.CH4): number {
        return MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, this.options.shipRingHeight * StarshipConstants.CH4_PERCENTAGE * perc);
    }

    public getLOXMass(perc: number = this.LOX): number {
        return this.getLOXVolume(perc) * LaunchConstants.LOX_DENSITY;
    }

    public getCH4Mass(perc: number = this.CH4): number {
        return this.getCH4Volume(perc) * LaunchConstants.CH4_DENSITY;
    }

    public getDryMass(): number {
        return StarshipConstants.NOSECONE_DRY_MASS + StarshipConstants.SHIP_RING_DRY_MASS * this.options.shipRingHeight / StarshipConstants.REAL_LIFE_SCALE.y + StarshipConstants.FORWARD_L_DRY_MASS * this.options.forwardLHeightScale * this.options.forwardLWidthScale + StarshipConstants.FORWARD_R_DRY_MASS * this.options.forwardRHeightScale * this.options.forwardRWidthScale + StarshipConstants.AFT_L_DRY_MASS * this.options.aftLHeightScale * this.options.aftLWidthScale + StarshipConstants.AFT_R_DRY_MASS * this.options.aftRHeightScale * this.options.aftRWidthScale + (this.options.numRSeas + this.options.numRVacs) * RaptorConstants.DRY_MASS;
    }

    public getMass(): number {
        return this.getLOXMass() + this.getCH4Mass() + this.getDryMass();
    }

    public getWeight(altitude: number): number {
        return this.getMass() * LaunchHelper.getGEarth(altitude);
    }

    // TODO similar to booster
    // public getCenterofMass(): Vector3 {
    //     let totalMass: number = this.getMass();
    //     let centerofMass: Vector3 = new Vector3(0, 0, 0);
    // }

    public getThrust(): number {
        let totalThrust: number = 0;
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                totalThrust += LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle;
            }
        }
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                totalThrust += LaunchHelper.getThrust(false, rVac.userData.raptor.type) * rVac.userData.raptor.throttle;
            }
        }
        return totalThrust;
    }

    public getGimbaledThrust(): number {
        let totalThrust: number = 0;
        if (this.options.canRSeaGimbal) {
            for (let rSea of this.rSeas) {
                if (rSea.userData.raptor != null) {
                    totalThrust += LaunchHelper.getThrust(true, rSea.userData.raptor.type) * rSea.userData.raptor.throttle;
                }
            }
        }
        if (this.options.canRVacGimbal) {
            for (let rVac of this.rVacs) {
                if (rVac.userData.raptor != null) {
                    totalThrust += LaunchHelper.getThrust(false, rVac.userData.raptor.type) * rVac.userData.raptor.throttle;
                }
            }
        }
        return totalThrust;
    }

    public getNonGimbaledThrust(): number {
        return this.getThrust() - this.getGimbaledThrust();
    }

    public getRealThrust(altitude: number): number {
        return this.getThrust() - LaunchHelper.getThrustLoss(altitude) * (this.options.numRSeas1 + this.options.numRSeas2 + this.options.numRSeas3);
    }

    public getRealGimbaledThrust(altitude: number): number {
        let totalNumber: number = 0;
        if (this.options.canRSeaGimbal) {
            totalNumber += this.options.numRSeas1 + this.options.numRSeas2 + this.options.numRSeas3;
        }
        if (this.options.canRVacGimbal) {
            totalNumber += this.options.numRVacs1 + this.options.numRVacs2 + this.options.numRVacs3;
        }
        return this.getGimbaledThrust() - LaunchHelper.getThrustLoss(altitude) * totalNumber;
    }

    public getRealNonGimbaledThrust(altitude: number): number {
        return this.getRealThrust(altitude) - this.getRealGimbaledThrust(altitude);
    }

    public controlGimbals(): void {
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
        let rSeaGimbalingAngles: number[] = [];
        let rSeaGimbalYs: number[] = [];
        let rVacGimbalingAngles: number[] = [];
        let rVacGimbalYs: number[] = [];
        if (combinedVector.length() > 0) {
            if (this.options.canRSeaGimbal) {
                for (let i = 0; i < this.options.numRSeas; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.raptor != null) {
                        rSea.userData.raptor.setGimbalTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles = [...rSeaGimbalingAngles, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs = [...rSeaGimbalYs, rSea.userData.raptor.angleY];
                    }
                }
            }
            if (this.options.canRVacGimbal) {
                for (let i = 0; i < this.options.numRVacs; i++) {
                    let rVac = this.rVacs[i];
                    if (rVac.userData.raptor != null) {
                        rVac.userData.raptor.setGimbalTarget(RaptorConstants.R_VAC_GIMBAL_MAX_ANGLE, angleY);

                        rVacGimbalingAngles = [...rVacGimbalingAngles, rVac.userData.raptor.gimbalAngle];
                        rVacGimbalYs = [...rVacGimbalYs, rVac.userData.raptor.angleY];
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

                        rSeaGimbalingAngles = [...rSeaGimbalingAngles, rSea.userData.raptor.gimbalAngle];
                        rSeaGimbalYs = [...rSeaGimbalYs, rSea.userData.raptor.angleY];
                    }
                }
            }
            if (this.options.canRVacGimbal) {
                for (let i = 0; i < this.options.numRVacs; i++) {
                    let rVac = this.rVacs[i];
                    if (rVac.userData.raptor != null) {
                        rVac.userData.raptor.setGimbalTarget(0, 0);

                        rVacGimbalingAngles = [...rVacGimbalingAngles, rVac.userData.raptor.gimbalAngle];
                        rVacGimbalYs = [...rVacGimbalYs, rVac.userData.raptor.angleY];
                    }
                }
            }
        }
        telemetry.update((value) => {
            value.rSeaGimbalingAngles = rSeaGimbalingAngles;
            value.rSeaGimbalYs = rSeaGimbalYs;
            value.rVacGimbalingAngles = rVacGimbalingAngles;
            value.rVacGimbalYs = rVacGimbalYs;
            return value;
        });
    }

    public controlFlaps(): void {
        if (this.controls.isIPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (this.controls.isKPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
        }
        else if (this.controls.isUPressed) {
            this.forwardL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.forwardR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
            this.aftL.userData.flap.setTarget(FlapConstants.MAX_ANGLE);
            this.aftR.userData.flap.setTarget(FlapConstants.MIN_ANGLE);
        }
        else if (this.controls.isOPressed) {
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
        telemetry.update((value) => {
            value.forwardLAngle = this.forwardL.userData.flap.angle;
            value.forwardRAngle = this.forwardR.userData.flap.angle;
            value.aftLAngle = this.aftL.userData.flap.angle;
            value.aftRAngle = this.aftR.userData.flap.angle;
            return value;
        });
    }

    public updateFrost(delta: number): void {
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

        if (this.CH4Frost != null && this.LOXFrost != null) {
            if (this.CH4 == 0) {
                this.CH4Frost.visible = false;
            }
            else {
                this.CH4Frost.visible = true;
                this.CH4Frost.scale.y = this.CH4 / 100;
            }
            
            this.CH4Frost.scale.copy(StarshipConstants.CRYOGENIC_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.CH4 * StarshipConstants.CH4_PERCENTAGE * this.options.shipRingHeight / StarshipConstants.REAL_LIFE_SCALE.y, 1)));
            this.CH4Frost.position.copy(this.shipRing.position.clone().add(new Vector3(0, StarshipConstants.STARSHIP_SCALE.y * (StarshipConstants.LOX_BOTTOM_PERCENTAGE + StarshipConstants.LOX_PERCENTAGE + StarshipConstants.CH4_BOTTOM_PERCENTAGE) * this.options.shipRingHeight / StarshipConstants.REAL_LIFE_SCALE.y, 0)));

            if (this.LOX == 0) {
                this.LOXFrost.visible = false;
            }
            else {
                this.LOXFrost.visible = true;
                this.LOXFrost.scale.y = this.LOX / 100;
            }

            this.LOXFrost.scale.copy(StarshipConstants.CRYOGENIC_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.LOX * StarshipConstants.LOX_PERCENTAGE * this.options.shipRingHeight / StarshipConstants.REAL_LIFE_SCALE.y, 1)));
            this.LOXFrost.position.copy(this.shipRing.position.clone().add(new Vector3(0, StarshipConstants.STARSHIP_SCALE.y * StarshipConstants.LOX_BOTTOM_PERCENTAGE * this.options.shipRingHeight / StarshipConstants.REAL_LIFE_SCALE.y, 0)));
        }
    }

    public updateRaptors(delta: number): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.raptor != null) {
                rSea.userData.raptor.update(delta);

                rSea.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(rSea.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rSea.userData.raptor.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rSea.userData.raptor.gimbalAngle)))));
            }
        }
        for (let rVac of this.rVacs) {
            if (rVac.userData.raptor != null) {
                rVac.userData.raptor.update(delta);

                rVac.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(rVac.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rVac.userData.raptor.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rVac.userData.raptor.gimbalAngle)))));
            }
        }
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
        
        telemetry.update((value) => {
            value.rSeaGimbalingAngles = [];
            value.rSeaGimbalYs = [];
            value.rVacGimbalingAngles = [];
            value.rVacGimbalYs = [];
            return value;
        });
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
        let rSeaPositions = MathHelper.getCircularPositions(this.options.numRSeas, this.options.rSeaRadius * StarshipConstants.STARSHIP_SCALE.x / StarshipConstants.REAL_LIFE_SCALE.x, this.options.rSeaAngularOffset * Math.PI / 180);

        for (let i = 0; i < this.options.numRSeas; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions[i].clone().add(new Vector3(0, StarshipConstants.R_SEA_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            rSea.scale.copy(StarshipConstants.R_SEA_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            rSea.userData.originalRotation = new Euler(0, 0, 0);
            rSea.userData.raptor = new Raptor(true, this.options.rSeaType);

            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupRVacs(): void {
        let rVacPositions = MathHelper.getCircularPositions(this.options.numRVacs, this.options.rVacRadius * StarshipConstants.STARSHIP_SCALE.x / StarshipConstants.REAL_LIFE_SCALE.x, this.options.rVacAngularOffset * Math.PI / 180);

        for (let i = 0; i < this.options.numRVacs; i++) {
            let rVac = new Object3D();
            rVac.position.copy(rVacPositions[i].clone().add(new Vector3(0, StarshipConstants.R_VAC_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
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
            this.shipRing.scale.copy(StarshipConstants.SHIP_RING_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.shipRingHeight / StarshipConstants.REAL_LIFE_SCALE.y, 1)));
            
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
            this.controlGimbals();
            this.controlFlaps();
        }
        this.updateFrost(delta);
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