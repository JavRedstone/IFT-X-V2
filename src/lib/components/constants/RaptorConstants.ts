export class RaptorConstants {
    public static readonly RADIUS_SEA_TO_VAC: number = 19.2/9;

    public static readonly DRY_MASS: number = 1600; //kg

    public static readonly MASS_FLOW_LOX: number = 510; //kg/s
    public static readonly MASS_FLOW_CH4: number = 140; //kg/s

    public static readonly THRUST_SEA_TO_VAC: number = 2.53/2.26;

    public static readonly THRUST_SEA_1: number = 1.81e6; //N
    public static readonly THRUST_VAC_1: number = RaptorConstants.THRUST_SEA_1 * RaptorConstants.THRUST_SEA_TO_VAC; //N

    public static readonly THRUST_SEA_2: number = 2.26e6; //N
    public static readonly THRUST_VAC_2: number = RaptorConstants.THRUST_SEA_2 * RaptorConstants.THRUST_SEA_TO_VAC; //N

    public static readonly THRUST_SEA_3: number = 2.64e6; //N
    public static readonly THRUST_VAC_3: number = RaptorConstants.THRUST_SEA_3 * RaptorConstants.THRUST_SEA_TO_VAC; //N

    public static readonly THROTTLE_MIN: number = 0.4;
    public static readonly THROTTLE_MAX: number = 1;
}