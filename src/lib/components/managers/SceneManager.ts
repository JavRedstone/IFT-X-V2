import { type ThrelteContext } from "@threlte/core";
import { CelestialManager } from "./CelestialManager";
import { PostprocessingManager } from "./PostprocessingManager";
import { PerspectiveCamera } from "three";
import { SkyManager } from "./SkyManager";
import { LaunchManager } from "./LaunchManager";
import { gameSettings } from "../stores/ui-store";

export class SceneManager {
    public tc: ThrelteContext;
    public camera: PerspectiveCamera;

    public celestialManager: CelestialManager;
    public skyManager: SkyManager;
    public launchManager: LaunchManager;
    public postprocessingManager: PostprocessingManager;

    public speedUp: number = 1;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setup();
        this.setupUpdator();
    }

    public setup(): void {
        this.celestialManager = new CelestialManager(this.tc);
        this.skyManager = new SkyManager(this.tc);
        this.launchManager = new LaunchManager(this.tc);
        this.postprocessingManager = new PostprocessingManager(this.tc);
    }

    public setupUpdator(): void {
        gameSettings.subscribe((value) => {
            this.speedUp = value.speedUp;
        });
    }

    public updateReals(delta: number): void {
        this.celestialManager.updateReals(delta);
        this.launchManager.updateReals(delta);
    }

    public updateScene(delta: number): void {
        this.celestialManager.updateScene(delta);
        this.launchManager.updateScene(delta);
        let altitude: number = 0;
        if (this.launchManager.liftedOff) {
            if (this.launchManager.separated && !this.launchManager.justSeparated) {
                if (this.launchManager.isCameraOnStarship) {
                    altitude = this.launchManager.starship.flightController.getAltitude();
                }
                else {
                    altitude = this.launchManager.superHeavy.flightController.getAltitude();
                }
            }
            else {
                altitude = this.launchManager.stackGroup.userData.flightController.getAltitude();
            }
        }
        this.skyManager.updateScene(delta, altitude);
    }

    public updateAll(delta: number): void {
        let dt: number = delta * this.speedUp;
        this.updateReals(dt);
        this.launchManager.updateTransients(dt);
        this.updateScene(dt);
    }
}