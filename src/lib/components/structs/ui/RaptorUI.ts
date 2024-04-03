import { RaptorConstants } from "$lib/components/constants/objects/RaptorConstants";
import { Vector2 } from "three";

export class RaptorUI {
    public isSea: boolean = false;
    public type: number = 0;
    public throttle: number = 0;
    public position: Vector2 = new Vector2();
    public originalPosition: Vector2 = new Vector2();
    public gimbalAngle: number = 0;
    public angleY: number = 0;
    public isValidated: boolean = true;

    constructor(isSea: boolean, type: number, throttle: number, position: Vector2, gimbalAngle: number, angleY: number, isValidated: boolean = true) {
        this.isSea = isSea;
        this.type = type;
        this.throttle = throttle;
        this.position = position;
        this.originalPosition = position.clone();
        this.gimbalAngle = gimbalAngle;
        this.angleY = angleY;
        this.isValidated = isValidated;
    }

    public updateGimbal(gimbalAngle: number, angleY: number): void {
        if (gimbalAngle != undefined && angleY != undefined) {
            let radialDistance = gimbalAngle / RaptorConstants.GIMBAL_MAX_ANGLE * RaptorConstants.GIMBAL_SPACE_PERC * (this.isSea ? RaptorConstants.RADIUS_SEA : RaptorConstants.RADIUS_VAC);
            // console.log(angleY * 180 / Math.PI);
            this.position.copy(this.originalPosition.clone().add(new Vector2(radialDistance, 0).rotateAround(new Vector2(), angleY)));
            this.gimbalAngle = gimbalAngle;
            this.angleY = angleY;
        }
    }
}