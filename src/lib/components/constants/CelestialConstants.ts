import { Vector3 } from "three";
import { PhysicsConstants } from "./PhysicsConstants";

export class CelestialConstants {
    public static readonly SUN_POSITION: Vector3 = new Vector3(1.25, 0.5, 0);
    public static readonly SUN_COLOR: number = 0xffffff;
    public static readonly SUN_INTENSITY: number = 50;

    public static readonly EARTH_RADIUS: number = 360;
    public static readonly REAL_SCALE: number = PhysicsConstants.RADIUS_EARTH / CelestialConstants.EARTH_RADIUS;
    public static readonly EARTH_EFFECTIVE_MULTIPLIER: number = 0.9999662;
    public static readonly EARTH_EFFECTIVE_RADIUS: number = CelestialConstants.EARTH_RADIUS * CelestialConstants.EARTH_EFFECTIVE_MULTIPLIER;
    public static readonly EARTH_VIEW_RADIUS: number = CelestialConstants.EARTH_RADIUS * 1.1;
    public static readonly CLOUDS_RADIUS: number = CelestialConstants.EARTH_RADIUS * 1.0025;
    public static readonly ATMOSPHERE_RADIUS: number = CelestialConstants.EARTH_RADIUS * 1.075;
    public static readonly EARTH_ROTATION_SPEED: number = 0;
    public static readonly CLOUDS_ROTATION_SPEED: number = 0.01;

    public static readonly EARTH_VERTICES: number = 360;
    public static readonly EARTH_BUMP_SCALE: number = 0.03;
    public static readonly EARTH_METALNESS: number = 0.25;
    public static readonly EARTH_ROUGHNESS: number = 1;
    public static readonly EARTH_EMISSIVE: number = 0xffff88;
    public static readonly EARTH_EMISSIVE_INTENSITY: number = 0.25;
    public static readonly ATMOSPHERIC_OPACITY: number = 0.75;
    public static readonly ATMOSPHERIC_POW_FACTOR: number = 2;
    public static readonly ATMOSPHERIC_MULTIPLIER: number = 9.5;

    public static readonly MOON_RADIUS: number = CelestialConstants.EARTH_RADIUS * 0.27;
    public static readonly MOON_VIEW_RADIUS: number = CelestialConstants.MOON_RADIUS * 1.1;
    public static readonly MOON_DISTANCE: number = CelestialConstants.EARTH_RADIUS * 60;
    public static readonly MOON_ORBIT_SPEED: number = CelestialConstants.EARTH_ROTATION_SPEED / 27.3;
    
    public static readonly MOON_VERTICES: number = 32;
    public static readonly MOON_BUMP_SCALE: number = 0.01;
    public static readonly MOON_METALNESS: number = 0.25;
    public static readonly MOON_ROUGHNESS: number = 1;

    public static readonly DEFAULT_TURBIDITY: number = 10;
    public static readonly TURBIDITY_MIN: number = 0;
    public static readonly TURBIDITY_RATE: number = 1.5e-4;

    public static readonly DEFAULT_RAYLEIGH: number = 1.5;
    public static readonly RAYLEIGH_MIN: number = 0;
    public static readonly RAYLEIGH_RATE: number = 1.5e-5;

    public static readonly DEFAULT_MIE_COEFFICIENT: number = 0.005;
    public static readonly MIE_COEFFICIENT_MIN: number = 0.0001;
    public static readonly MIE_COEFFICIENT_RATE: number = 0;

    public static readonly DEFAULT_MIE_DIRECTIONAL_G: number = 0.8;
    public static readonly MIE_DIRECTIONAL_G_MIN: number = 0.1;
    public static readonly MIE_DIRECTIONAL_G_RATE: number = 0;
}