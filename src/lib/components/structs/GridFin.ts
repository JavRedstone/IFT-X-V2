import { GridFinConstants } from "../constants/controls/GridFinConstants";

export class GridFin {
    public angle: number = GridFinConstants.MIN_ANGLE;
    public tAngle: number = GridFinConstants.MIN_ANGLE;

    public constructor() {
        this.angle = GridFinConstants.MIN_ANGLE;
        this.tAngle = GridFinConstants.MIN_ANGLE;
    }

    public setTarget(tAngle: number): void {
        this.tAngle = tAngle;
    }

    public update(delta: number): void {
        if (this.angle != this.tAngle) {
            let diff = this.tAngle - this.angle;
            let step = GridFinConstants.GRID_FIN_ANG_VEL * delta;
            if (Math.abs(diff) < step)
                this.angle = this.tAngle;
            else
                this.angle += diff > 0 ? step : -step;
        }
    }
}