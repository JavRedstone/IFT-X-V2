export class RaptorConstants {
    public static readonly RADIUS_SEA_TO_VAC: number = 19.2/9;
    // public static readonly RADIUS_SEA: number = 13/90; // out of 1
    public static readonly R_SEA_RADIUS: number = 0.125; // out of 1 (this one is fake but works better for the model)
    public static readonly R_VAC_RADIUS: number = RaptorConstants.R_SEA_RADIUS * RaptorConstants.RADIUS_SEA_TO_VAC; // out of 1
    public static readonly PACKING_RADIUS_PERC: number = 1.15;

    public static readonly R_SEA_GIMBAL_SPACE_PERC: number = 1.5;//times the radius of the engine bell
    public static readonly R_VAC_GIMBAL_SPACE_PERC: number = 1.5;//times the radius of the engine bell
    public static readonly R_SEA_GIMBAL_MAX_ANGLE: number = 15 * Math.PI/180; //rad
    public static readonly R_VAC_GIMBAL_MAX_ANGLE: number = RaptorConstants.R_SEA_GIMBAL_MAX_ANGLE / RaptorConstants.RADIUS_SEA_TO_VAC; //rad
    
    public static readonly R_SEA_GIMBAL_ANG_VEL: number = 2;
    public static readonly R_VAC_GIMBAL_ANG_VEL: number = RaptorConstants.R_SEA_GIMBAL_ANG_VEL / RaptorConstants.RADIUS_SEA_TO_VAC;
    public static readonly GIMBAL_Y_ANG_VEL: number = 7.5;

    public static readonly THROTTLE_UP_VEL: number = 2;
    public static readonly THROTTLE_DOWN_VEL: number = 2;

    public static readonly MIN_THROTTLE: number = 0.4;
    public static readonly MAX_THROTTLE: number = 1;

    public static readonly THRUST_LOSS: number = 0.00001;
    public static readonly MAX_THRUST_LOSS: number = 0.5;
    
    public static readonly DRY_MASS: number = 1600; //kg

    public static readonly MASS_FLOW_LOX: number = 510; //kg/s
    public static readonly MASS_FLOW_CH4: number = 140; //kg/s

    public static readonly R_SEA_THRUST_1: number = 1.81423025e6; //MN (185 ton force)
    public static readonly R_VAC_THRUST_1: number = 1.96133e6; //MN (200 ton force)

    public static readonly R_SEA_THRUST_2: number = 2.2555295e6; //MN (230 ton force)
    public static readonly R_VAC_THRUST_2: number = 2.5301157e6; //MN (258 ton force)

    public static readonly R_SEA_THRUST_3: number = 2.745862e6; //MN (280 ton force)
    public static readonly R_VAC_THRUST_3: number = 3.0008349e6; //MN (306 ton force)
}