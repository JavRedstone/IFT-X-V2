import { type ThrelteContext } from "@threlte/core";
import { SceneConstants } from "../constants/SceneConstants";
import { CelestialManager } from "./CelestialManager";
import { PostprocessingManager } from "./PostprocessingManager";
import { PerspectiveCamera, Vector3 } from "three";
import { SkyManager } from "./SkyManager";
import { CelestialConstants } from "../constants/CelestialConstants";
import { LaunchManager } from "./LaunchManager";

export class SceneManager {
    public tc: ThrelteContext;
    public camera: PerspectiveCamera;
    public orbitControls: any;

    public celestialManager: CelestialManager;
    public skyManager: SkyManager;
    public launchManager: LaunchManager;
    public postprocessingManager: PostprocessingManager;

    public updInterval: number = 0;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setup();
    }

    public setup(): void {
        this.setupManagers();
        this.setupUpdater();
    }

    public setupManagers(): void {
        this.celestialManager = new CelestialManager(this.tc);
        this.skyManager = new SkyManager(this.tc, this.camera, this.celestialManager.sun);
        this.launchManager = new LaunchManager(this.tc, this.camera, this.orbitControls);
        this.postprocessingManager = new PostprocessingManager(this.tc, this.camera);
    }

    public setupUpdater(): void {
        this.updInterval = setInterval(() => this.updateScene(SceneConstants.DELTA), 1000 / SceneConstants.FPS);
    }

    public updateScene(delta: number): void {
        this.celestialManager.updateScene(delta);
    }
}