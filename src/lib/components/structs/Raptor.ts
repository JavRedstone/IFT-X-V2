import { RaptorConstants } from "../constants/controls/RaptorConstants";

export class Raptor {
    public isSea: boolean = true;
    public type: number = 0;

    public throttle: number = 0;
    public tThrottle: number = 0;

    public gimbalAngle: number = 0;
    public tGimbalAngle: number = 0;

    public angleY: number = 0;
    public tAngleY: number = 0;

    public constructor(isSea: boolean, type: number) {
        this.isSea = isSea;
        this.type = type;

        this.throttle = 0;
        
        this.gimbalAngle = 0;
        this.angleY = 0;
        this.tGimbalAngle = 0;
        this.tAngleY = 0;
    }

    public setThrottleTarget(Tthrottle: number): void {
        this.tThrottle = Tthrottle;
    }

    public setGimbalTarget(tGimbalAngle: number, tAngleY: number): void {
        this.tGimbalAngle = tGimbalAngle;
        this.tAngleY = tAngleY;
        if (this.tGimbalAngle == 0 && this.tAngleY == 0) {
            this.tAngleY = this.angleY;
        }
    }

    public update(delta: number): void {
        this.updateThrottle(delta);
        this.updateGimbal(delta);
    }

    public updateThrottle(delta: number): void {
        let diff = this.tThrottle - this.throttle;
        let step = diff > 0 ? RaptorConstants.THROTTLE_UP_VEL * delta : RaptorConstants.THROTTLE_DOWN_VEL * delta;
        if (this.throttle <= RaptorConstants.MIN_THROTTLE && this.tThrottle >= RaptorConstants.MIN_THROTTLE && diff > 0) {
            this.throttle = RaptorConstants.MIN_THROTTLE;
        }
        
        if (Math.abs(diff) < step)
            this.throttle = this.tThrottle;
        else
            this.throttle += diff > 0 ? step : -step;

        if (this.throttle <= RaptorConstants.MIN_THROTTLE && this.tThrottle <= RaptorConstants.MIN_THROTTLE) {
            this.throttle = 0;
        }
    }

    public updateGimbal(delta: number): void {
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
        this.throttle = 0;
        this.tThrottle = 0;
        
        this.gimbalAngle = 0;
        this.tGimbalAngle = 0;

        this.angleY = 0;
        this.tAngleY = 0;
    }
}