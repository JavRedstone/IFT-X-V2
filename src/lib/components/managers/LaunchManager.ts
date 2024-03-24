import { type ThrelteContext } from "@threlte/core";
import { OrbitControls } from "@threlte/extras";
import { Euler, Group, PerspectiveCamera, Vector3 } from "three";
import { OLIT } from "../objects/OLIT";
import { Starship } from "../objects/Starship";
import { SuperHeavy } from "../objects/SuperHeavy";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { OLIT_CONSTANTS } from "../constants/objects/OLITConstants";
import { CameraConstants } from "../constants/CameraConstants";
import { CelestialConstants } from "../constants/CelestialConstants";

export class LaunchManager {
    public tc: ThrelteContext;
    
    public camera: PerspectiveCamera;
    public orbitControls: any;
    
    public OLIT: OLIT;
    public starship: Starship;
    public superHeavy: SuperHeavy;

    public group: Group = new Group();

    public isCameraInitialized: boolean = false;
    public isCameraOnStarship: boolean = false;
    public hasLaunched: boolean = false;

    constructor(tc: ThrelteContext) {
        this.tc = tc;

        this.setup();
    }

    public setup(): void {
        this.OLIT = new OLIT();
        this.starship = new Starship();
        this.superHeavy = new SuperHeavy();
    }

    public updateObjects(): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.group.userData.aabb == null || this.starship.group.userData.aabb == null || this.superHeavy.group.userData.aabb == null || this.OLIT.group.userData.aabb == null || this.group.userData.aabb.getSize(new Vector3).length() == 0 || this.starship.group.userData.aabb.getSize(new Vector3).length() == 0 || this.superHeavy.group.userData.aabb.getSize(new Vector3).length() == 0 || this.OLIT.group.userData.aabb.getSize(new Vector3).length() == 0) {
                this.group.userData.aabb = ObjectHelper.getAabb(this.group);
                this.starship.group.userData.aabb = ObjectHelper.getAabb(this.starship.group);
                this.superHeavy.group.userData.aabb = ObjectHelper.getAabb(this.superHeavy.group);
                this.OLIT.group.userData.aabb = ObjectHelper.getAabb(this.OLIT.group);
            }
            else {
                if (!this.hasLaunched) {
                    this.superHeavy.group.position.copy(this.OLIT.group.position.clone().add(this.OLIT.olm.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLIT_CONSTANTS.OLM_RING_HEIGHT * OLIT_CONSTANTS.OLM_SCALE.y * OLIT_CONSTANTS.OLIT_SCALE.y, 0))));
                    this.starship.group.position.copy(this.superHeavy.group.position.clone().add(new Vector3(0, this.superHeavy.boosterRing.userData.aabb.getSize(new Vector3).y + this.superHeavy.hsr.userData.aabb.getSize(new Vector3).y, 0)));
                    this.superHeavy.group.rotation.copy(OLIT_CONSTANTS.STARSHIP_ROTATION);
                    this.starship.group.rotation.copy(OLIT_CONSTANTS.STARSHIP_ROTATION);
                    
                    this.group.position.copy(new Vector3(0, CelestialConstants.EARTH_RADIUS, 0));
                }
                if (this.orbitControls != null && this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null && this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                    if (this.isCameraOnStarship) {
                        this.orbitControls.target.copy(new Vector3(this.OLIT.olm.position.x, this.group.position.y, this.OLIT.olm.position.z).add(this.starship.group.userData.aabb.getCenter(new Vector3)));
                        if (!this.isCameraInitialized && this.camera != null) {
                            this.camera.position.copy(new Vector3(this.OLIT.olm.position.x, this.group.position.y, this.OLIT.olm.position.z).add(this.starship.group.userData.aabb.getCenter(new Vector3)).add(new Vector3(CameraConstants.CAMERA_DEFAULT, 0, 0)));
                            this.isCameraInitialized = true;
                        }
                    }
                    else {
                        this.orbitControls.target.copy(new Vector3(this.OLIT.olm.position.x, this.group.position.y, this.OLIT.olm.position.z).add(this.superHeavy.group.userData.aabb.getCenter(new Vector3)));
                        if (!this.isCameraInitialized && this.camera != null) {
                            this.camera.position.copy(new Vector3(this.OLIT.olm.position.x, this.group.position.y, this.OLIT.olm.position.z).add(this.superHeavy.group.userData.aabb.getCenter(new Vector3)).add(new Vector3(CameraConstants.CAMERA_DEFAULT, 0, 0)));  
                            this.isCameraInitialized = true;
                        }
                    }
                }
            }
        }
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