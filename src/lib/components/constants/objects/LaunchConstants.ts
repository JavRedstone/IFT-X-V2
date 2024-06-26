import { Euler, Vector3 } from "three";

export class LaunchConstants {
    public static readonly AABB_REQUEST_AMOUNT: number = 1;
    public static readonly AABB_REQUEST_MAX: number = 3;

    public static readonly LAUNCHPAD_ROTATION: Euler = new Euler(153.875 * Math.PI / 180, 96.65 * Math.PI / 180, 0);
    public static readonly ROTATION_GROUP: Euler = new Euler(0, -90 * Math.PI / 180, 0, "XYZ");
    
    public static readonly REAL_LIFE_SCALE: Vector3 = new Vector3(4.5, 4.5, 4.5);

    public static readonly LOX_DENSITY: number = 1141; //kg/m^3
    public static readonly CH4_DENSITY: number = 422; //kg/m^3
    public static readonly FUELING_RATE: number = 0.75; //m^3/s

    public static readonly DRAG_ROLL_FORCE_COEF: number = 0.01;
    public static readonly DRAG_PITCH_YAW_FORCE_COEF: number = 0.5;
    public static readonly DRAG_FORCE_COEF: number = 2;
    public static readonly DRAG_FORCE_LOSS: number = 0.00001;
    public static readonly DRAG_MAX_FORCE_LOSS: number = 0.9999;

    public static readonly SEPARATION_ANG_VEL: Vector3 = new Vector3(0, 0, 0.15);

    public static readonly OLIT_ARROW_LENGTH: number = 100;
    public static readonly OLIT_ARROW_COLOR: number = 0x0000ff;
    public static readonly SUPER_HEAVY_LANDING_ARROW_LENGTH: number = 100;
    public static readonly SUPER_HEAVY_LANDING_ARROW_COLOR: number = 0xff0000;
    public static readonly STARSHIP_LANDING_ARROW_LENGTH: number = 100;
    public static readonly STARSHIP_LANDING_ARROW_COLOR: number = 0xffff00;
    public static readonly VEL_ARROW_LENGTH: number = 0.005;
    public static readonly VEL_ARROW_COLOR: number = 0x00ff00;

    public static readonly FUELING_SPEEDUP: number = 2000;
    public static readonly COUNTDOWN_SPEEDUP: number = 20;
    public static readonly LAUNCH_SPEEDUP: number = 1;

    public static readonly STOP_DT: number = -150; //s
    public static readonly HOLD_DT: number = -40; //s
    public static readonly COUNTDOWN_DT: number = -11; //s
    public static readonly DELUGE_START_DT: number = -6; //s
    public static readonly STARTUP_DT: number = -3; //s
    public static readonly DELUGE_STOP_DT: number = 2; //s
    public static readonly PAD_DT: number = 10; //s
    public static readonly MECO_DT: number = 10; //s

    public static readonly KP_X: number = 2e-2;
    public static readonly KD_X: number = 1;
    public static readonly KP_Y: number = 1e4;
    public static readonly KD_Y: number = 1e6;
    public static readonly KP_Z: number = 2e-2;
    public static readonly KD_Z: number = 1;

    public static readonly KP_ANG_VEL_X: number = 2;
    public static readonly KP_ANG_VEL_Y: number = 1;
    public static readonly KP_ANG_VEL_Z: number = 2;

    public static readonly LANDING_DOT_PRODUCT_ACCEPT: number = 0.25;
    public static readonly LANDING_VELOCITY_ACCEPT: number = 30;

    public static readonly BOOSTER_LAUNCH_EVENTS: string[] = [
        "Booster Engine Cutoff",
        "Boostback Startup",
        "Boostback Shutdown",
        "Booster Landing Burn",
    ];

    public static readonly SHIP_LAUNCH_EVENTS: string[] = [
        "Ship Engine Startup",
        "Second Engine Cutoff",
        "Ship Landing Burn",
    ];
}