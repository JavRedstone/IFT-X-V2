export class RaptorConstants {
    public static readonly RADIUS_SEA_TO_VAC: number = 19.2/9;
    // public static readonly RADIUS_SEA: number = 13/90; // out of 1
    public static readonly R_SEA_RADIUS: number = 0.125; // out of 1 (this one is fake but works better for the model)
    public static readonly R_VAC_RADIUS: number = RaptorConstants.R_SEA_RADIUS * RaptorConstants.RADIUS_SEA_TO_VAC; // out of 1
    public static readonly PACKING_RADIUS_PERC: number = 1.15;

    public static readonly R_SEA_GIMBAL_SPACE_PERC: number = 1.5;//times the radius of the engine bell
    public static readonly R_VAC_GIMBAL_SPACE_PERC: number = 1.5;//times the radius of the engine bell
    public static readonly R_SEA_GIMBAL_MAX_ANGLE: number = 15 * Math.PI/180; //rad
    public static readonly R_VAC_GIMBAL_MAX_ANGLE: number = this.R_SEA_GIMBAL_MAX_ANGLE / this.RADIUS_SEA_TO_VAC; //rad
    
    public static readonly GIMBAL_GIMBALING_ANG_VEL: number = 2;
    public static readonly GIMBAL_Y_ANG_VEL: number = 7.5;
    
    public static readonly DRY_MASS: number = 1600; //kg

    public static readonly MASS_FLOW_LOX: number = 510; //kg/s
    public static readonly MASS_FLOW_CH4: number = 140; //kg/s

    public static readonly THRUST_SEA_1: number = 1.81423025e6; //N (185 ton force)
    public static readonly THRUST_VAC_1: number = 1.96133e6; //N (200 ton force)

    public static readonly THRUST_SEA_2: number = 2.2555295e6; //N (230 ton force)
    public static readonly THRUST_VAC_2: number = 2.5301157e6; //N (258 ton force)

    public static readonly THRUST_SEA_3: number = 2.745862e6; //N (280 ton force)
    public static readonly THRUST_VAC_3: number = 3.0008349e6; //N (306 ton force)

    public static readonly THROTTLE_MIN: number = 0.4;
    public static readonly THROTTLE_MAX: number = 1;
}