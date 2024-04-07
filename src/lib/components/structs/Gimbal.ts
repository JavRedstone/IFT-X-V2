import { RaptorConstants } from "../constants/controls/RaptorConstants";

export class Gimbal {
    public isSea: boolean = true;
    public gimbalAngle: number = 0;
    public angleY: number = 0;
    public tGimbalAngle: number = 0;
    public tAngleY: number = 0;

    public constructor(isSea: boolean) {
        this.isSea = isSea;
        this.gimbalAngle = 0;
        this.angleY = 0;
        this.tGimbalAngle = 0;
        this.tAngleY = 0;
    }

    public setTarget(tGimbalAngle: number, tAngleY: number): void {
        this.tGimbalAngle = tGimbalAngle;
        this.tAngleY = tAngleY;
        if (this.tGimbalAngle == 0 && this.tAngleY == 0) {
            this.tAngleY = this.angleY;
        }
    }

    public update(delta: number): void {
        if (this.gimbalAngle == 0) {
            this.angleY = this.tAngleY;
        }
        if (this.gimbalAngle != this.tGimbalAngle) {
            let diff = this.tGimbalAngle - this.gimbalAngle;
            let step = (this.isSea ? RaptorConstants.R_SEA_GIMBAL_ANG_VEL : RaptorConstants.R_VAC_GIMBAL_ANG_VEL) * delta;
            if (Math.abs(diff) < step)
                this.gimbalAngle = this.tGimbalAngle;
            else
                this.gimbalAngle += diff > 0 ? step : -step;
        }
        if (this.angleY != this.tAngleY) {
            let diff = this.tAngleY - this.angleY;
            if (diff > Math.PI) {
                diff -= Math.PI * 2;
            }
            if (diff < -Math.PI) {
                diff += Math.PI * 2;
            }
            let step = RaptorConstants.GIMBAL_Y_ANG_VEL * delta;
            if (Math.abs(diff) < step)
                this.angleY = this.tAngleY;
            else
                this.angleY += diff > 0 ? step : -step;
        }
    }

    public reset(): void {
        this.gimbalAngle = 0;
        this.angleY = 0;
        this.tGimbalAngle = 0;
        this.tAngleY = 0;
    }
}