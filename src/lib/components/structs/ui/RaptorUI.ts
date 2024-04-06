import { RaptorConstants } from "$lib/components/constants/controls/RaptorConstants";
import { Vector2 } from "three";

export class RaptorUI {
    public isSea: boolean = false;
    public type: number = 0;
    public throttle: number = 0;
    public position: Vector2 = new Vector2();
    public originalPosition: Vector2 = new Vector2();
    public isValidated: boolean = true;

    constructor(isSea: boolean, type: number, throttle: number, position: Vector2, isValidated: boolean = true) {
        this.isSea = isSea;
        this.type = type;
        this.throttle = throttle;
        this.position = position;
        this.originalPosition = position.clone();
        this.isValidated = isValidated;
    }

    public updateGimbal(gimbalAngle: number, angleY: number, sizeMult: number, left: boolean): void {
        if (gimbalAngle != undefined && angleY != undefined) {
            let radialDistance = gimbalAngle / (this.isSea ? RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE : RaptorConstants.R_VAC_GIMBAL_MAX_ANGLE) * (RaptorConstants.R_SEA_GIMBAL_SPACE_PERC - 1) * sizeMult * (this.isSea ? RaptorConstants.R_SEA_RADIUS : RaptorConstants.R_VAC_RADIUS);
            this.position = this.originalPosition.clone().add(new Vector2(radialDistance, 0).rotateAround(new Vector2(), left ? angleY + Math.PI : -angleY));
        }
    }
}