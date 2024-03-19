import { type ThrelteContext } from "@threlte/core";
import { Sky } from "@threlte/extras";
import { DirectionalLight, PerspectiveCamera } from "three";

export class SkyManager {
    public tc: ThrelteContext;

    public camera: PerspectiveCamera;
    public sun: DirectionalLight;

    public options: any = {
        enabled: true,
        setEnvironment: true,
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        elevation: 2,
        azimuth: 180,
    }

    public constructor(tc: ThrelteContext, camera: PerspectiveCamera, sun: DirectionalLight) {
        this.tc = tc;
        this.camera = camera;
        this.sun = sun;
    }

    public setup(): void {

    }
}