import { Euler, Group, Object3D, Quaternion, Vector2, Vector3 } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { keyPresses, superHeavySettings, telemetry, toggles } from "../stores/ui-store";
import { LaunchConstants } from "../constants/objects/LaunchConstants";
import { Gimbal } from "../structs/Gimbal";
import { RaptorConstants } from "../constants/controls/RaptorConstants";
import { GridFin } from "../structs/GridFin";
import { GridFinConstants } from "../constants/controls/GridFinConstants";

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
    public LOX: number = 0;
    public CH4: number = 0;
    public visibilityCooldown: number = SuperHeavyConstants.VISIBILITY_COOLDOWN;

    public controls: any = {
        isUpPressed: false,
        isDownPressed: false,
        isLeftPressed: false,
        isRightPressed: false,
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
        canRSea1Gimbal: SuperHeavyConstants.CAN_R_SEA_1_GIMBAL,
        rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2,
        numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
        canRSea2Gimbal: SuperHeavyConstants.CAN_R_SEA_2_GIMBAL,
        rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3,
        numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
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
        });
        keyPresses.subscribe((value) => {
            this.controls.isUpPressed = value.isUpPressed;
            this.controls.isDownPressed = value.isDownPressed;
            this.controls.isLeftPressed = value.isLeftPressed;
            this.controls.isRightPressed = value.isRightPressed;
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
            this.options.canRSea1Gimbal = value.canRSea1Gimbal;
            this.options.rSeaRadius2 = value.rSeaRadius2;
            this.options.numRSeas2 = value.numRSeas2;
            this.options.canRSea2Gimbal = value.canRSea2Gimbal;
            this.options.rSeaRadius3 = value.rSeaRadius3;
            this.options.numRSeas3 = value.numRSeas3;
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
                if (rSea.userData.gimbal != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.gimbal.gimbalAngle == 0) {
                        rSea.userData.gimbal.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.gimbal.angleY = 0;
                    } else {
                        rSea.userData.gimbal.setTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.gimbal.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }

                    rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.gimbal.gimbalAngle];
                    rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.gimbal.angleY];
                }
            }
        }
        if (this.options.canRSea2Gimbal) {
            for (let i = 0; i < this.options.numRSeas2; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1];
                if (rSea.userData.gimbal != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.gimbal.gimbalAngle == 0) {
                        rSea.userData.gimbal.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.gimbal.angleY = 0;
                    } else {
                        rSea.userData.gimbal.setTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.gimbal.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }

                    rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.gimbal.gimbalAngle];
                    rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.gimbal.angleY];
                }
            }
        }
        if (this.options.canRSea3Gimbal) {
            for (let i = 0; i < this.options.numRSeas3; i++) {
                let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                if (rSea.userData.gimbal != null && rSea.userData.originalRotation != null) {
                    if (rSea.userData.gimbal.gimbalAngle == 0) {
                        rSea.userData.gimbal.gimbalAngle = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE;
                        rSea.userData.gimbal.angleY = 0;
                    } else {
                        rSea.userData.gimbal.setTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, rSea.userData.gimbal.tAngleY + RaptorConstants.GIMBAL_Y_ANG_VEL * delta);
                    }

                    rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.gimbal.gimbalAngle];
                    rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.gimbal.angleY];
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

    public updateGimbals(delta: number): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.gimbal != null) {
                rSea.userData.gimbal.update(delta);

                rSea.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(rSea.userData.originalRotation).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rSea.userData.gimbal.angleY).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rSea.userData.gimbal.gimbalAngle)))));
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

    public resetGimbals(): void {
        for (let rSea of this.rSeas) {
            if (rSea.userData.gimbal != null) {
                rSea.userData.gimbal.reset();
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

    public controlGimbals(): void {
        let combinedVector: Vector2 = new Vector2(0, 0);
        if (this.controls.isUpPressed) {
            combinedVector.y += 1;
        }
        if (this.controls.isDownPressed) {
            combinedVector.y -= 1;
        }
        if (this.controls.isLeftPressed) {
            combinedVector.x += 1; // gimbal angle thing is broken so workaround
        }
        if (this.controls.isRightPressed) {
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
                    if (rSea.userData.gimbal != null) {
                        rSea.userData.gimbal.setTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.gimbal.gimbalAngle];
                        rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.gimbal.angleY];
                    }
                }
            }
            if (this.options.canRSea2Gimbal) {
                for (let i = 0; i < this.options.numRSeas2; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1];
                    if (rSea.userData.gimbal != null) {
                        rSea.userData.gimbal.setTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.gimbal.gimbalAngle];
                        rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.gimbal.angleY];
                    }
                }
            }
            if (this.options.canRSea3Gimbal) {
                for (let i = 0; i < this.options.numRSeas3; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                    if (rSea.userData.gimbal != null) {
                        rSea.userData.gimbal.setTarget(RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE, angleY);

                        rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.gimbal.gimbalAngle];
                        rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.gimbal.angleY];
                    }
                }
            }
        }
        else {
            if (this.options.canRSea1Gimbal) {
                for (let i = 0; i < this.options.numRSeas1; i++) {
                    let rSea = this.rSeas[i];
                    if (rSea.userData.gimbal != null) {
                        rSea.userData.gimbal.setTarget(0, 0);

                        rSeaGimbalingAngles1 = [...rSeaGimbalingAngles1, rSea.userData.gimbal.gimbalAngle];
                        rSeaGimbalYs1 = [...rSeaGimbalYs1, rSea.userData.gimbal.angleY];
                    }
                }
            }
            if (this.options.canRSea2Gimbal) {
                for (let i = 0; i < this.options.numRSeas2; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1];
                    if (rSea.userData.gimbal != null) {
                        rSea.userData.gimbal.setTarget(0, 0);

                        rSeaGimbalingAngles2 = [...rSeaGimbalingAngles2, rSea.userData.gimbal.gimbalAngle];
                        rSeaGimbalYs2 = [...rSeaGimbalYs2, rSea.userData.gimbal.angleY];
                    }
                }
            }
            if (this.options.canRSea3Gimbal) {
                for (let i = 0; i < this.options.numRSeas3; i++) {
                    let rSea = this.rSeas[i + this.options.numRSeas1 + this.options.numRSeas2];
                    if (rSea.userData.gimbal != null) {
                        rSea.userData.gimbal.setTarget(0, 0);

                        rSeaGimbalingAngles3 = [...rSeaGimbalingAngles3, rSea.userData.gimbal.gimbalAngle];
                        rSeaGimbalYs3 = [...rSeaGimbalYs3, rSea.userData.gimbal.angleY];
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

    public updateFrost(delta: number): void {
        if (this.isFueling && !this.hasStartedFueling) {
            telemetry.update((value) => {
                value.superHeavyCH4 = 0;
                value.superHeavyLOX = 0;

                return value;
            });
        }
        if (this.hasStartedFueling) {
            let CH4Volume: number = MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, this.options.boosterRingHeight * SuperHeavyConstants.CH4_PERCENTAGE);   
            let LOXVolume: number = MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, this.options.boosterRingHeight * SuperHeavyConstants.LOX_PERCENTAGE);
            
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
            rSea.userData.gimbal = new Gimbal();

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
            rSea.userData.gimbal = new Gimbal();

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
            rSea.userData.gimbal = new Gimbal();

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
            this.resetGimbals();
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
        }
        this.updateFrost(delta);
        this.updateGimbals(delta);
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