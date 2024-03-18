import { Vector3 } from "three";

export class StarshipConstants {
    public static readonly STARSHIP_RADIUS: number = 1;
    
    public static readonly NOSECONE_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly SHIP_RING_SCALE: Vector3 = new Vector3(1, 30, 1);
    
    public static readonly FORWARD_L_SCALE: Vector3 = new Vector3(0.033610, -0.033610, 0.033610);
    public static readonly FORWARD_R_SCALE: Vector3 = new Vector3(0.033610, 0.033610, 0.033610);
    public static readonly AFT_L_SCALE: Vector3 = new Vector3(0.033610, -0.033610, 0.033610);
    public static readonly AFT_R_SCALE: Vector3 = new Vector3(0.033610, 0.033610, 0.033610);
    
    public static readonly R_SEA_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_SEA_RADIUS: number = 0.25 * StarshipConstants.STARSHIP_RADIUS;
    public static readonly NUM_R_SEAS: number = 3;
    public static readonly CAN_R_SEA_GIMBAL: boolean = true;
    
    public static readonly R_VAC_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_VAC_RADIUS: number = 0.65 * StarshipConstants.STARSHIP_RADIUS;
    public static readonly NUM_R_VACS: number = 3;
    public static readonly CAN_R_VAC_GIMBAL: boolean = false;
}