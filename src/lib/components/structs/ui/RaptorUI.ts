import { Vector2 } from "three";

export class RaptorUI {
    public num: number = 0;
    public isOn: boolean = false;
    public isSea: boolean = false;
    public position: Vector2 = new Vector2();

    constructor(num: number, isOn: boolean, isSea: boolean, position: Vector2) {
        this.num = num;
        this.isOn = isOn;
        this.isSea = isSea;
        this.position = position;
    }
}