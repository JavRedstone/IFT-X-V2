import type { ThrelteContext } from "@threlte/core";
import { BufferAttribute, BufferGeometry, Euler, Group, Line, LineBasicMaterial, PerspectiveCamera, Quaternion, Vector3 } from "three";
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
import { starshipSettings, superHeavySettings, telemetry, toggles } from "../stores/ui-store";
import { LaunchConstants } from "../constants/objects/LaunchConstants";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { FlightController } from "../controllers/FlightController";
import { LaunchHelper } from "../helpers/LaunchHelper";

export class LaunchManager {
    public tc: ThrelteContext;
    
    public camera: PerspectiveCamera;
    public orbitControls: any;
    
    public OLIT: OLIT;
    public starship: Starship;
    public superHeavy: SuperHeavy;

    public group: Group = new Group();
    public stackGroup: Group = new Group();

    public isRealCameraInitialized: boolean = false;
    public isCameraInitialized: boolean = false;

    public hasSetInitialPosition: boolean = false;
    public AABBUpdateRequests: number = 0;

    public earthRot: Euler = new Euler(0, 0, 0);
    public targetPos: Vector3 = new Vector3(0, 0, 0);

    public isCameraOnStarship: boolean = true;
    public isFreeView: boolean = true;

    public dt: number = 0;
    public ticks: number = 0;
    public isEditing: boolean = false;
    public isFueling: boolean = false;
    public hasStartedFueling: boolean = false;
    public isLaunching: boolean = false;

    public currEvent: number = 0;
    public isEventEnabled: boolean = false;
    public isEventUrgent: boolean = false;
    public isEventClicked: boolean = false;

    public canLiftOff: boolean = false;
    public liftedOff: boolean = false;
    public separated: boolean = false;
    public justSeparated: boolean = false;

    public previousSSPos: Vector3 = new Vector3(0, 0, 0);
    public previousSHPos: Vector3 = new Vector3(0, 0, 0);

