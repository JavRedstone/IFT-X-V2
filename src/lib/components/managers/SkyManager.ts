import { type ThrelteContext } from "@threlte/core";
import { DirectionalLight, Vector3, Spherical } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { CelestialConstants } from "../constants/CelestialConstants";
import { PRTransients } from "../constants/transients/PRTransients";
import { lerp } from "three/src/math/MathUtils.js";

export class SkyManager {
    public tc: ThrelteContext;
    
    public sun: DirectionalLight = new DirectionalLight();

    public enabled: boolean = true;
    public setEnvironment: boolean = true;
    public turbidity: number = CelestialConstants.DEFAULT_TURBIDITY;
    public rayleigh: number = CelestialConstants.DEFAULT_RAYLEIGH;
    public mieCoefficient: number = CelestialConstants.DEFAULT_MIE_COEFFICIENT;
    public mieDirectionalG: number = CelestialConstants.DEFAULT_MIE_DIRECTIONAL_G;
    public elevation: number = 0;
    public azimuth: number = 0;

    public constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.createSun();
    }

    public createSun() {
        this.sun = new DirectionalLight(CelestialConstants.SUN_COLOR, CelestialConstants.SUN_INTENSITY);
        this.tc.scene.add(this.sun);
        PRTransients.realPositions.sunPosition = CelestialConstants.SUN_POSITION;
    }

    public updateScene(delta: number, altitude: number): void {
        this.sun.position.copy(PRTransients.fakePositions.sunPosition.clone());
        let { azimuth, elevation } = MathHelper.getAzimuthElevationFromPos(PRTransients.fakePositions.sunPosition.clone());
        this.azimuth = azimuth * 180 / Math.PI;
        this.elevation = elevation * 180 / Math.PI;

        this.turbidity = CelestialConstants.DEFAULT_TURBIDITY - CelestialConstants.TURBIDITY_RATE * altitude;
        this.rayleigh = CelestialConstants.DEFAULT_RAYLEIGH - CelestialConstants.RAYLEIGH_RATE * altitude;
        this.mieCoefficient = CelestialConstants.DEFAULT_MIE_COEFFICIENT - CelestialConstants.MIE_COEFFICIENT_RATE * altitude;
        this.mieDirectionalG = CelestialConstants.DEFAULT_MIE_DIRECTIONAL_G - CelestialConstants.MIE_DIRECTIONAL_G_RATE * altitude;
        this.turbidity = MathHelper.clamp(this.turbidity, CelestialConstants.TURBIDITY_MIN, CelestialConstants.DEFAULT_TURBIDITY);
        this.rayleigh = MathHelper.clamp(this.rayleigh, CelestialConstants.RAYLEIGH_MIN, CelestialConstants.DEFAULT_RAYLEIGH);
        this.mieCoefficient = MathHelper.clamp(this.mieCoefficient, CelestialConstants.MIE_COEFFICIENT_MIN, CelestialConstants.DEFAULT_MIE_COEFFICIENT);
    
        if (this.turbidity <= CelestialConstants.TURBIDITY_MIN && this.rayleigh <= CelestialConstants.RAYLEIGH_MIN) {
            this.enabled = false;
            this.sun.intensity = 1;
        }
        else {
            this.enabled = true;
            this.sun.intensity = 0;
        }
    }
}