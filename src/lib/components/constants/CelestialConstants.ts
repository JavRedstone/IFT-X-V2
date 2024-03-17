export class CelestialConstants {
    public static readonly SUN_INTENSITY = 3;

    public static readonly EARTH_RADIUS = 10;
    public static readonly CLOUDS_RADIUS = this.EARTH_RADIUS * 1.02;
    public static readonly ATMOSPHERE_RADIUS = this.EARTH_RADIUS * 1.075;
    public static readonly EARTH_ROTATION_SPEED = 0;
    // public static readonly EARTH_ROTATION_SPEED = 0.01;
    public static readonly CLOUDS_ROTATION_SPEED = 0.02;

    public static readonly MOON_RADIUS = 3;
    public static readonly MOON_DISTANCE = this.EARTH_RADIUS * 5;
}