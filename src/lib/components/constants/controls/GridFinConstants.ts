export class GridFinConstants {
    public static readonly GRID_FIN_ANG_VEL: number = 1;
    public static readonly NEUTRAL_ANGLE: number = 0;
    public static readonly MIN_ANGLE: number = -45 * Math.PI / 180;
    public static readonly MAX_ANGLE: number = 45 * Math.PI / 180;
    
    public static readonly FORCE_MULTIPLIER: number = 5000;

    public static readonly FORCE_LOSS: number = 0.00001;
    public static readonly MAX_FORCE_LOSS: number = 0.95;
}