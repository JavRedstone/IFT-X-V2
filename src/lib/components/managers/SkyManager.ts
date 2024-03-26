import { type ThrelteContext } from "@threlte/core";
import { DirectionalLight, Spherical } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { CelestialConstants } from "../constants/CelestialConstants";
import { PRTransients } from "../constants/transients/PRTransients";
import { lerp } from "three/src/math/MathUtils.js";

export class SkyManager {
    public tc: ThrelteContext;
    
    public sun: DirectionalLight = new DirectionalLight();

    public enabled: boolean = true;
    public setEnvironment: boolean = true;
    public turbidity: number = 10;
    public rayleigh: number = 1.5;
    public mieCoefficient: number = 0.005;
    public mieDirectionalG: number = 0.8;
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

    public updateScene(delta: number): void {
        this.sun.position.copy(PRTransients.fakePositions.sunPosition);
        let { azimuth, elevation } = MathHelper.getAzimuthElevationFromPos(PRTransients.fakePositions.sunPosition);
        this.azimuth = azimuth * 180 / Math.PI;
        this.elevation = elevation * 180 / Math.PI;

        this.sun.intensity = lerp(0, CelestialConstants.SUN_INTENSITY, MathHelper.clamp(Math.sin(elevation), 0, 1));
    }
}