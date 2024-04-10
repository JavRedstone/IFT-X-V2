export class LaunchConstants {
    public static readonly AABB_REQUEST_AMOUNT: number = 2;
    public static readonly AABB_REQUEST_MAX: number = 8;
    public static readonly LOX_DENSITY: number = 1141; //kg/m^3
    public static readonly CH4_DENSITY: number = 422; //kg/m^3
    public static readonly FUELING_RATE: number = 0.75; //m^3/s

    public static readonly FUELING_SPEEDUP: number = 2000;
    public static readonly COUNTDOWN_SPEEDUP: number = 20;
    public static readonly LAUNCH_SPEEDUP: number = 1;

    public static readonly STOP_DT: number = -150; //s
    public static readonly HOLD_DT: number = -40; //s
    public static readonly COUNTDOWN_DT: number = -11; //s
    public static readonly STARTUP_DT: number = -2; //s
    public static readonly MECO_DT: number = 10; //s

    public static readonly MAX_STAY_ON_PAD: number = 10; //s

    public static readonly LAUNCH_EVENTS: string[] = [
        "Booster Engine Cutoff",
        "Stage Separation",
        "Boostback Startup",
        "Boostback Shutdown",
        "Landing Burn Startup",
        "Landing Burn Shutdown",
        "Second Engine Cutoff",
        "Start Flip Maneuver",
        "Deploy Landing Legs",
        "Ship Landing Shutdown",
    ];
}