import { Box3, Euler, Group, Object3D, Quaternion, Vector3 } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

export class SuperHeavy {
    public hsr: Group = new Group();
    public boosterRing: Group = new Group();
    public gridFins: Object3D[] = [];
    public chines: Object3D[] = [];
    public rSeas: Object3D[] = [];

    public group: Group = new Group();

    public options: any = {
        gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET,
        chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET,
        rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1,
        rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2,
        rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3,
    };

    constructor() {
        this.setupMultiple();
    }

    public setupMultiple(): void {
        this.setupGridFins();
        this.setupChines();
        this.setupRSeas();
    }

    public setupGridFins(): void {
        let gridFinPositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_GRID_FINS, SuperHeavyConstants.GRID_FIN_RADIUS, this.options.gridFinAngularOffset);
        let gridFinRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_GRID_FINS, this.options.gridFinAngularOffset);

        for (let i = 0; i < SuperHeavyConstants.NUM_GRID_FINS; i++) {
            let gridFin = new Object3D();
            gridFin.position.copy(gridFinPositions[i]);
            gridFin.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(gridFinRotations[i]).multiply(new Quaternion().setFromEuler(SuperHeavyConstants.GRID_FIN_ROTATION))));
            gridFin.scale.copy(SuperHeavyConstants.GRID_FIN_SCALE);
            this.gridFins = [...this.gridFins, gridFin];
        }
    }

    public setupChines(): void {
        let chinePositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_CHINES, SuperHeavyConstants.CHINE_RADIUS, this.options.chineAngularOffset);
        let chineRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_CHINES, this.options.chineAngularOffset);

        for (let i = 0; i < SuperHeavyConstants.NUM_CHINES; i++) {
            let chine = new Object3D();
            chine.position.copy(chinePositions[i]);
            chine.rotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(chineRotations[i]).multiply(new Quaternion().setFromEuler(SuperHeavyConstants.CHINE_ROTATION))));
            chine.scale.copy(SuperHeavyConstants.CHINE_SCALE);
            this.chines = [...this.chines, chine];
        }
    }

    public setupRSeas(): void {
        let rSeaPositions1 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_1, SuperHeavyConstants.R_SEA_RADIUS_1, this.options.rSeaAngularOffset1);
        let rSeaRotations1 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_1, this.options.rSeaAngularOffset1);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_1; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions1[i]);
            rSea.rotation.copy(rSeaRotations1[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE);
            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions2 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_2, SuperHeavyConstants.R_SEA_RADIUS_2, this.options.rSeaAngularOffset2);
        let rSeaRotations2 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_2, this.options.rSeaAngularOffset2);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_2; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions2[i]);
            rSea.rotation.copy(rSeaRotations2[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE);
            this.rSeas = [...this.rSeas, rSea];
        }

        let rSeaPositions3 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_3, SuperHeavyConstants.R_SEA_RADIUS_3, this.options.rSeaAngularOffset3);
        let rSeaRotations3 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_3, this.options.rSeaAngularOffset3);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_3; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions3[i]);
            rSea.rotation.copy(rSeaRotations3[i]);
            rSea.scale.copy(SuperHeavyConstants.R_SEA_SCALE);
            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public updateScene(delta: number): void {
        
    }
}