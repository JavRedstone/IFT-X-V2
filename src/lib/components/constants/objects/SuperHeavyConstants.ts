import { Euler, Vector3 } from "three";

export class SuperHeavyConstants {
    public static readonly VISIBILITY_COOLDOWN: number = 0.25;
    
    public static readonly REAL_LIFE_SCALE: Vector3 = new Vector3(4.5, 4.5, 4.5);

    public static readonly SUPER_HEAVY_SCALE: Vector3 = new Vector3(0.001, 0.001, 0.001);
    // public static readonly SUPER_HEAVY_SCALE: Vector3 = new Vector3(1, 1, 1);

    public static readonly LOX_BOTTOM_PERCENTAGE: number = 0.025;
    public static readonly CH4_BOTTOM_PERCENTAGE: number = 0.01;
    public static readonly LOX_PERCENTAGE: number = 0.525;  // this should be higher than ch4
    public static readonly CH4_PERCENTAGE: number = 0.425;
    public static readonly CRYOGENIC_SCALE: Vector3 = new Vector3(1.01, 1, 1.01);

    public static readonly HSR_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly HSR_OFFSET: number = 0.0625;
    public static readonly HSR_HEIGHT: number = 4/9;
    public static readonly MIN_HSR_HEIGHT: number = 0.025;
    public static readonly MAX_HSR_HEIGHT: number = 1;
    public static readonly HSR_DRY_MASS: number = 1.25e4; // kg

    public static readonly BOOSTER_RING_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly BOOSTER_RING_HEIGHT: number = 15.25;
    public static readonly MIN_BOOSTER_RING_HEIGHT: number = 1;
    public static readonly MAX_BOOSTER_RING_HEIGHT: number = 30;
    public static readonly BOOSTER_RING_DRY_MASS: number = 6e3; // kg

    public static readonly GRID_FIN_SCALE: Vector3 = new Vector3(0.082328, 0.082328, 0.082328);
    public static readonly GRID_FIN_RADIUS: number = 1;
    public static readonly GRID_FIN_WIDTH_PERC: number = 0.25;
    public static readonly GRID_FIN_MAX_LENGTH_SCALE: number = 2;
    public static readonly GRID_FIN_MAX_WIDTH_SCALE: number = 2;
    public static readonly GRID_FIN_ROTATION: Euler = new Euler(90 * Math.PI/180, 0, -90 * Math.PI/180);
    public static readonly GRID_FIN_ANGULAR_OFFSET: number = 45 * Math.PI / 180;
    public static readonly GRID_FIN_TOP_OFFSET: number = 0.1;
    public static readonly NUM_GRID_FINS: number = 4;
    public static readonly GRID_FIN_DRY_MASS: number = 3e3; // kg

    public static readonly CHINE_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly CHINE_RADIUS: number = 0.975;
    public static readonly CHINE_MAX_HEIGHT_PERC: number = 0.02;
    public static readonly CHINE_WIDTH_PERC: number = 0.2;
    public static readonly CHINE_MAX_HEIGHT_SCALE: number = 2;
    public static readonly CHINE_ROTATION: Euler = new Euler(0, 180 * Math.PI/180, 0);
    public static readonly CHINE_ANGULAR_OFFSET: number = 45 * Math.PI / 180;
    public static readonly CHINE_BOTTOM_OFFSET: number = 0.35;
    public static readonly NUM_CHINES: number = 4;
    public static readonly CHINE_DRY_MASS: number = 2.1e4; // kg

    public static readonly R_SEA_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_SEA_RADIUS_1: number = 0.175;
    public static readonly R_SEA_ANGULAR_OFFSET_1: number = 60*Math.PI/180;
    public static readonly R_SEA_HEIGHT_1: number = 0.3;
    public static readonly NUM_R_SEAS_1: number = 3;
    public static readonly R_SEA_TYPE_1: number = 2;
    public static readonly CAN_R_SEA_1_GIMBAL: boolean = true;

    public static readonly R_SEA_RADIUS_2: number = 0.525;
    public static readonly R_SEA_ANGULAR_OFFSET_2: number = 45*Math.PI/180;
    public static readonly R_SEA_HEIGHT_2: number = 0.3;
    public static readonly NUM_R_SEAS_2: number = 10;
    public static readonly R_SEA_TYPE_2: number = 2;
    public static readonly CAN_R_SEA_2_GIMBAL: boolean = true;

    public static readonly R_SEA_RADIUS_3: number = 0.925;
    public static readonly R_SEA_ANGULAR_OFFSET_3: number = 0;
    public static readonly R_SEA_HEIGHT_3: number = 0.3;
    public static readonly NUM_R_SEAS_3: number = 20;
    public static readonly R_SEA_TYPE_3: number = 2;
    public static readonly CAN_R_SEA_3_GIMBAL: boolean = false;

    public static readonly OUTER_CYLINDER_SCALE: Vector3 = new Vector3(0.125, 0.125, 0.125);
    public static readonly OUTER_CYLINDER_ADDITIONAL_RADIUS: number = 0.25;
    public static readonly OUTER_CYLINDER_THRESHOLD: number = 0.9;
}