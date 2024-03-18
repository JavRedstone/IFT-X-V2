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

    public numRSeas: number = 3;
    public numRVacs: number = 3;

    public group: Group = new Group();

    constructor() {
        this.setup();
    }

    public setup(): void {
        let rSeaPositions = MathHelper.getCircularPositions(this.numRSeas, StarshipConstants.STARSHIP_RADIUS);
    }
}