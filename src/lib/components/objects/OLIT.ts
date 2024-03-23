import { Box3, Group, Vector3 } from "three";
import { OLIT_CONSTANTS } from "../constants/objects/OLITConstants";
import { ObjectHelper } from "../helpers/ObjectHelper";

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

    public setupSingle(): void {
        if (this.top != null && this.body != null && this.arm1 != null && this.arm2 != null && this.carriageArms != null && this.qd != null && this.carriageQd != null && this.olm != null) {
            this.top.scale.copy(OLIT_CONSTANTS.TOP_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.body.scale.copy(OLIT_CONSTANTS.BODY_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.arm1.scale.copy(OLIT_CONSTANTS.ARM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.arm2.scale.copy(OLIT_CONSTANTS.ARM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.carriageArms.scale.copy(OLIT_CONSTANTS.CARRIAGE_ARM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.qd.scale.copy(OLIT_CONSTANTS.QD_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.carriageQd.scale.copy(OLIT_CONSTANTS.CARRIAGE_QD_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.olm.scale.copy(OLIT_CONSTANTS.OLM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
        }
    }

    public updateObjects(): void {
        if (this.top != null && this.body != null && this.arm1 != null && this.arm2 != null && this.carriageArms != null && this.qd != null && this.carriageQd != null && this.olm != null) {
            this.top.position.copy(this.body.position.clone().add(new Vector3(0, ObjectHelper.getObjectDimensions(this.body).y, 0)));
        }
    }

    public updateScene(delta: number): void {
        if (!this.hasSetupSingle) {
            this.setupSingle();
        }
        else {
            this.updateObjects();
        }
    }
}