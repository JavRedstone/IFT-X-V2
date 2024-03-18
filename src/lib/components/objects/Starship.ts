import { Box3, Group, Object3D, Vector3 } from "three";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { MathHelper } from "../helpers/MathHelper";

export class Starship {
    public nosecone: Group = new Group();
    public shipRing: Group = new Group();
    public forwardL: Group = new Group();
    public forwardR: Group = new Group();
    public aftL: Group = new Group();
    public aftR: Group = new Group();
    public rSeas: Object3D[] = [];
    public rVacs: Object3D[] = [];
    
    public group: Group = new Group();

    constructor() {
        this.setupMultiple();
    }

    public setupMultiple(): void {
        this.setupRSeas();
        this.setupRVacs();
    }

    public setupRSeas(): void {
        let rSeaPositions = MathHelper.getCircularPositions(StarshipConstants.NUM_R_SEAS, StarshipConstants.R_SEA_RADIUS);
        let rSeaRotations = MathHelper.getCircularRotations(StarshipConstants.NUM_R_SEAS);

        for (let i = 0; i < StarshipConstants.NUM_R_SEAS; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions[i]);
            rSea.rotation.copy(rSeaRotations[i]);
            this.rSeas.push(rSea);
        }
    }

    public setupRVacs(): void {
        let rVacPositions = MathHelper.getCircularPositions(StarshipConstants.NUM_R_VACS, StarshipConstants.R_VAC_RADIUS);
        let rVacRotations = MathHelper.getCircularRotations(StarshipConstants.NUM_R_VACS);

        for (let i = 0; i < StarshipConstants.NUM_R_VACS; i++) {
            let rVac = new Object3D();
            rVac.position.copy(rVacPositions[i]);
            rVac.rotation.copy(rVacRotations[i]);
            this.rVacs.push(rVac);
        }
    }

    public setupSingle(): void {

    }
}