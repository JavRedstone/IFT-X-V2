import { Box3, Group, Object3D, Vector3 } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

export class SuperHeavy {
    public hsr: Group = new Group();
    public boosterRing: Group = new Group();
    public gridFins: Object3D[] = [];
    public chines: Object3D[] = [];
    public rSeas: Object3D[] = [];

    public numGridFins: number = 4;
    public numChines: number = 4;
    public numRSeas: number = 33;

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
        let gridFinPositions = MathHelper.getCircularPositions(this.numGridFins, SuperHeavyConstants.GRID_FIN_RADIUS);
        let gridFinRotations = MathHelper.getCircularRotations(this.numGridFins);

        for (let i = 0; i < this.numGridFins; i++) {
            let gridFin = new Object3D();
            gridFin.position.copy(gridFinPositions[i]);
            gridFin.rotation.copy(gridFinRotations[i]);
            this.gridFins.push(gridFin);
        }
    }

    public setupChines(): void {
        let chinePositions = MathHelper.getCircularPositions(this.numChines, SuperHeavyConstants.CHINES_RADIUS);
        let chineRotations = MathHelper.getCircularRotations(this.numChines);

        for (let i = 0; i < this.numChines; i++) {
            let chine = new Object3D();
            chine.position.copy(chinePositions[i]);
            chine.rotation.copy(chineRotations[i]);
            this.chines.push(chine);
        }
    }
}