import { Vector2 } from "three";

export class RaptorUI {
    public isSea: boolean = false;
    public throttle: number = 0;
    public position: Vector2 = new Vector2();

    constructor(isSea: boolean, throttle: number, position: Vector2) {
        this.isSea = isSea;
        this.throttle = throttle;
        this.position = position;
    }
}