import { Euler, Vector3 } from "three";

export class OLITConstants {
    public static readonly OLIT_HORIZONTAL_MULTIPLIER: number = 1.25;

    public static readonly OLIT_SCALE_VALUE: number = 0.0001;
    public static readonly OLIT_SCALE: Vector3 = new Vector3(OLITConstants.OLIT_SCALE_VALUE * OLITConstants.OLIT_HORIZONTAL_MULTIPLIER, OLITConstants.OLIT_SCALE_VALUE, OLITConstants.OLIT_SCALE_VALUE * OLITConstants.OLIT_HORIZONTAL_MULTIPLIER);
    // public static readonly OLIT_SCALE: Vector3 = new Vector3(1 * OLIT_CONSTANTS.OLIT_HORIZONTAL_MULTIPLIER, 1, 1 * OLIT_CONSTANTS.OLIT_HORIZONTAL_MULTIPLIER);

    public static readonly TOP_SCALE: Vector3 = new Vector3(1, 0.25, 1);
    public static readonly BODY_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly ARM_SCALE: Vector3 = new Vector3(0.5, 0.5, 2.5);
    public static readonly ARM_BOTTOM_OFFSET: number = 0.9;
    public static readonly ARM_ROTATION_1: Euler = new Euler(0, -90*Math.PI/180, 0);
    public static readonly ARM_ROTATION_2: Euler = new Euler(0, 180*Math.PI/180, 0);
    public static readonly CARRIAGE_ARM_SCALE: Vector3 = new Vector3(1.25, 0.75, 1.25);
    public static readonly QD_SCALE: Vector3 = new Vector3(0.5, 0.5, 1.7);
    public static readonly QD_BOTTOM_OFFSET: number = 0.675;
    public static readonly QD_ROTATION: Euler = new Euler(0, -140*Math.PI/180, 0);
    public static readonly CARRIAGE_QD_SCALE: Vector3 = new Vector3(1.25, 0.5, 1.25);
    public static readonly OLM_SCALE: Vector3 = new Vector3(1.1/OLITConstants.OLIT_HORIZONTAL_MULTIPLIER, 1, 1.1/OLITConstants.OLIT_HORIZONTAL_MULTIPLIER);
    public static readonly OLM_ROTATION: Euler = new Euler(0, -Math.PI / 4, 0);
    public static readonly OLM_OFFSET: Vector3 = new Vector3(3, 0, 3);
    public static readonly OLM_RING_HEIGHT: number = 0.5;

    public static readonly STACK_ROTATION: Euler = new Euler(0, 135*Math.PI/180, 0);
}