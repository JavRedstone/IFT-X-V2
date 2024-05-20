import { Euler, Vector3 } from "three";

export class StarshipConstants {
    public static readonly VISIBILITY_COOLDOWN: number = 0.25;

    public static readonly STARSHIP_SCALE_VALUE: number = 0.0001;
    public static readonly STARSHIP_SCALE: Vector3 = new Vector3(StarshipConstants.STARSHIP_SCALE_VALUE, StarshipConstants.STARSHIP_SCALE_VALUE, StarshipConstants.STARSHIP_SCALE_VALUE);

    public static readonly LOX_BOTTOM_FIXED: number = 1;
    public static readonly LOX_CH4_GAP_FIXED: number = 0.05;
    public static readonly CH4_TOP_FIXED: number = 2.45;
    public static readonly LOX_PERCENTAGE: number = 0.55; // this should be higher than ch4
    public static readonly CH4_PERCENTAGE: number = 0.45;
    public static readonly CRYOGENIC_SCALE: Vector3 = new Vector3(1.01, 1, 1.01);
    
    public static readonly NOSECONE_SCALE: Vector3 = new Vector3(1, 0.9, 1);
    public static readonly NOSECONE_HEIGHT: number = 8/3;
    public static readonly NOSECONE_DRY_MASS: number = 2e4; // kg

    public static readonly SHIP_RING_SCALE: Vector3 = new Vector3(1, 1, 1);
    public static readonly SHIP_RING_HEIGHT: number = 8.5;
    public static readonly MIN_SHIP_RING_HEIGHT: number = 4;
    public static readonly MAX_SHIP_RING_HEIGHT: number = 20;
    public static readonly SHIP_RING_DRY_MASS: number = 6e3; // kg
    
    public static readonly FORWARD_L_SCALE: Vector3 = new Vector3(0.033610, 0.05, 0.033610);
    public static readonly FORWARD_L_ROTATION: Euler = new Euler(12.8405*Math.PI/180, 0, 0);
    public static readonly FORWARD_L_MAX_HEIGHT_SCALE: number = 1.25;
    public static readonly FORWARD_L_MAX_WIDTH_SCALE: number = 2;
    public static readonly FORWARD_L_DRY_MASS: number = 4.5e3; // kg
    public static readonly FORWARD_L_RADIUS: number = 0.95;

    public static readonly FORWARD_R_SCALE: Vector3 = new Vector3(0.033610, 0.05, 0.033610);
    public static readonly FORWARD_R_ROTATION: Euler = new Euler(-12.8405*Math.PI/180, 0, 0);
    public static readonly FORWARD_R_MAX_HEIGHT_SCALE: number = 1.25;
    public static readonly FORWARD_R_MAX_WIDTH_SCALE: number = 2;
    public static readonly FORWARD_R_DRY_MASS: number = 4.5e3; // kg
    public static readonly FORWARD_R_RADIUS: number = 0.95;

    public static readonly AFT_L_SCALE: Vector3 = new Vector3(0.033610, 0.06, 0.033610);
    public static readonly AFT_L_MAX_HEIGHT_PERC: number = 1/18;
    public static readonly AFT_L_MAX_WIDTH_SCALE: number = 2;
    public static readonly AFT_L_DRY_MASS: number = 5.2e3; // kg
    public static readonly AFT_L_RADIUS: number = 0.925;

    public static readonly AFT_R_SCALE: Vector3 = new Vector3(0.033610, 0.06, 0.033610);
    public static readonly AFT_R_MAX_HEIGHT_PERC: number = 1/18;
    public static readonly AFT_R_MAX_WIDTH_SCALE: number = 2;
    public static readonly AFT_R_DRY_MASS: number = 5.2e3; // kg
    public static readonly AFT_R_RADIUS: number = 0.925;

    public static readonly THRUST_PUCK_SCALE: Vector3 = new Vector3(0.99, 0.99, 0.99); // prevent z-fighting
    public static readonly THRUST_PUCK_HEIGHT: number = 0.75;
    
    public static readonly R_SEA_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_SEA_RADIUS: number = 0.175;
    public static readonly R_SEA_ANGULAR_OFFSET: number = 0;
    public static readonly NUM_R_SEAS: number = 3;
    public static readonly R_SEA_TYPE: number = 2;
    public static readonly CAN_R_SEA_GIMBAL: boolean = true;
    
    public static readonly R_VAC_SCALE: Vector3 = new Vector3(0.045206, 0.045206, 0.045206);
    public static readonly R_VAC_RADIUS: number = 0.7;
    public static readonly R_VAC_ANGULAR_OFFSET: number = 60 * Math.PI / 180;
    public static readonly NUM_R_VACS: number = 3;
    public static readonly R_VAC_TYPE: number = 2;
    public static readonly CAN_R_VAC_GIMBAL: boolean = false;

    public static readonly R_HEIGHT: number = 0.9;
}