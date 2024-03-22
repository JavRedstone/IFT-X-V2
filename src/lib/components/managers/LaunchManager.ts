import { type ThrelteContext } from "@threlte/core";
import { OrbitControls } from "@threlte/extras";
import { PerspectiveCamera, Vector3 } from "three";
import { OLIT } from "../objects/OLIT";
import { Starship } from "../objects/Starship";
import { SuperHeavy } from "../objects/SuperHeavy";
import { ObjectHelper } from "../helpers/ObjectHelper";

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

    public updateObjects(): void {
        this.starship.group.position.copy(this.superHeavy.group.position.clone().add(new Vector3(0, ObjectHelper.getObjectDimensions(this.superHeavy.boosterRing).y + ObjectHelper.getObjectDimensions(this.superHeavy.hsr).y, 0)));
    }

    public updateScene(delta: number): void {
        this.OLIT.updateScene(delta);
        this.starship.updateScene(delta);
        this.superHeavy.updateScene(delta);

        if (this.starship.hasSetupSingle && this.superHeavy.hasSetupSingle) {
            this.updateObjects();
        }
    }
}