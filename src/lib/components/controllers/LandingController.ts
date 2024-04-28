import { Vector2, Vector3 } from "three";
import { LaunchConstants } from "../constants/objects/LaunchConstants";
import { PDController } from "./PDController";
import { RaptorConstants } from "../constants/controls/RaptorConstants";
import { MathHelper } from "../helpers/MathHelper";

export class LandingController {
    public PDCx: PDController = null;
    public PDCy: PDController = null;
    public PDCz: PDController = null;

    public PDAngVelX: PDController = null;
    public PDAngVelY: PDController = null;
    public PDAngVelZ: PDController = null;

    public constructor(targetPosition: Vector3, targetAngVel: Vector3) {
        this.PDCx = new PDController(targetPosition.x, LaunchConstants.KP_X, LaunchConstants.KD_X)
        this.PDCy = new PDController(targetPosition.y, LaunchConstants.KP_Y, LaunchConstants.KD_Y);
        this.PDCz = new PDController(targetPosition.z, LaunchConstants.KP_Z, LaunchConstants.KD_Z)

        this.PDAngVelX = new PDController(targetAngVel.x, LaunchConstants.KP_ANG_VEL_X, LaunchConstants.KD_ANG_VEL_X);
        this.PDAngVelY = new PDController(targetAngVel.y, LaunchConstants.KP_ANG_VEL_Y, LaunchConstants.KD_ANG_VEL_Y);
        this.PDAngVelZ = new PDController(targetAngVel.z, LaunchConstants.KP_ANG_VEL_Z, LaunchConstants.KD_ANG_VEL_Z);
    }

    public update(relPosition: Vector3, angVel: Vector3, delta: number): void {
        this.PDCx.update(relPosition.x, delta);
        this.PDCy.update(relPosition.y, delta);
        this.PDCz.update(relPosition.z, delta);

        this.PDAngVelX.update(angVel.x, delta);
        this.PDAngVelY.update(angVel.y, delta);
        this.PDAngVelZ.update(angVel.z, delta);

        console.log(relPosition.x, this.PDCx.output, relPosition.z, this.PDCz.output)
    }

    public getGimbalAngleTarget(): number {
        return new Vector2(-this.PDCx.output, this.PDCz.output).length();
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

    public getGridFinYTarget(): number {
        return MathHelper.clamp(this.PDAngVelZ.output, -1, 1);
    }

    public getGridFinZTarget(): number {
        return MathHelper.clamp(this.PDAngVelY.output, -1, 1);
    }
}