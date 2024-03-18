import { Box3, Group, Object3D, Vector3 } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

export class SuperHeavy {
    public hsr: Group = new Group();
    public boosterRing: Group = new Group();
    public gridFins: Object3D[] = [];
    public chines: Object3D[] = [];
    public rSeas: Object3D[] = [];

    public group: Group = new Group();

    constructor() {
        this.setupMultiple();
    }

    public setupMultiple(): void {
        this.setupGridFins();
        this.setupChines();
        this.setupRSeas();
    }

    public setupGridFins(): void {
        let gridFinPositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_GRID_FINS, SuperHeavyConstants.GRID_FIN_RADIUS);
        let gridFinRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_GRID_FINS);

        for (let i = 0; i < SuperHeavyConstants.NUM_GRID_FINS; i++) {
            let gridFin = new Object3D();
            gridFin.position.copy(gridFinPositions[i]);
            gridFin.rotation.copy(gridFinRotations[i]);
            this.gridFins.push(gridFin);
        }
    }

    public setupChines(): void {
        let chinePositions = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_CHINES, SuperHeavyConstants.CHINE_RADIUS);
        let chineRotations = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_CHINES);

        for (let i = 0; i < SuperHeavyConstants.NUM_CHINES; i++) {
            let chine = new Object3D();
            chine.position.copy(chinePositions[i]);
            chine.rotation.copy(chineRotations[i]);
            this.chines.push(chine);
        }
    }

    public setupRSeas(): void {
        let rSeaPositions1 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_1, SuperHeavyConstants.R_SEA_RADIUS_1);
        let rSeaRotations1 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_1);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_1; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions1[i]);
            rSea.rotation.copy(rSeaRotations1[i]);
            this.rSeas.push(rSea);
        }

        let rSeaPositions2 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_2, SuperHeavyConstants.R_SEA_RADIUS_2);
        let rSeaRotations2 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_2);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_2; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions2[i]);
            rSea.rotation.copy(rSeaRotations2[i]);
            this.rSeas.push(rSea);
        }

        let rSeaPositions3 = MathHelper.getCircularPositions(SuperHeavyConstants.NUM_R_SEAS_3, SuperHeavyConstants.R_SEA_RADIUS_3);
        let rSeaRotations3 = MathHelper.getCircularRotations(SuperHeavyConstants.NUM_R_SEAS_3);

        for (let i = 0; i < SuperHeavyConstants.NUM_R_SEAS_3; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions3[i]);
            rSea.rotation.copy(rSeaRotations3[i]);
            this.rSeas.push(rSea);
        }
    }
}