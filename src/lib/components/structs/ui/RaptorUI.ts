import { RaptorConstants } from "$lib/components/constants/RaptorConstants";
import { Vector2 } from "three";

export class RaptorUI {
    public isSea: boolean = false;
    public type: number = 0;
    public throttle: number = 0;
    public position: Vector2 = new Vector2();

    constructor(isSea: boolean, type: number, throttle: number, position: Vector2) {
        this.isSea = isSea;
        this.type = type;
        this.throttle = throttle;
        this.position = position;
    }
}