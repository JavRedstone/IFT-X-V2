import { Euler, Vector3 } from "three";

export class SuperHeavyConstants {
    public static readonly SUPER_HEAVY_RADIUS: number = 1;
    
    public static readonly HSR_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly BOOSTER_RING_SCALE: Vector3 = new Vector3(1, 12, 1);

    public static readonly GRID_FIN_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly GRID_FIN_RADIUS: number = 0.75 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly GRID_FIN_ROTATION: Euler = new Euler(90, 0, 0);
    public static readonly GRID_FIN_ANGULAR_OFFSET: number = 45 * Math.PI / 180;
    public static readonly NUM_GRID_FINS: number = 4;

    public static readonly CHINE_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly CHINE_RADIUS: number = 0.9 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly CHINE_ROTATION: Euler = new Euler(0, 0, 0);
    public static readonly CHINE_ANGULAR_OFFSET: number = 45 * Math.PI / 180;
    public static readonly NUM_CHINES: number = 4;

    public static readonly R_SEA_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_SEA_RADIUS_1: number = 0.2 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly R_SEA_ANGULAR_OFFSET_1: number = 0;
    public static readonly NUM_R_SEAS_1: number = 3;
    public static readonly CAN_R_SEA_1_GIMBAL: boolean = true;
    public static readonly R_SEA_RADIUS_2: number = 0.5 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly R_SEA_ANGULAR_OFFSET_2: number = 0;
    public static readonly NUM_R_SEAS_2: number = 10;
    public static readonly CAN_R_SEA_2_GIMBAL: boolean = true;
    public static readonly R_SEA_RADIUS_3: number = 0.8 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly R_SEA_ANGULAR_OFFSET_3: number = 0;
    public static readonly NUM_R_SEAS_3: number = 10;
    public static readonly CAN_R_SEA_3_GIMBAL: boolean = false;
}