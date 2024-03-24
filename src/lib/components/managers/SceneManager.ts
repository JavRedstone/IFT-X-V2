import { type ThrelteContext } from "@threlte/core";
import { CelestialManager } from "./CelestialManager";
import { PostprocessingManager } from "./PostprocessingManager";
import { PerspectiveCamera } from "three";
import { SkyManager } from "./SkyManager";
import { LaunchManager } from "./LaunchManager";

export class SceneManager {
    public tc: ThrelteContext;
    public camera: PerspectiveCamera;

    public celestialManager: CelestialManager;
    public skyManager: SkyManager;
    public launchManager: LaunchManager;
    public postprocessingManager: PostprocessingManager;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setup();
    }

    public setup(): void {
        this.celestialManager = new CelestialManager(this.tc);
        this.skyManager = new SkyManager(this.tc);
        this.launchManager = new LaunchManager(this.tc);
        this.postprocessingManager = new PostprocessingManager(this.tc);
    }

    public updateScene(delta: number): void {
        this.celestialManager.updateScene(delta);
        this.skyManager.updateScene(delta);
        this.launchManager.updateScene(delta);
    }
}