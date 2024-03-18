import { Euler } from "three";

export class SuperHeavyConstants {
    public static readonly SUPER_HEAVY_RADIUS: number = 1;
    
    public static readonly HSR_SCALE: number = 1;
    public static readonly BOOSTER_RING_SCALE: number = 1;
    public static readonly GRID_FIN_SCALE: number = 1;
    public static readonly GRID_FIN_RADIUS: number = 0.75 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly GRID_FIN_ROTATION: Euler = new Euler(0, 0, 0);
    public static readonly CHINE_SCALE: number = 1;
    public static readonly CHINES_RADIUS: number = 0.9 * SuperHeavyConstants.SUPER_HEAVY_RADIUS;
    public static readonly R_SEA_SCALE: number = 1;
}