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

    public group: Group = null;

    public hasSetupSingle: boolean = false;
    public hasUpdatedObb: boolean = false;

    constructor() {
        
    }

    public setupSingle(): void {
        if (this.top != null && this.body != null && this.arm1 != null && this.arm2 != null && this.carriageArms != null && this.qd != null && this.carriageQd != null && this.olm != null) {
            this.top.scale.copy(OLIT_CONSTANTS.TOP_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.body.scale.copy(OLIT_CONSTANTS.BODY_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.arm1.scale.copy(OLIT_CONSTANTS.ARM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.arm1.rotation.copy(OLIT_CONSTANTS.ARM_ROTATION_1);
            this.arm2.scale.copy(OLIT_CONSTANTS.ARM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.arm2.rotation.copy(OLIT_CONSTANTS.ARM_ROTATION_2);
            this.carriageArms.scale.copy(OLIT_CONSTANTS.CARRIAGE_ARM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.qd.scale.copy(OLIT_CONSTANTS.QD_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.qd.rotation.copy(OLIT_CONSTANTS.QD_ROTATION);
            this.carriageQd.scale.copy(OLIT_CONSTANTS.CARRIAGE_QD_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.olm.scale.copy(OLIT_CONSTANTS.OLM_SCALE.clone().multiply(OLIT_CONSTANTS.OLIT_SCALE));
            this.olm.rotation.copy(OLIT_CONSTANTS.OLM_ROTATION);
            this.olm.position.copy(this.body.position.clone().add(OLIT_CONSTANTS.OLM_OFFSET).multiply(OLIT_CONSTANTS.OLIT_SCALE));

            this.hasSetupSingle = true;
        }
    }

    public updateObb(): void {
        if (this.top != null && this.body != null && this.arm1 != null && this.arm2 != null && this.carriageArms != null && this.qd != null && this.carriageQd != null && this.olm != null) {
            if (this.top.userData.aabb == null || this.body.userData.aabb == null || this.arm1.userData.aabb == null || this.arm2.userData.aabb == null || this.carriageArms.userData.aabb == null || this.qd.userData.aabb == null || this.carriageQd.userData.aabb == null || this.olm.userData.aabb == null ||
                this.top.userData.aabb.getSize(new Vector3).length() == 0 || this.body.userData.aabb.getSize(new Vector3).length() == 0 || this.arm1.userData.aabb.getSize(new Vector3).length() == 0 || this.arm2.userData.aabb.getSize(new Vector3).length() == 0 || this.carriageArms.userData.aabb.getSize(new Vector3).length() == 0 || this.qd.userData.aabb.getSize(new Vector3).length() == 0 || this.carriageQd.userData.aabb.getSize(new Vector3).length() == 0 || this.olm.userData.aabb.getSize(new Vector3).length() == 0) {
                this.top.userData.aabb = ObjectHelper.getAabb(this.top);
                this.body.userData.aabb = ObjectHelper.getAabb(this.body);
                this.arm1.userData.aabb = ObjectHelper.getAabb(this.arm1);
                this.arm2.userData.aabb = ObjectHelper.getAabb(this.arm2);
                this.carriageArms.userData.aabb = ObjectHelper.getAabb(this.carriageArms);
                this.qd.userData.aabb = ObjectHelper.getAabb(this.qd);
                this.carriageQd.userData.aabb = ObjectHelper.getAabb(this.carriageQd);
                this.olm.userData.aabb = ObjectHelper.getAabb(this.olm);
            }
            // this.top.userData.aabb.applyMatrix4(this.top.matrixWorld);
            // this.body.userData.aabb.applyMatrix4(this.body.matrixWorld);
            // this.arm1.userData.aabb.applyMatrix4(this.arm1.matrixWorld);
            // this.arm2.userData.aabb.applyMatrix4(this.arm2.matrixWorld);
            // this.carriageArms.userData.aabb.applyMatrix4(this.carriageArms.matrixWorld);
            // this.qd.userData.aabb.applyMatrix4(this.qd.matrixWorld);
            // this.carriageQd.userData.aabb.applyMatrix4(this.carriageQd.matrixWorld);
            // this.olm.userData.aabb.applyMatrix4(this.olm.matrixWorld);
        }
    }

    public updateObjects(): void {
        if (this.top != null && this.body != null && this.arm1 != null && this.arm2 != null && this.carriageArms != null && this.qd != null && this.carriageQd != null && this.olm != null && this.top.userData.aabb.getSize(new Vector3).x != 0 && this.body.userData.aabb.getSize(new Vector3).x != 0 && this.arm1.userData.aabb.getSize(new Vector3).x != 0 && this.arm2.userData.aabb.getSize(new Vector3).x != 0 && this.carriageArms.userData.aabb.getSize(new Vector3).x != 0 && this.qd.userData.aabb.getSize(new Vector3).x != 0 && this.carriageQd.userData.aabb.getSize(new Vector3).x != 0 && this.olm.userData.aabb.getSize(new Vector3).x != 0) {
            this.top.position.copy(this.body.position.clone().add(new Vector3(0, this.body.userData.aabb.getSize(new Vector3).y, 0)));
            this.arm1.position.copy(this.body.position.clone().add(new Vector3(0, OLIT_CONSTANTS.ARM_BOTTOM_OFFSET * this.body.userData.aabb.getSize(new Vector3).y, 0)));
            this.arm2.position.copy(this.body.position.clone().add(new Vector3(0, OLIT_CONSTANTS.ARM_BOTTOM_OFFSET * this.body.userData.aabb.getSize(new Vector3).y, 0)));
            this.carriageArms.position.copy(this.body.position.clone().add(new Vector3(0, OLIT_CONSTANTS.ARM_BOTTOM_OFFSET * this.body.userData.aabb.getSize(new Vector3).y, 0)));
            this.qd.position.copy(this.body.position.clone().add(new Vector3(0, OLIT_CONSTANTS.QD_BOTTOM_OFFSET * this.body.userData.aabb.getSize(new Vector3).y, 0)));
            this.carriageQd.position.copy(this.body.position.clone().add(new Vector3(0, OLIT_CONSTANTS.QD_BOTTOM_OFFSET * this.body.userData.aabb.getSize(new Vector3).y, 0)));
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