    public starshipDisabled: boolean = true;
    public superHeavyDisabled: boolean = false;

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
        toggles.subscribe((value) => {
            this.isEditing = value.isEditing;
            this.isFueling = value.isFueling;
            this.hasStartedFueling = value.hasStartedFueling;
            this.isLaunching = value.isLaunching;
        });
        telemetry.subscribe((value) => {
            this.isCameraOnStarship = value.isCameraOnStarship;
            this.isEventClicked = value.isEventClicked;
            if (this.isEventClicked) {
                this.handleEventClick();
            }
        });
        starshipSettings.subscribe((value) => {
            this.AABBUpdateRequests += LaunchConstants.AABB_REQUEST_AMOUNT;
        });
        superHeavySettings.subscribe((value) => {
            this.AABBUpdateRequests += LaunchConstants.AABB_REQUEST_AMOUNT;
        });
    }

    public updateAABBs(): void {
        if (this.group != null && this.stackGroup != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            this.group.position.copy(new Vector3(0, 0, 0));
            this.group.rotation.copy(new Euler(0, 0, 0));

            this.group.userData.aabb = ObjectHelper.getAabb(this.group);

            this.stackGroup.position.copy(new Vector3(0, 0, 0));
            this.stackGroup.rotation.copy(new Euler(0, 0, 0));

            this.stackGroup.userData.aabb = ObjectHelper.getAabb(this.stackGroup);

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
        if (this.group != null && this.stackGroup != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.group.userData.aabb == null || this.stackGroup.userData.aabb == null || this.starship.group.userData.aabb == null || this.superHeavy.group.userData.aabb == null || this.OLIT.group.userData.aabb == null || this.group.userData.aabb.getSize(new Vector3).length() == 0 || this.stackGroup.userData.aabb.getSize(new Vector3).length() == 0 || this.starship.group.userData.aabb.getSize(new Vector3).length() == 0 || this.superHeavy.group.userData.aabb.getSize(new Vector3).length() == 0 || this.OLIT.group.userData.aabb.getSize(new Vector3).length() == 0) {
                this.stackGroup.add(this.starship.group);
                this.stackGroup.add(this.superHeavy.group);
                
                this.group.add(this.OLIT.group);
                this.group.add(this.stackGroup);

                this.AABBUpdateRequests += LaunchConstants.AABB_REQUEST_AMOUNT;

                this.tc.scene.add(this.group);
            }
            else if (this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB) {
                if (this.isFueling && !this.hasStartedFueling) {
                    let ssCH4Volume: number = MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, this.starship.options.shipRingHeight * StarshipConstants.CH4_PERCENTAGE);   
                    let ssLOXVolume: number = MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, this.starship.options.shipRingHeight * StarshipConstants.LOX_PERCENTAGE);
                
                    let shCH4Volume: number = MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, this.superHeavy.options.boosterRingHeight * SuperHeavyConstants.CH4_PERCENTAGE);
                    let shLOXVolume: number = MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, this.superHeavy.options.boosterRingHeight * SuperHeavyConstants.LOX_PERCENTAGE);

                    this.dt = -Math.round(-LaunchConstants.STOP_DT + Math.max(ssCH4Volume, ssLOXVolume, shCH4Volume, shLOXVolume) / LaunchConstants.FUELING_RATE);
                }
                if (this.hasStartedFueling) {
                    if (this.dt >= LaunchConstants.HOLD_DT) {
                        this.dt = LaunchConstants.HOLD_DT;
                        if (this.starship.LOX == 1 && this.superHeavy.LOX == 1 && this.starship.CH4 == 1 && this.superHeavy.CH4 == 1) {
                            toggles.update((value) => {
                                value.doneFueling = true;
                                return value;
                            });
                        }
                    }
                    else {
                        this.dt += delta * LaunchConstants.FUELING_SPEEDUP;
                    }
                }
                
                if (this.OLIT.hasUpdatedAABB && !this.liftedOff) {
                    this.stackGroup.position.copy(this.OLIT.group.position.clone().add(this.OLIT.olm.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y, 0))));
                    this.starship.group.position.copy(this.superHeavy.group.position.clone().add(new Vector3(0, this.superHeavy.boosterRing.userData.aabb.getSize(new Vector3).y + this.superHeavy.hsr.userData.aabb.getSize(new Vector3).y - this.superHeavy.hsr.userData.aabb.getSize(new Vector3).y * SuperHeavyConstants.HSR_OFFSET, 0)));
                    this.stackGroup.rotation.copy(OLITConstants.STACK_ROTATION);

                    this.OLIT.body.scale.y = (this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y + this.superHeavy.group.userData.aabb.getSize(new Vector3).y + this.starship.group.userData.aabb.getSize(new Vector3).y) / 2;
                    this.OLIT.qd.position.copy(this.OLIT.body.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y + this.superHeavy.group.userData.aabb.getSize(new Vector3).y + StarshipConstants.LOX_BOTTOM_FIXED * StarshipConstants.STARSHIP_SCALE.y, 0)));
                    let qdPosition: Vector3 = this.OLIT.body.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y + this.superHeavy.group.userData.aabb.getSize(new Vector3).y + StarshipConstants.LOX_BOTTOM_FIXED * StarshipConstants.STARSHIP_SCALE.y, 0));
                    this.OLIT.qd.position.copy(qdPosition);
                    this.OLIT.carriageQd.position.copy(qdPosition);
                    let armPosition: Vector3 = this.OLIT.body.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y + this.superHeavy.group.userData.aabb.getSize(new Vector3).y + this.starship.shipRing.position.y + this.starship.shipRing.scale.y, 0));
                    this.OLIT.arm1.position.copy(armPosition);
                    this.OLIT.arm2.position.copy(armPosition);
                    this.OLIT.carriageArms.position.copy(armPosition);
                    this.OLIT.hasSetupSingle = false;
                }
                if (this.isLaunching) {
                    if (this.dt < LaunchConstants.COUNTDOWN_DT) {
                        this.dt += delta * LaunchConstants.COUNTDOWN_SPEEDUP;
                    }
                    else {
                        this.dt += delta * LaunchConstants.LAUNCH_SPEEDUP;
                    }
                    if (this.canLiftOff && !this.liftedOff) {
                        this.starshipDisabled = true;
                        this.superHeavyDisabled = false;

                        let stackGroupOriginalPos: Vector3 = PRTransients.realPositions.groupPosition.clone().add(this.stackGroup.position.clone());
                        let stackGroupOriginalRot: Euler = this.stackGroup.rotation.clone();
                        this.group.remove(this.stackGroup);
                        this.tc.scene.add(this.stackGroup);
                        PRTransients.realPositions.stackGroupPosition.copy(stackGroupOriginalPos.clone().sub(PRTransients.realPositions.groupPosition).applyEuler(PRTransients.realRotations.groupRotation).add(PRTransients.realPositions.groupPosition));
                        PRTransients.realRotations.stackGroupRotation.copy(new Euler().setFromQuaternion((new Quaternion().setFromEuler(PRTransients.realRotations.groupRotation)).multiply(new Quaternion().setFromEuler(stackGroupOriginalRot))));
                        
                        let radiusFromEarthAxis: number = PRTransients.realPositions.stackGroupPosition.clone().sub(new Vector3(0, PRTransients.realPositions.stackGroupPosition.y, 0)).length();
                        let initialVelocity: Vector3 = new Vector3(0, 1, 0).cross(PRTransients.realPositions.stackGroupPosition.clone().normalize()).normalize().multiplyScalar(CelestialConstants.EARTH_ROTATION_SPEED * radiusFromEarthAxis);

                        this.stackGroup.userData.flightController = new FlightController(PRTransients.realPositions.stackGroupPosition, initialVelocity, PRTransients.realRotations.stackGroupRotation);

                        this.liftedOff = true;
                    }
                    if (this.separated && this.justSeparated) {
                        this.starshipDisabled = false;
                        this.superHeavyDisabled = false;

                        let ssOriginalPos: Vector3 = PRTransients.realPositions.stackGroupPosition.clone().add(this.starship.group.position.clone());
                        let shOriginalPos: Vector3 = PRTransients.realPositions.stackGroupPosition.clone().add(this.superHeavy.group.position.clone());
                        let ssOriginalRot: Euler = this.starship.group.rotation.clone();
                        let shOriginalRot: Euler = this.superHeavy.group.rotation.clone();
                        this.stackGroup.remove(this.starship.group);
                        this.stackGroup.remove(this.superHeavy.group);
                        this.tc.scene.add(this.starship.group);
                        this.tc.scene.add(this.superHeavy.group);
                        PRTransients.realPositions.starshipPosition.copy(ssOriginalPos.clone().sub(PRTransients.realPositions.stackGroupPosition).applyEuler(PRTransients.realRotations.stackGroupRotation).add(PRTransients.realPositions.stackGroupPosition));
                        PRTransients.realPositions.superHeavyPosition.copy(shOriginalPos.clone().sub(PRTransients.realPositions.stackGroupPosition).applyEuler(PRTransients.realRotations.stackGroupRotation).add(PRTransients.realPositions.stackGroupPosition));
                        PRTransients.realRotations.starshipRotation.copy(new Euler().setFromQuaternion((new Quaternion().setFromEuler(PRTransients.realRotations.stackGroupRotation)).multiply(new Quaternion().setFromEuler(ssOriginalRot))));
                        PRTransients.realRotations.superHeavyRotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromEuler(PRTransients.realRotations.stackGroupRotation).multiply(new Quaternion().setFromEuler(shOriginalRot))));

                        this.starship.flightController = new FlightController(PRTransients.realPositions.starshipPosition, this.stackGroup.userData.flightController.initialVelocity.clone().divideScalar(CelestialConstants.REAL_SCALE), PRTransients.realRotations.starshipRotation, this.stackGroup.userData.flightController.velocity.clone().divideScalar(CelestialConstants.REAL_SCALE));
                        this.superHeavy.flightController = new FlightController(PRTransients.realPositions.superHeavyPosition, this.stackGroup.userData.flightController.initialVelocity.clone().divideScalar(CelestialConstants.REAL_SCALE), PRTransients.realRotations.superHeavyRotation, this.stackGroup.userData.flightController.velocity.clone().divideScalar(CelestialConstants.REAL_SCALE));

                        this.justSeparated = false;
                    }
                    if (this.dt >= LaunchConstants.STARTUP_DT && this.dt < LaunchConstants.MECO_DT && !this.superHeavy.startStartupSequence) {
                        this.superHeavy.startStartupSequence = true;
                    }

                    if (this.liftedOff) {
                        this.handleEventEnable();
                        if (!this.separated) {
                            let altitude: number = this.stackGroup.userData.flightController.getAltitude();

                            // thrust

                            this.stackGroup.userData.flightController.acceleration = new Vector3(0, 0, 0);

                            this.stackGroup.userData.flightController.acceleration.add(new Vector3(0, this.superHeavy.getThrustVector(altitude).y / (this.superHeavy.getMass() + this.starship.getMass()), 0).applyEuler(PRTransients.realRotations.stackGroupRotation));

                            // torque
                            this.stackGroup.userData.flightController.angularAcceleration = new Vector3(0, 0, 0);
                            // gimbal
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getThrustTorque(this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitch()));
                            // grid fins
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getGridFinPitchTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitch()));
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getGridFinRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.getStackMOIRoll()));
                            // drag sh
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getDragPitchTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitch()));
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getDragRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.getStackMOIRoll()));
                            // drag ss
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.starship.getDragPitchTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitch()));
                            this.stackGroup.userData.flightController.angularAcceleration.add(this.starship.getDragRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.getStackMOIRoll()));

                            // gravity

                            this.stackGroup.userData.flightController.acceleration.add(new Vector3(0, -LaunchHelper.getGEarth(altitude), 0).applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot))));

                            // update flight controller

                            this.stackGroup.userData.flightController.update(delta, this.getStackCOM());

                            // update real positions and rotations
                            PRTransients.realPositions.stackGroupPosition = this.stackGroup.userData.flightController.fakePosition.clone().divideScalar(CelestialConstants.REAL_SCALE);

                            PRTransients.realRotations.stackGroupRotation = new Euler().setFromQuaternion(this.stackGroup.userData.flightController.rotation);

                            telemetry.update((value) => {
                                value.starshipSpeed = Math.round(this.stackGroup.userData.flightController.relVelocity.length() * 3.6);
                                value.starshipAltitude = Math.round(this.stackGroup.userData.flightController.getAltitude() / 1000);
                                value.starshipAngle = this.stackGroup.userData.flightController.getDisplayAngle();

                                value.superHeavySpeed = Math.round(this.stackGroup.userData.flightController.relVelocity.length() * 3.6);
                                value.superHeavyAltitude = Math.round(this.stackGroup.userData.flightController.getAltitude() / 1000);
                                value.superHeavyAngle = this.stackGroup.userData.flightController.getDisplayAngle();
                                
                                value.superHeavyDisabled = this.superHeavyDisabled;
                                value.starshipDisabled = this.starshipDisabled;
                                return value;
                            });
                        }
                        else if (!this.justSeparated) {
                            let shAltitude: number = this.superHeavy.flightController.getAltitude();
                            let ssAltitude: number = this.starship.flightController.getAltitude();

                            // thrust

                            this.superHeavy.flightController.acceleration = new Vector3(0, 0, 0);
                            this.starship.flightController.acceleration = new Vector3(0, 0, 0);

                            this.superHeavy.flightController.acceleration.add(new Vector3(0, this.superHeavy.getThrustVector(shAltitude).y / this.superHeavy.getMass(), 0).applyEuler(PRTransients.realRotations.superHeavyRotation));
                            this.starship.flightController.acceleration.add(new Vector3(0, this.starship.getThrustVector(ssAltitude).y / this.starship.getMass(), 0).applyEuler(PRTransients.realRotations.starshipRotation));

                            // torque
                            this.superHeavy.flightController.angularAcceleration = new Vector3(0, 0, 0);
                            this.starship.flightController.angularAcceleration = new Vector3(0, 0, 0);
                            // gimbal
                            this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getThrustTorque(this.getStackCOM(), shAltitude).divideScalar(this.superHeavy.getMOIPitch()));
                            this.starship.flightController.angularAcceleration.add(this.starship.getThrustTorque(this.starship.getCOM(), ssAltitude).divideScalar(this.starship.getMOIPitch()));
                            // grid fins
                            this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getGridFinPitchTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, this.superHeavy.getCOM(), shAltitude).divideScalar(this.superHeavy.getMOIPitch()));
                            this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getGridFinRollTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, shAltitude).divideScalar(this.superHeavy.getMOIRoll()));
                            // drag sh
                            this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getDragPitchTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, this.superHeavy.getCOM(), shAltitude).divideScalar(this.superHeavy.getMOIPitch()));
                            this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getDragRollTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, ssAltitude).divideScalar(this.superHeavy.getMOIRoll()));
                            // drag ss
                            this.starship.flightController.angularAcceleration.add(this.superHeavy.getDragPitchTorque(this.starship.flightController.rotation, this.starship.flightController.relVelocity, this.starship.getCOM(), shAltitude).divideScalar(this.starship.getMOIPitch()));
                            this.starship.flightController.angularAcceleration.add(this.starship.getDragRollTorque(this.starship.flightController.rotation, this.starship.flightController.relVelocity, ssAltitude).divideScalar(this.starship.getMOIRoll()));

                            // gravity

                            this.superHeavy.flightController.acceleration.add(new Vector3(0, -LaunchHelper.getGEarth(shAltitude), 0).applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot))));
                            this.starship.flightController.acceleration.add(new Vector3(0, -LaunchHelper.getGEarth(ssAltitude), 0).applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot))));

                            // update flight controller

                            this.superHeavy.flightController.update(delta, this.superHeavy.getCOM());
                            this.starship.flightController.update(delta, this.starship.getCOM());

                            // update real positions and rotations
                            PRTransients.realPositions.superHeavyPosition = this.superHeavy.flightController.fakePosition.clone().divideScalar(CelestialConstants.REAL_SCALE);
                            PRTransients.realPositions.starshipPosition = this.starship.flightController.fakePosition.clone().divideScalar(CelestialConstants.REAL_SCALE);

                            PRTransients.realRotations.superHeavyRotation = new Euler().setFromQuaternion(this.superHeavy.flightController.rotation);
                            PRTransients.realRotations.starshipRotation = new Euler().setFromQuaternion(this.starship.flightController.rotation);

                            telemetry.update((value) => {
                                value.starshipSpeed = Math.round(this.starship.flightController.relVelocity.length() * 3.6);
                                value.starshipAltitude = Math.round(this.starship.flightController.getAltitude() / 1000);
                                value.starshipAngle = this.starship.flightController.getDisplayAngle();

                                value.superHeavySpeed = Math.round(this.superHeavy.flightController.relVelocity.length() * 3.6);
                                value.superHeavyAltitude = Math.round(this.superHeavy.flightController.getAltitude() / 1000);
                                value.superHeavyAngle = this.superHeavy.flightController.getDisplayAngle();
                                
                                value.superHeavyDisabled = this.superHeavyDisabled;
                                value.starshipDisabled = this.starshipDisabled;
                                return value;
                            });
                        }
                    }
                    else {
                        if (this.dt - LaunchConstants.STARTUP_DT >= LaunchConstants.PAD_DT) {
                            telemetry.update((value) => {
                                value.currEvent = LaunchConstants.LAUNCH_EVENTS.length;
                                value.superHeavyDisabled = true;
                                value.starshipDisabled = true;
                                return value;
                            });
                            this.superHeavy.runForceShutdown();
                        }
                        else {
                            let altitude: number = LaunchHelper.getAltitude(this.group.position.clone().add(this.stackGroup.position.clone().add(this.superHeavy.group.position)));
                            if (this.superHeavy.getThrustVector(altitude).y - this.getStackWeight(altitude) > 0) {
                                this.canLiftOff = true;
                                this.OLIT.startQDSwing = true;
                            }
                        }
                    }
                }
            }
            if (!this.hasSetInitialPosition) {
                let rotation: Euler = new Euler(153.875 * Math.PI / 180, 96.65 * Math.PI / 180, 0);
                PRTransients.realPositions.groupPosition = new Vector3(1, 0, 0).applyEuler(rotation).multiplyScalar(CelestialConstants.EARTH_EFFECTIVE_RADIUS);
                this.hasSetInitialPosition = true;
            }
            PRTransients.realPositions.groupPosition.applyEuler(new Euler(0, CelestialConstants.EARTH_ROTATION_SPEED * delta, 0)); // this is normal
            PRTransients.realRotations.groupRotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot))));
        }
        telemetry.update((value) => {
            value.dt = this.dt;
            return value;
        });
    }

    public updateRealCamera(): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB &&
            this.orbitControls != null && this.camera != null &&
            this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null &&
            this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                if (this.isCameraOnStarship) {
                    if (this.separated && !this.justSeparated) {
                        PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.starshipPosition.clone().add(this.starship.group.userData.aabb.getCenter(new Vector3).applyEuler(PRTransients.realRotations.starshipRotation));
                    }
                    else if (this.liftedOff) {
                        PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.stackGroupPosition.clone().add(this.starship.group.position.clone().add(this.starship.group.userData.aabb.getCenter(new Vector3)).applyEuler(PRTransients.realRotations.stackGroupRotation));
                    }
                    else {
                        PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.groupPosition.clone().add(this.stackGroup.position.clone().add(this.starship.group.position.clone()).add(this.starship.group.userData.aabb.getCenter(new Vector3)).applyEuler(PRTransients.realRotations.groupRotation));
                    }
                    if (!this.isRealCameraInitialized) {
                        PRTransients.realPositions.cameraPosition = PRTransients.realPositions.groupPosition.clone().add(this.starship.group.position.clone().add(this.starship.group.userData.aabb.getCenter(new Vector3).add(new Vector3(CameraConstants.CAMERA_DEFAULT_DISTANCE, 0, CameraConstants.CAMERA_DEFAULT_DISTANCE))).applyEuler(PRTransients.realRotations.groupRotation));
                        this.isRealCameraInitialized = true;
                    }
                }
                else {
                    if (this.separated && !this.justSeparated) {
                        PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.superHeavyPosition.clone().add(this.superHeavy.group.userData.aabb.getCenter(new Vector3).applyEuler(PRTransients.realRotations.superHeavyRotation));
                    }
                    else if (this.liftedOff) {
                        PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.stackGroupPosition.clone().add(this.superHeavy.group.position.clone().add(this.superHeavy.group.userData.aabb.getCenter(new Vector3)).applyEuler(PRTransients.realRotations.stackGroupRotation));
                    }
                    else {
                        PRTransients.realPositions.orbitControlsPosition = PRTransients.realPositions.groupPosition.clone().add(this.stackGroup.position.clone().add(this.superHeavy.group.position.clone()).add(this.superHeavy.group.userData.aabb.getCenter(new Vector3)).applyEuler(PRTransients.realRotations.groupRotation));
                    }
                    if (!this.isRealCameraInitialized) {
                        PRTransients.realPositions.cameraPosition = PRTransients.realPositions.groupPosition.clone().add(this.superHeavy.group.position.clone().add(this.superHeavy.group.userData.aabb.getCenter(new Vector3).add(new Vector3(CameraConstants.CAMERA_DEFAULT_DISTANCE, 0, CameraConstants.CAMERA_DEFAULT_DISTANCE))).applyEuler(PRTransients.realRotations.groupRotation));
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
                if (this.AABBUpdateRequests > LaunchConstants.AABB_REQUEST_MAX) {
                    this.AABBUpdateRequests = LaunchConstants.AABB_REQUEST_MAX;
                }
                this.updateAABBs();
                this.AABBUpdateRequests--;
            }
            this.updateRealObjects(delta);
            this.updateRealCamera();
        }
    }

    public updateView(): void {
        if (MathHelper.isInRadiusOf(PRTransients.fakePositions.earthPosition, CelestialConstants.EARTH_VIEW_RADIUS, this.orbitControls.target)) {
            this.targetPos = PRTransients.realPositions.earthPosition;
            this.isFreeView = true;
        }
        else if (MathHelper.isInRadiusOf(PRTransients.fakePositions.moonPosition, CelestialConstants.MOON_VIEW_RADIUS, this.orbitControls.target)) {
            this.targetPos = PRTransients.realPositions.moonPosition;
            this.isFreeView = true;
        }

        if (this.isFreeView) {
            let rot: Quaternion = MathHelper.getAngleBetweenVectors(PRTransients.realPositions.orbitControlsPosition.clone().sub(this.targetPos).normalize(), new Vector3(0, 1, 0));
            for (let key of Object.keys(PRTransients.realPositions)) {
                PRTransients.fakePositions[key].copy(this.targetPos.clone().add(PRTransients.realPositions[key].clone().sub(this.targetPos).applyQuaternion(rot)));
            }
            for (let key of Object.keys(PRTransients.realRotations)) {
                PRTransients.fakeRotations[key].setFromQuaternion(rot.clone().multiply(new Quaternion().setFromEuler(PRTransients.realRotations[key])));
            }
            // for (let key of Object.keys(PRTransients.realPositions)) {
            //     PRTransients.fakePositions[key].copy(this.targetPos.clone().add(PRTransients.realPositions[key].clone()));
            // }
            // for (let key of Object.keys(PRTransients.realRotations)) {
            //     PRTransients.fakeRotations[key].copy(PRTransients.realRotations[key].clone());
            // }
        }
    }

    public updateTransients(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null &&
            this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB &&
            this.orbitControls != null && this.camera != null &&
            this.starship.group.userData.aabb != null && this.superHeavy.group.userData.aabb != null &&
            this.starship.group.userData.aabb.getSize(new Vector3).length() != 0 && this.superHeavy.group.userData.aabb.getSize(new Vector3).length() != 0) {
                this.updateView();
        }
    }

    public updateObjects(delta: number): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB) {    
                this.group.position.copy(PRTransients.fakePositions.groupPosition);
                this.group.rotation.copy(PRTransients.fakeRotations.groupRotation);
                if (this.liftedOff) {
                    this.stackGroup.position.copy(PRTransients.fakePositions.stackGroupPosition);
                    this.stackGroup.rotation.copy(PRTransients.fakeRotations.stackGroupRotation);
                    if (this.separated && !this.justSeparated) {
                        this.starship.group.position.copy(PRTransients.fakePositions.starshipPosition);
                        this.starship.group.rotation.copy(PRTransients.fakeRotations.starshipRotation);
                        this.superHeavy.group.position.copy(PRTransients.fakePositions.superHeavyPosition);
                        this.superHeavy.group.rotation.copy(PRTransients.fakeRotations.superHeavyRotation);
                    }
                }
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
                if (this.liftedOff) {
                    let ssPos: Vector3 = new Vector3(0, 0, 0);
                    let shPos: Vector3 = new Vector3(0, 0, 0);
                    if (this.separated && !this.justSeparated) {
                        shPos.copy(PRTransients.fakePositions.superHeavyPosition);
                        ssPos.copy(PRTransients.fakePositions.starshipPosition);
                    }
                    else if (this.liftedOff) {
                        shPos.copy(PRTransients.fakePositions.superHeavyPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()));
                        ssPos.copy(PRTransients.fakePositions.starshipPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()));
                    }
                    else {
                        shPos.copy(PRTransients.fakePositions.superHeavyPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()).add(PRTransients.fakePositions.groupPosition.clone()));
                        ssPos.copy(PRTransients.fakePositions.starshipPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()).add(PRTransients.fakePositions.groupPosition.clone()));
                    }

                    if (this.isCameraOnStarship) {
                        this.camera.position.add(ssPos.clone().sub(this.previousSSPos));
                    }
                    else {
                        this.camera.position.add(shPos.clone().sub(this.previousSHPos));
                    }
                }
                
                if (this.separated && !this.justSeparated) {
                    this.previousSHPos.copy(PRTransients.fakePositions.superHeavyPosition);
                    this.previousSSPos.copy(PRTransients.fakePositions.starshipPosition);
                }
                else if (this.liftedOff) {
                    this.previousSHPos.copy(PRTransients.fakePositions.superHeavyPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()));
                    this.previousSSPos.copy(PRTransients.fakePositions.starshipPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()));
                }
                else {
                    this.previousSHPos.copy(PRTransients.fakePositions.superHeavyPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()).add(PRTransients.fakePositions.groupPosition.clone()));
                    this.previousSSPos.copy(PRTransients.fakePositions.starshipPosition.clone().add(PRTransients.fakePositions.stackGroupPosition.clone()).add(PRTransients.fakePositions.groupPosition.clone()));
                }
        }
    }

    public updateScene(delta: number): void {
        if (this.starship.hasSetupSingle && this.superHeavy.hasSetupSingle) {
            this.updateObjects(delta);
            this.updateCamera(delta);
        }
    }

    // stack

    public getStackMass(): number {
        return this.superHeavy.getMass() + this.starship.getMass();
    }

    public getStackWeight(altitude: number): number {
        return this.superHeavy.getWeight(altitude) + this.starship.getWeight(altitude);
    }

    public getStackCOM(): Vector3 {
        let COM: Vector3 = new Vector3(0, 0, 0);
        COM.add(this.superHeavy.getCOM().clone().multiplyScalar(this.superHeavy.getMass()));
        COM.add(this.starship.getCOM().clone().add(new Vector3(0, this.superHeavy.group.userData.aabb.getSize(new Vector3).y * StarshipConstants.REAL_LIFE_SCALE.y, 0)).multiplyScalar(this.starship.getMass()));
        COM.x = 0;
        COM.z = 0;
        return COM.divideScalar(this.getStackMass());
    }

    public getStackMOIRoll(): number {
        return 1/2 * this.getStackMass() * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x, 2); // the ring scale is the same anyway
    }

    public getStackMOIPitch(): number {
        return 1/4 * this.getStackMass() * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x * SuperHeavyConstants.REAL_LIFE_SCALE.x + StarshipConstants.SHIP_RING_SCALE.x * StarshipConstants.REAL_LIFE_SCALE.x, 2) + 1/12 * this.getStackMass() * Math.pow(this.superHeavy.options.boosterRingHeight * SuperHeavyConstants.REAL_LIFE_SCALE.y + this.starship.options.shipRingHeight * StarshipConstants.REAL_LIFE_SCALE.y, 2);
    }

    public handleEventEnable(): void {
        if (this.dt >= LaunchConstants.MECO_DT) {
            this.isEventEnabled = true;
        }
        if (this.superHeavy.LOX <= 0 || this.superHeavy.CH4 <= 0) {
            this.superHeavy.runForceShutdown();
            if (this.currEvent == 0) {
                this.currEvent = 1;
                this.isEventEnabled = true;
            }
            else if (this.currEvent == 2 || this.currEvent == 3 || this.currEvent == 4 || this.currEvent == 5) {
                this.currEvent = 6;
                this.isEventEnabled = true;
            }
        }

        if (this.starship.LOX <= 0 || this.starship.CH4 <= 0) {
            this.starship.runForceShutdown();
            if (this.currEvent == 6) {
                this.currEvent = 7;
                this.isEventEnabled = true;
            }
            else if (this.currEvent == 9) {
                this.currEvent = 10; // hide
            }
        }
        
        telemetry.update((value) => {
            value.currEvent = this.currEvent;
            value.isEventEnabled = this.isEventEnabled;
            value.isEventUrgent = this.isEventUrgent;
            value.isEventClicked = this.isEventClicked;
            return value;
        });
    }

    public handleEventClick(): void {
        this.isEventClicked = false;
        if (this.isEventEnabled) {
            this.isEventEnabled = false;
            if (this.currEvent == 0) {
                this.superHeavy.startMECOSequence = true;
            }
            else if (this.currEvent == 1) {
                this.separated = true;
                this.justSeparated = true;

                this.starship.startStartupSequence = true;
            }
            this.currEvent++;
        }
        
        telemetry.update((value) => {
            value.separated = this.separated;
            value.currEvent = this.currEvent;
            value.isEventEnabled = this.isEventEnabled;
            value.isEventUrgent = this.isEventUrgent;
            value.isEventClicked = this.isEventClicked;
            return value;
        });
    }
}