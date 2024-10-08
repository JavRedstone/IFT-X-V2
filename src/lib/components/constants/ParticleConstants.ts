export class ParticleConstants {
    public static readonly FORCE_MULT: number = 100;

    public static readonly RAPTOR_FORCE: number = -0.001;
    public static readonly RAPTOR_RADIUS_SEA_TO_VAC: number = 1.5;
    public static readonly RAPTOR_THETA_ALTITUDE: number = 7.5e-6;
    public static readonly RAPTOR_A_SCALE: number = 1;
    public static readonly RAPTOR_B_SCALE: number = 1.5;

    public static readonly DELUGE_A_SCALE: number = 1;
    public static readonly DELUGE_B_SCALE: number = 0.5;

    public static readonly HOT_STAGE_FORCE: number = -0.004;
    public static readonly HOT_STAGE_A_SCALE: number = 1;
    public static readonly HOT_STAGE_B_SCALE: number = 0.5;

    public static readonly REENTRY_FORCE: number = -0.002;
    public static readonly REENTRY_THRESHOLD: number = 3e4;
    public static readonly REENTRY_MAX_ALTITUDE: number = 200e3;
    public static readonly REENTRY_MIN_ALTITUDE: number = 50e3;
    public static readonly REENTRY_A_SCALE: number = 1;
    public static readonly REENTRY_B_SCALE: number = 0.5;

    public static readonly EXPLOSION_DURATION: number = 1;
    public static readonly EXPLOSION_A_SCALE: number = 1;
    public static readonly EXPLOSION_B_SCALE: number = 1.5;
}