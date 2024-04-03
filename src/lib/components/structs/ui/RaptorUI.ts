import { RaptorConstants } from "$lib/components/constants/objects/RaptorConstants";
import { Vector2 } from "three";

export class RaptorUI {
    public isSea: boolean = false;
    public type: number = 0;
    public throttle: number = 0;
    public position: Vector2 = new Vector2();
    public isValidated: boolean = true;

    constructor(isSea: boolean, type: number, throttle: number, position: Vector2, isValidated: boolean = true) {
        this.isSea = isSea;
        this.type = type;
        this.throttle = throttle;
        this.position = position;
        this.isValidated = isValidated;
    }
}