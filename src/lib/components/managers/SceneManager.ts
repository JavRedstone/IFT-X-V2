import { type ThrelteContext } from "@threlte/core";
import { SceneConstants } from "../constants/SceneConstants";
import { OrbitControls } from "@threlte/extras";
import { CelestialManager } from "./CelestialManager";
import { EffectManager } from "./EffectManager";
import { PerspectiveCamera } from "three";

export class SceneManager {
    public tc: ThrelteContext;
    public camera: PerspectiveCamera;
    public orbitControls: OrbitControls;

    public celestialManager: CelestialManager;
    public effectManager: EffectManager;

    public updInterval: number = 0;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setup();
    }

    public setup(): void {
        this.celestialManager = new CelestialManager(this.tc);
        this.effectManager = new EffectManager(this.tc, this.camera);
        this.updInterval = setInterval(() => this.updateScene(SceneConstants.DELTA), 1000 / SceneConstants.FPS);
    }    

    public updateScene(delta: number): void {
        this.celestialManager.updateScene(delta);
    }
}