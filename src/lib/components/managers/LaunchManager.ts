import { type ThrelteContext } from "@threlte/core";
import { OrbitControls } from "@threlte/extras";
import { Euler, Group, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { OLIT } from "../objects/OLIT";
import { Starship } from "../objects/Starship";
import { SuperHeavy } from "../objects/SuperHeavy";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { OLIT_CONSTANTS } from "../constants/objects/OLITConstants";
import { CameraConstants } from "../constants/CameraConstants";
import { CelestialConstants } from "../constants/CelestialConstants";
import { MathHelper } from "../helpers/MathHelper";
import { PRTransients } from "../constants/transients/PRTransients";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";

export class LaunchManager {
    public tc: ThrelteContext;
    
    public camera: PerspectiveCamera;
    public orbitControls: any;
    
    public OLIT: OLIT;
    public starship: Starship;
    public superHeavy: SuperHeavy;

    public group: Group = new Group();

    public isRealCameraInitialized: boolean = false;
    public isCameraInitialized: boolean = false;

    public hasSetInitialPosition: boolean = false;

    public earthRot: Euler = new Euler(0, 0, 0);

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

    public updateRealObjects(delta: number): void {
        this.earthRot.y += CelestialConstants.EARTH_ROTATION_SPEED * delta;
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.group.userData.aabb == null || this.starship.group.userData.aabb == null || this.superHeavy.group.userData.aabb == null || this.OLIT.group.userData.aabb == null || this.group.userData.aabb.getSize(new Vector3).length() == 0 || this.starship.group.userData.aabb.getSize(new Vector3).length() == 0 || this.superHeavy.group.userData.aabb.getSize(new Vector3).length() == 0 || this.OLIT.group.userData.aabb.getSize(new Vector3).length() == 0) {
                this.group.add(this.OLIT.group);
                this.group.add(this.starship.group);
                this.group.add(this.superHeavy.group);

                this.group.userData.aabb = ObjectHelper.getAabb(this.group);
                this.starship.group.userData.aabb = ObjectHelper.getAabb(this.starship.group);
                this.superHeavy.group.userData.aabb = ObjectHelper.getAabb(this.superHeavy.group);
                this.OLIT.group.userData.aabb = ObjectHelper.getAabb(this.OLIT.group);

                this.tc.scene.add(this.group);
            }
            else if (this.starship.hasUpdatedObb && this.superHeavy.hasUpdatedObb && this.OLIT.hasUpdatedObb) {
                if (!this.hasLaunched) {
                    this.superHeavy.group.position.copy(this.OLIT.group.position.clone().add(this.OLIT.olm.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLIT_CONSTANTS.OLM_RING_HEIGHT * OLIT_CONSTANTS.OLM_SCALE.y * OLIT_CONSTANTS.OLIT_SCALE.y, 0))));
                    this.starship.group.position.copy(this.superHeavy.group.position.clone().add(new Vector3(0, this.superHeavy.boosterRing.userData.aabb.getSize(new Vector3).y + this.superHeavy.hsr.userData.aabb.getSize(new Vector3).y - SuperHeavyConstants.HSR_OFFSET * SuperHeavyConstants.SUPER_HEAVY_SCALE.y, 0)));
                    this.superHeavy.group.rotation.copy(OLIT_CONSTANTS.STARSHIP_ROTATION);
                    this.starship.group.rotation.copy(OLIT_CONSTANTS.STARSHIP_ROTATION);
                    
                    if (!this.hasSetInitialPosition) {
                        let rotation: Euler = new Euler(153.875 * Math.PI / 180, 96.6 * Math.PI / 180, 0);
                        PRTransients.realPositions.groupPosition = new Vector3(1, 0, 0).applyEuler(rotation).multiplyScalar(CelestialConstants.EARTH_RADIUS);
                        this.hasSetInitialPosition = true;
                    }
                    let diffAxis: Vector3 = PRTransients.realPositions.groupPosition.clone().sub(new Vector3(0, PRTransients.realPositions.groupPosition.y, 0));
                    diffAxis.applyEuler(new Euler(0, CelestialConstants.EARTH_ROTATION_SPEED * delta, 0));
                    PRTransients.realPositions.groupPosition.copy(new Vector3(0, PRTransients.realPositions.groupPosition.y, 0).add(diffAxis));
                    PRTransients.realRotations.groupRotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot))));
                }
            }
        }
    }

    public updateRealCamera(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedObb && this.superHeavy.hasUpdatedObb && this.OLIT.hasUpdatedObb &&
            this.orbitControls != null && this.camera != null &&
            this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null &&
            this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                if (this.isCameraOnStarship) {
                    PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.groupPosition.clone().add(this.starship.group.position.clone().add(this.starship.group.userData.aabb.getCenter(new Vector3)).applyEuler(PRTransients.realRotations.groupRotation));
                    if (!this.isRealCameraInitialized) {
                        PRTransients.realPositions.cameraPosition = PRTransients.realPositions.groupPosition.clone().add(this.starship.group.position.clone().add(this.starship.group.userData.aabb.getCenter(new Vector3).add(new Vector3(0, 0, CameraConstants.CAMERA_DEFAULT))).applyEuler(PRTransients.realRotations.groupRotation));
                        this.isRealCameraInitialized = true;
                    }
                }
                else {
                    PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.groupPosition.clone().add(this.superHeavy.group.position.clone().add(this.superHeavy.group.userData.aabb.getCenter(new Vector3)).applyEuler(PRTransients.realRotations.groupRotation));
                    if (!this.isRealCameraInitialized) {
                        PRTransients.realPositions.cameraPosition = PRTransients.realPositions.groupPosition.clone().add(this.superHeavy.group.position.clone().add(this.superHeavy.group.userData.aabb.getCenter(new Vector3).add(new Vector3(0, 0, CameraConstants.CAMERA_DEFAULT))).applyEuler(PRTransients.realRotations.groupRotation));
                        this.isRealCameraInitialized = true;
                    }
                }
        }
    }

    public updateReals(delta: number): void {
        // we do update scene here b/c individual components in all objects are not affected by the global transform. Only the group will be affected by the global transform.
        this.OLIT.updateScene(delta);
        this.starship.updateScene(delta);
        this.superHeavy.updateScene(delta);

        if (this.starship.hasSetupSingle && this.superHeavy.hasSetupSingle) {
            this.updateRealObjects(delta);
            this.updateRealCamera(delta);
        }
    }

    public updateFreeView(delta: number): void {
        let targetPos: Vector3 = new Vector3(0, 0, 0);
        if (MathHelper.isInRadiusOf(PRTransients.fakePositions.earthPosition, CelestialConstants.EARTH_VIEW_RADIUS, this.orbitControls.target)) {
            targetPos = PRTransients.realPositions.earthPosition;
        }
        else if (MathHelper.isInRadiusOf(PRTransients.fakePositions.moonPosition, CelestialConstants.MOON_VIEW_RADIUS, this.orbitControls.target)) {
            targetPos = PRTransients.realPositions.moonPosition;
        }

        let rot: Quaternion = MathHelper.getAngleBetweenVectors(PRTransients.realPositions.orbitControlsPosition.clone().sub(targetPos).normalize(), new Vector3(0, 1, 0));
        for (let key of Object.keys(PRTransients.realPositions)) {
            PRTransients.fakePositions[key].copy(targetPos.clone().add(PRTransients.realPositions[key].clone().sub(targetPos).applyQuaternion(rot)));
        }
        for (let key of Object.keys(PRTransients.realRotations)) {
            PRTransients.fakeRotations[key].setFromQuaternion(rot.clone().multiply(new Quaternion().setFromEuler(PRTransients.realRotations[key])));
        }
    }

    public updateTransients(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedObb && this.superHeavy.hasUpdatedObb && this.OLIT.hasUpdatedObb &&
            this.orbitControls != null && this.camera != null &&
            this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null &&
            this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                this.updateFreeView(delta);
        }
    }

    public updateObjects(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.starship.hasUpdatedObb && this.superHeavy.hasUpdatedObb && this.OLIT.hasUpdatedObb) {    
                this.group.position.copy(PRTransients.fakePositions.groupPosition);
                this.group.rotation.copy(PRTransients.fakeRotations.groupRotation);
            }
        }
    }

    public updateCamera(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedObb && this.superHeavy.hasUpdatedObb && this.OLIT.hasUpdatedObb &&
            this.orbitControls != null && this.camera != null &&
            this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null &&
            this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                this.orbitControls.target.copy(PRTransients.fakePositions.orbitControlsPosition);

                if (!this.isCameraInitialized) {
                    this.camera.position.copy(PRTransients.fakePositions.cameraPosition);
                    this.isCameraInitialized = true;
                }
        }
    }

    public updateScene(delta: number): void {
        if (this.starship.hasSetupSingle && this.superHeavy.hasSetupSingle) {
            this.updateObjects(delta);
            this.updateCamera(delta);
        }
    }
}