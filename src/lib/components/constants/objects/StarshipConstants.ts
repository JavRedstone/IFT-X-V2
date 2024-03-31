import { Euler, Vector3 } from "three";

export class StarshipConstants {
    public static readonly REAL_LIFE_SCALE: Vector3 = new Vector3(4.5, 4.5, 4.5);

    public static readonly STARSHIP_SCALE: Vector3 = new Vector3(0.001, 0.001, 0.001);
    // public static readonly STARSHIP_SCALE: Vector3 = new Vector3(1, 1, 1);

    public static readonly DRY_MASS: number = 1e5;
    public static readonly LOX_PERCENTAGE: number = 0.32;
    public static readonly CH4_PERCENTAGE: number = 0.28;
    
    public static readonly NOSECONE_SCALE: Vector3 = new Vector3(1, 0.9, 1);
    public static readonly NOSECONE_HEIGHT: number = 8/3;

    public static readonly SHIP_RING_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly SHIP_RING_HEIGHT: number = 8.5;
    
    public static readonly FORWARD_L_SCALE: Vector3 = new Vector3(0.033610, 0.05, 0.033610);
    public static readonly FORWARD_L_ROTATION: Euler = new Euler(12.8405*Math.PI/180, 0, 0);
    public static readonly FORWARD_R_SCALE: Vector3 = new Vector3(0.033610, 0.05, 0.033610);
    public static readonly FORWARD_R_ROTATION: Euler = new Euler(-12.8405*Math.PI/180, 0, 0);
    public static readonly AFT_L_SCALE: Vector3 = new Vector3(0.033610, 0.06, 0.033610);
    public static readonly AFT_R_SCALE: Vector3 = new Vector3(0.033610, 0.06, 0.033610);

    public static readonly THRUST_PUCK_SCALE: Vector3 = new Vector3(0.99, 0.99, 0.99); // prevent z-fighting
    public static readonly THRUST_PUCK_HEIGHT: number = 0.75;
    
    public static readonly R_SEA_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_SEA_RADIUS: number = 0.175;
    public static readonly R_SEA_ANGULAR_OFFSET: number = 0;
    public static readonly R_SEA_HEIGHT: number = 1.1;
    public static readonly NUM_R_SEAS: number = 3;
    public static readonly R_SEA_TYPE: number = 2;
    public static readonly CAN_R_SEA_GIMBAL: boolean = true;
    
    public static readonly R_VAC_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_VAC_RADIUS: number = 0.675;
    public static readonly R_VAC_ANGULAR_OFFSET: number = 60 * Math.PI / 180;
    public static readonly R_VAC_HEIGHT: number = 1.1;
    public static readonly NUM_R_VACS: number = 3;
    public static readonly R_VAC_TYPE: number = 2;
    public static readonly CAN_R_VAC_GIMBAL: boolean = false;
}