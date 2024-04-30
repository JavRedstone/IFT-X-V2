import { Vector2, Vector3 } from "three";
import { LaunchConstants } from "../constants/objects/LaunchConstants";
import { PDController } from "./PDController";
import { MathHelper } from "../helpers/MathHelper";
import { PController } from "./PController";

export class LandingController {
    public PDCx: PDController = null;
    public PDCy: PDController = null;
    public PDCz: PDController = null;

    public PDAngVelX: PController = null;
    public PDAngVelY: PController = null;
    public PDAngVelZ: PController = null;

    public constructor(targetPosition: Vector3, targetAngVel: Vector3) {
        this.PDCx = new PDController(targetPosition.x, LaunchConstants.KP_X, LaunchConstants.KD_X)
        this.PDCy = new PDController(targetPosition.y, LaunchConstants.KP_Y, LaunchConstants.KD_Y);
        this.PDCz = new PDController(targetPosition.z, LaunchConstants.KP_Z, LaunchConstants.KD_Z)

        this.PDAngVelX = new PController(targetAngVel.x, LaunchConstants.KP_ANG_VEL_X);
        this.PDAngVelY = new PController(targetAngVel.y, LaunchConstants.KP_ANG_VEL_Y);
        this.PDAngVelZ = new PController(targetAngVel.z, LaunchConstants.KP_ANG_VEL_Z);
    }

    public update(relPosition: Vector3, angVel: Vector3, delta: number): void {
        this.PDCx.update(relPosition.x, delta);
        this.PDCy.update(relPosition.y, delta);
        this.PDCz.update(relPosition.z, delta);

        this.PDAngVelX.update(angVel.x);
        this.PDAngVelY.update(angVel.y);
        this.PDAngVelZ.update(angVel.z);
    }

    public getGimbalAngleTarget(): number {
        return MathHelper.clamp(new Vector2(-this.PDCx.output, this.PDCz.output).length(), 0, 1);
    }

    public getGimbalYTarget(): number {
        return new Vector2(-this.PDCx.output, this.PDCz.output).angle();
    }

    public getThrust(): number {
        return this.PDCy.output;
    }

    public getGridFinXTarget(): number {
        return MathHelper.clamp(this.PDAngVelX.output, -1, 1);
    }

    public getGridFinFlapYTarget(): number {
        return MathHelper.clamp(this.PDAngVelY.output, -1, 1);
    }

    public getGridFinFlapZTarget(): number {
        return MathHelper.clamp(this.PDAngVelZ.output, -1, 1);
    }
}