import { type ThrelteContext } from "@threlte/core";
import { OrbitControls } from "@threlte/extras";
import { PerspectiveCamera } from "three";
import { OLIT } from "../objects/OLIT";
import { Starship } from "../objects/Starship";
import { SuperHeavy } from "../objects/SuperHeavy";

export class LaunchManager {
    public tc: ThrelteContext;
    
    public camera: PerspectiveCamera;
    public orbitControls: OrbitControls;
    
    public OLIT: OLIT;
    public starship: Starship;
    public superHeavy: SuperHeavy;

    constructor(tc: ThrelteContext, camera: PerspectiveCamera, orbitControls: OrbitControls) {
        this.tc = tc;
        this.camera = camera;
        this.orbitControls = orbitControls;

        this.setup();
    }

    public setup(): void {
        this.OLIT = new OLIT();
        this.starship = new Starship();
        this.superHeavy = new SuperHeavy();
    }

    public updateScene(delta: number): void {
        this.OLIT.updateScene(delta);
        this.starship.updateScene(delta);
        this.superHeavy.updateScene(delta);
    }
}