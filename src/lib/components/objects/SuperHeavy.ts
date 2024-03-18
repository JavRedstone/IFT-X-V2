import { Box3, Group, Object3D, Vector3 } from "three";

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
        
    }
}