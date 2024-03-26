import { Box3, Euler, Group, Object3D, Quaternion, Vector3 } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";
import { ObjectHelper } from "../helpers/ObjectHelper";

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

    public group: Group = null;

    public hasSetupSingle: boolean = false;
    public hasUpdatedObb: boolean = false;

    public options: any = {
        gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET,
        chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET,
        rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1,
        rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2,
        rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3,

        rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1,
        rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2,
        rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3
    };

    constructor() {
        this.setupMultiple();
    }

    public setupMultiple(): void {
        this.setupGridFins();
        this.setupChines();
        this.setupRSeas();
        this.setupOuterCylinders();
    }

    public setupGridFins(): void {
        let gridFinPositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_GRID_FINS, SuperHeavyConstants.GRID_FIN_RADIUS * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.gridFinAngularOffset);
        let gridFinRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_GRID_FINS, this.options.gridFinAngularOffset);

        for (let i = 0; i < SuperHeavyConstants.NUM_GRID_FINS; i++) {
            let gridFin = new Object3D();
            gridFin.position.copy(gridFinPositions[i]);
            gridFinRotations[i] = new Euler(gridFinRotations[i].x + SuperHeavyConstants.GRID_FIN_ROTATION.x, gridFinRotations[i].z, -gridFinRotations[i].y);
            gridFin.rotation.copy(gridFinRotations[i]);
            let scaleRef: Vector3 = SuperHeavyConstants.GRID_FIN_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE);
            gridFin.scale.copy(new Vector3(scaleRef.x, scaleRef.z, scaleRef.y));
            this.gridFins = [...this.gridFins, gridFin];
        }
    }

    public setupChines(): void {
        let chinePositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_CHINES, SuperHeavyConstants.CHINE_RADIUS * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.chineAngularOffset);
        let chineRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_CHINES, this.options.chineAngularOffset);

        for (let i = 0; i < SuperHeavyConstants.NUM_CHINES; i++) {
            let chine = new Object3D();
            chine.position.copy(chinePositions[i].clone().add(new Vector3(0, SuperHeavyConstants.CHINE_BOTTOM_OFFSET * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            chineRotations[i] = new Euler(chineRotations[i].x, chineRotations[i].y + SuperHeavyConstants.CHINE_ROTATION.y, chineRotations[i].z);
            chine.rotation.copy(chineRotations[i]);
            chine.scale.copy(SuperHeavyConstants.CHINE_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.chines = [...this.chines, chine];
        }
    }

    public setupRSeas(): void {
        let rSeaPositions1 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_1, SuperHeavyConstants.R_SEA_RADIUS_1 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.rSeaAngularOffset1);
        let rSeaRotations1 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_1, this.options.rSeaAngularOffset1);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_1; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions1[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_1 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations1[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions2 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_2, SuperHeavyConstants.R_SEA_RADIUS_2 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.rSeaAngularOffset2);
        let rSeaRotations2 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_2, this.options.rSeaAngularOffset2);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_2; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions2[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_2 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations2[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions3 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_3, SuperHeavyConstants.R_SEA_RADIUS_3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.rSeaAngularOffset3);
        let rSeaRotations3 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_3, this.options.rSeaAngularOffset3);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_3; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions3[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations3[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupOuterCylinders(): void {
        let outerCylinderPositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_3, SuperHeavyConstants.OUTER_CYLINDER_RADIUS * SuperHeavyConstants.SUPER_HEAVY_SCALE.x, this.options.rSeaAngularOffset3);
        let outerCylinderRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_3, this.options.rSeaAngularOffset3);
        
        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_3; i++) {
            let outerCylinder = new Object3D();
            outerCylinder.position.copy(outerCylinderPositions[i].clone().add(new Vector3(0, SuperHeavyConstants.R_SEA_HEIGHT_3 * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
            outerCylinder.rotation.copy(outerCylinderRotations[i]);
            outerCylinder.scale.copy(SuperHeavyConstants.OUTER_CYLINDER_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.outerCylinders = [...this.outerCylinders, outerCylinder];
        }
    }

    public setupSingle(): void {
        if (this.hsr != null && this.boosterRing != null) {
            this.hsr.scale.copy(SuperHeavyConstants.HSR_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.boosterRing.scale.copy(SuperHeavyConstants.BOOSTER_RING_SCALE.clone().multiply(SuperHeavyConstants.SUPER_HEAVY_SCALE));
            this.hasSetupSingle = true;
        }
    }

    public updateObb(): void {
        if (this.hsr != null && this.boosterRing != null) {
            if (this.hsr.userData.aabb == null || this.boosterRing.userData.aabb == null || this.hsr.userData.aabb.getSize(new Vector3).length() == 0 || this.boosterRing.userData.aabb.getSize(new Vector3).length() == 0) {
                this.hsr.userData.aabb = ObjectHelper.getAabb(this.hsr);
                this.boosterRing.userData.aabb = ObjectHelper.getAabb(this.boosterRing);
            }
            // this.hsr.userData.aabb.applyMatrix4(this.hsr.matrixWorld);
            // this.boosterRing.userData.aabb.applyMatrix4(this.boosterRing.matrixWorld);
        }
        for (let gridFinObj of this.gridFinObjs) {
            if (gridFinObj.userData.aabb == null || gridFinObj.userData.aabb.getSize(new Vector3).length() == 0) {
                gridFinObj.userData.aabb = ObjectHelper.getAabb(gridFinObj);
            }
            // gridFinObj.userData.aabb.applyMatrix4(gridFinObj.matrixWorld);
        }
        for (let chineObj of this.chineObjs) {
            if (chineObj.userData.aabb == null || chineObj.userData.aabb.getSize(new Vector3).length() == 0) {
                chineObj.userData.aabb = ObjectHelper.getAabb(chineObj);
            }
            // chineObj.userData.aabb.applyMatrix4(chineObj.matrixWorld);
        }
        for (let rSeaObj of this.rSeaObjs) {
            if (rSeaObj.userData.aabb == null || rSeaObj.userData.aabb.getSize(new Vector3).length() == 0) {
                rSeaObj.userData.aabb = ObjectHelper.getAabb(rSeaObj);
            }
            // rSeaObj.userData.aabb.applyMatrix4(rSeaObj.matrixWorld);
        }
    }

    public updateObjects(): void {
        if (this.hsr != null && this.boosterRing != null && this.hsr.userData.aabb.getSize(new Vector3).length() != 0 && this.boosterRing.userData.aabb.getSize(new Vector3).length() != 0) {
            this.hsr.position.copy(this.boosterRing.position.clone().add(new Vector3(0, this.boosterRing.userData.aabb.getSize(new Vector3).y, 0)));
            for (let gridFinObj of this.gridFinObjs) {
                if (gridFinObj.userData.aabb.getSize(new Vector3).length() != 0) {
                    gridFinObj.position.copy(new Vector3(gridFinObj.position.x, this.boosterRing.position.y + this.boosterRing.userData.aabb.getSize(new Vector3).y - SuperHeavyConstants.GRID_FIN_TOP_OFFSET * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, gridFinObj.position.z));
                }
            }
            this.hasUpdatedObb = true;
        }
    }

    public updateScene(delta: number): void {
        if (!this.hasSetupSingle) {
            this.setupSingle();
        }
        else {
            this.updateObb();
            this.updateObjects();
        }
    }
}