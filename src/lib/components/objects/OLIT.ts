import { Box3, Group, Vector3 } from "three";
import { OLIT_CONSTANTS } from "../constants/objects/OLITConstants";

export class OLIT {
    public top: Group = new Group();
    public body: Group = new Group();
    public arm1: Group = new Group();
    public arm2: Group = new Group();
    public carriageArms: Group = new Group();
    public qd: Group = new Group();
    public carriageQd: Group = new Group();

    public olm: Group = new Group();

    public group: Group = new Group();

    public hasSetupSingle: boolean = false;

    constructor() {
        
    }

    public updateObjects(): void {
        if (this.top != null && this.body != null && this.arm1 != null && this.arm2 != null && this.carriageArms != null && this.qd != null && this.carriageQd != null && this.olm != null) {
            
        }
    }

    public updateScene(delta: number): void {
        this.updateObjects();
    }
}