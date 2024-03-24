import { type ThrelteContext } from "@threlte/core";
import { Spherical } from "three";
import { MathHelper } from "../helpers/MathHelper";
import { CelestialConstants } from "../constants/CelestialConstants";

export class SkyManager {
    public tc: ThrelteContext;

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
    }

    public updateScene(delta: number): void {
        let { azimuth, elevation } = MathHelper.getAzimuthElevationFromPos(CelestialConstants.SUN_POSITION);
        this.azimuth = azimuth * 180 / Math.PI;
        this.elevation = elevation * 180 / Math.PI;
    }
}