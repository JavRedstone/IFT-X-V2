import { Euler, Vector3 } from "three";

export class SuperHeavyConstants {
    public static readonly SUPER_HEAVY_SCALE: Vector3 = new Vector3(0.001, 0.001, 0.001);
    
    public static readonly HSR_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly BOOSTER_RING_SCALE: Vector3 = new Vector3(1, 15.6, 1);

    public static readonly GRID_FIN_SCALE: Vector3 = new Vector3(0.082328, 0.082328, 0.082328);
    public static readonly GRID_FIN_RADIUS: number = 1;
    public static readonly GRID_FIN_ROTATION: Euler = new Euler(90 * Math.PI/180, 0, 0);
    public static readonly GRID_FIN_ANGULAR_OFFSET: number = 45 * Math.PI / 180;
    public static readonly GRID_FIN_TOP_OFFSET: number = 0.1;
    public static readonly NUM_GRID_FINS: number = 4;

    public static readonly CHINE_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly CHINE_RADIUS: number = 0.975;
    public static readonly CHINE_ROTATION: Euler = new Euler(0, 90 * Math.PI/180, 0);
    public static readonly CHINE_ANGULAR_OFFSET: number = 45 * Math.PI / 180;
    public static readonly CHINE_BOTTOM_OFFSET: number = 0.35;
    public static readonly NUM_CHINES: number = 4;

    public static readonly R_SEA_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_SEA_RADIUS_1: number = 0.175;
    public static readonly R_SEA_ANGULAR_OFFSET_1: number = 0;
    public static readonly R_SEA_HEIGHT_1: number = 0.3;
    public static readonly NUM_R_SEAS_1: number = 3;
    public static readonly CAN_R_SEA_1_GIMBAL: boolean = true;
    public static readonly R_SEA_RADIUS_2: number = 0.5;
    public static readonly R_SEA_ANGULAR_OFFSET_2: number = 0;
    public static readonly R_SEA_HEIGHT_2: number = 0.3;
    public static readonly NUM_R_SEAS_2: number = 10;
    public static readonly CAN_R_SEA_2_GIMBAL: boolean = true;
    public static readonly R_SEA_RADIUS_3: number = 0.925;
    public static readonly R_SEA_ANGULAR_OFFSET_3: number = 0;
    public static readonly R_SEA_HEIGHT_3: number = 0.3;
    public static readonly NUM_R_SEAS_3: number = 20;
    public static readonly CAN_R_SEA_3_GIMBAL: boolean = false;

    public static readonly OUTER_CYLINDER_SCALE: Vector3 = new Vector3(0.125, 0.125, 0.125);
    public static readonly OUTER_CYLINDER_RADIUS: number = 0.95;
}