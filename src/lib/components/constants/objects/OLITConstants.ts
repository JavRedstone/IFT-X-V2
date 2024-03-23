import { Vector3 } from "three";

export class OLIT_CONSTANTS {
    public static readonly OLIT_SCALE: Vector3 = new Vector3(0.01, 0.01, 0.01);

    public static readonly TOP_SCALE: Vector3 = new Vector3(1, 0.25, 1);
    public static readonly BODY_SCALE: Vector3 = new Vector3(1, 15, 1);
    public static readonly ARM_SCALE: Vector3 = new Vector3(0.5, 0.5, 4);
    public static readonly ARM_BOTTOM_OFFSET: number = 0.9;
    public static readonly CARRIAGE_ARM_SCALE: Vector3 = new Vector3(1, 0.5, 1.1);
    public static readonly QD_SCALE: Vector3 = new Vector3(0.5, 0.5, 3);
    public static readonly QD_BOTTOM_OFFSET: number = 0.6;
    public static readonly CARRIAGE_QD_SCALE: Vector3 = new Vector3(1, 0.5, 1.1);
    public static readonly OLM_SCALE: Vector3 = new Vector3(1, 1, 1);
}