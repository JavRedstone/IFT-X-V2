import { FlapConstants } from "../constants/controls/FlapConstants";

export class Flap {
    public angle: number = FlapConstants.MIN_ANGLE;
    public tAngle: number = FlapConstants.MIN_ANGLE;

    public constructor() {
        this.angle = FlapConstants.MIN_ANGLE;
        this.tAngle = FlapConstants.MIN_ANGLE;
    }

    public setTarget(tAngle: number): void {
        this.tAngle = tAngle;
    }

    public update(delta: number): void {
        if (this.angle != this.tAngle) {
            let diff = this.tAngle - this.angle;
            let step = FlapConstants.FLAP_ANG_VEL * delta;
            if (Math.abs(diff) < step)
                this.angle = this.tAngle;
            else
                this.angle += diff > 0 ? step : -step;
        }
    }
}