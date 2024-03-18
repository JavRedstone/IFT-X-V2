export class CelestialConstants {
    public static readonly SUN_COLOR = 0xffffff;
    public static readonly SUN_INTENSITY = 3;

    public static readonly EARTH_RADIUS = 400;
    public static readonly CLOUDS_RADIUS = this.EARTH_RADIUS * 1.02;
    public static readonly ATMOSPHERE_RADIUS = this.EARTH_RADIUS * 1.075;
    public static readonly EARTH_ROTATION_SPEED = 0;
    public static readonly CLOUDS_ROTATION_SPEED = this.EARTH_ROTATION_SPEED * 1.02;

    public static readonly EARTH_VERTICES = 512;
    public static readonly EARTH_BUMP_SCALE = 0.03;
    public static readonly EARTH_METALNESS = 0.25;
    public static readonly EARTH_ROUGHNESS = 1;
    public static readonly EARTH_EMISSIVE = 0xffff88;
    public static readonly EARTH_EMISSIVE_INTENSITY = 0.25;
    public static readonly ATMOSPHERIC_OPACITY = 0.75;
    public static readonly ATMOSPHERIC_POW_FACTOR = 2;
    public static readonly ATMOSPHERIC_MULTIPLIER = 9.5;

    public static readonly MOON_RADIUS = this.EARTH_RADIUS * 0.27;
    public static readonly MOON_DISTANCE = this.EARTH_RADIUS * 60;
    public static readonly MOON_ORBIT_SPEED = this.EARTH_ROTATION_SPEED / 27.3;
    
    public static readonly MOON_VERTICES = 32;
    public static readonly MOON_BUMP_SCALE = 0.01;
    public static readonly MOON_METALNESS = 0.25;
    public static readonly MOON_ROUGHNESS = 1;
}