import { Vector3 } from "three";

export class OLIT_CONSTANTS {
    public static readonly OLIT_RADIUS = 1;

    public static readonly TOP_SCALE: Vector3 = new Vector3(1, 0.25, 1);
    public static readonly BODY_SCALE: Vector3 = new Vector3(1, 15, 1);
    public static readonly ARM_SCALE: Vector3 = new Vector3(0.5, 0.5, 4);
    public static readonly QD_SCALE: Vector3 = new Vector3(0.5, 0.5, 3);
    public static readonly OLM_SCALE: Vector3 = new Vector3(1, 1, 1);
}