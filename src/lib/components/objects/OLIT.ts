import { Box3, Group, Vector3 } from "three";

export class OLIT {
    public top: Group = new Group();
    public body: Group = new Group();
    public arm1: Group = new Group();
    public arm2: Group = new Group();
    public qd: Group = new Group();

    public olm: Group = new Group();

    public group: Group = new Group();

    constructor() {
        
    }

    public updateScene(delta: number): void {

    }
}