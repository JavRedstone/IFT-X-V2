import { type ThrelteContext } from "@threlte/core";
import { Euler, Group, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { OLIT } from "../objects/OLIT";
import { Starship } from "../objects/Starship";
import { SuperHeavy } from "../objects/SuperHeavy";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { OLITConstants } from "../constants/objects/OLITConstants";
import { CameraConstants } from "../constants/CameraConstants";
import { CelestialConstants } from "../constants/CelestialConstants";
import { MathHelper } from "../helpers/MathHelper";
import { PRTransients } from "../constants/transients/PRTransients";
import { SuperHeavyConstants } from "../constants/objects/SuperHeavyConstants";
import { starshipSettings, superHeavySettings } from "../stores/ui-store";

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
    public AABBUpdateRequests: number = 0;

    public earthRot: Euler = new Euler(0, 0, 0);

    public isCameraOnStarship: boolean = true;
    public hasLaunched: boolean = false;

    constructor(tc: ThrelteContext) {
        this.tc = tc;

        this.setup();
    }

    public setup(): void {
        this.OLIT = new OLIT();
        this.starship = new Starship();
        this.superHeavy = new SuperHeavy();

        this.setupUpdator();
    }

    public setupUpdator(): void {
        starshipSettings.subscribe((value) => {
            this.AABBUpdateRequests += 2;
        });
        superHeavySettings.subscribe((value) => {
            this.AABBUpdateRequests += 2;
        });
    }

    public updateAABBs(): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            this.group.position.copy(new Vector3(0, 0, 0));
            this.group.rotation.copy(new Euler(0, 0, 0));

            this.group.userData.aabb = ObjectHelper.getAabb(this.group);

            this.starship.group.position.copy(new Vector3(0, 0, 0));
            this.starship.group.rotation.copy(new Euler(0, 0, 0));
            
            this.starship.group.userData.aabb = ObjectHelper.getAabb(this.starship.group);

            this.superHeavy.group.position.copy(new Vector3(0, 0, 0));
            this.superHeavy.group.rotation.copy(new Euler(0, 0, 0));
            
            this.superHeavy.group.userData.aabb = ObjectHelper.getAabb(this.superHeavy.group);

            this.OLIT.group.position.copy(new Vector3(0, 0, 0));
            this.OLIT.group.rotation.copy(new Euler(0, 0, 0));

            this.OLIT.group.userData.aabb = ObjectHelper.getAabb(this.OLIT.group);
        }
    }

    public updateRealObjects(delta: number): void {
        this.earthRot.y += CelestialConstants.EARTH_ROTATION_SPEED * delta;
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.group.userData.aabb == null || this.starship.group.userData.aabb == null || this.superHeavy.group.userData.aabb == null || this.OLIT.group.userData.aabb == null || this.group.userData.aabb.getSize(new Vector3).length() == 0 || this.starship.group.userData.aabb.getSize(new Vector3).length() == 0 || this.superHeavy.group.userData.aabb.getSize(new Vector3).length() == 0 || this.OLIT.group.userData.aabb.getSize(new Vector3).length() == 0) {
                this.group.add(this.OLIT.group);
                this.group.add(this.starship.group);
                this.group.add(this.superHeavy.group);

                this.AABBUpdateRequests += 2;

                this.tc.scene.add(this.group);
            }
            else if (this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB) {
                if (!this.hasLaunched) {
                    this.superHeavy.group.position.copy(this.OLIT.group.position.clone().add(this.OLIT.olm.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y, 0))));
                    this.starship.group.position.copy(this.superHeavy.group.position.clone().add(new Vector3(0, this.superHeavy.boosterRing.userData.aabb.getSize(new Vector3).y + this.superHeavy.hsr.userData.aabb.getSize(new Vector3).y - this.superHeavy.hsr.userData.aabb.getSize(new Vector3).y * SuperHeavyConstants.HSR_OFFSET, 0)));
                    this.superHeavy.group.rotation.copy(OLITConstants.STARSHIP_ROTATION);
                    this.starship.group.rotation.copy(OLITConstants.STARSHIP_ROTATION);
                    this.OLIT.body.scale.y = (this.starship.group.userData.aabb.getSize(new Vector3).y + this.superHeavy.group.userData.aabb.getSize(new Vector3).y) / (OLITConstants.BODY_SCALE.y * OLITConstants.BODY_MULTIPLIER);
                    this.OLIT.hasSetupSingle = false;

                    if (!this.hasSetInitialPosition) {
                        let rotation: Euler = new Euler(153.875 * Math.PI / 180, 96.65 * Math.PI / 180, 0);
                        PRTransients.realPositions.groupPosition = new Vector3(1, 0, 0).applyEuler(rotation).multiplyScalar(CelestialConstants.EARTH_EFFECTIVE_RADIUS);
                        this.hasSetInitialPosition = true;
                    }
                    PRTransients.realPositions.groupPosition.applyEuler(new Euler(0, 2 * CelestialConstants.EARTH_ROTATION_SPEED * delta, 0));
                    PRTransients.realRotations.groupRotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot))));
                }
            }
        }
    }

    public updateRealCamera(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB &&
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
            if (this.AABBUpdateRequests > 0) {
                if (this.AABBUpdateRequests > 6) {
                    this.AABBUpdateRequests = 6;
                }
                this.updateAABBs();
                this.AABBUpdateRequests--;
            }
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
            this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB &&
            this.orbitControls != null && this.camera != null &&
            this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null &&
            this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                this.updateFreeView(delta);
        }
    }

    public updateObjects(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB) {    
                this.group.position.copy(PRTransients.fakePositions.groupPosition);
                this.group.rotation.copy(PRTransients.fakeRotations.groupRotation);
            }
        }
    }

    public updateCamera(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB &&
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