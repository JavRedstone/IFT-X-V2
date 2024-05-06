import type { ThrelteContext } from "@threlte/core";
import { ArrowHelper, Euler, Group, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three";
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
import { RaptorParticle } from "../particles/classes/RaptorParticle";
import { ParticleConstants } from "../constants/ParticleConstants";
import { DelugeParticle } from "../particles/classes/DelugeParticle";
import { HotStageParticle } from "../particles/classes/HotStageParticle";
import { ReentryParticle } from "../particles/classes/ReentryParticle";
import { ExplosionParticle } from "../particles/classes/ExplosionParticle";

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

    public dt: number = 0;
    public ticks: number = 0;
    public isEditing: boolean = false;
    public isFueling: boolean = false;
    public hasStartedFueling: boolean = false;
    public isLaunching: boolean = false;

    public currBoosterEvent: number = 0;
    public isBoosterEventEnabled: boolean = false;
    public isBoosterEventClicked: boolean = false;

    public currShipEvent: number = 0;
    public isShipEventEnabled: boolean = false;
    public isShipEventClicked: boolean = false;

    public canLiftOff: boolean = false;
    public liftedOff: boolean = false;
    public separated: boolean = false;
    public justSeparated: boolean = false;

    public previousSSPos: Vector3 = new Vector3(0, 0, 0);
    public previousSHPos: Vector3 = new Vector3(0, 0, 0);

    public starshipDisabled: boolean = true;
    public superHeavyDisabled: boolean = false;

    public starshipRPs: RaptorParticle[] = [];
    public superHeavyRPs: RaptorParticle[] = [];
    public delugeP: DelugeParticle = null;
    public hotStageP: HotStageParticle = null;
    public starshipREP: ReentryParticle = null;
    public superHeavyREP: ReentryParticle = null;
    
    public starshipEP: ExplosionParticle = null;
    public superHeavyEP: ExplosionParticle = null;
    public starshipEPCooldown: number = -1;
    public superHeavyEPCooldown: number = -1;
    public starshipLandedSafe: boolean = false;
    public superHeavyLandedSafe: boolean = false;

    public OLITArrow: ArrowHelper = new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), LaunchConstants.OLIT_ARROW_LENGTH, LaunchConstants.OLIT_ARROW_COLOR);
    public superHeavyLandingArrow: ArrowHelper = new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), LaunchConstants.SUPER_HEAVY_LANDING_ARROW_LENGTH, LaunchConstants.SUPER_HEAVY_LANDING_ARROW_COLOR);
    public starshipLandingArrow: ArrowHelper = new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), LaunchConstants.STARSHIP_LANDING_ARROW_LENGTH, LaunchConstants.STARSHIP_LANDING_ARROW_COLOR);
    public starshipVelArrow: ArrowHelper = new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), LaunchConstants.VEL_ARROW_LENGTH, LaunchConstants.VEL_ARROW_COLOR);
    public superHeavyVelArrow: ArrowHelper = new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), LaunchConstants.VEL_ARROW_LENGTH, LaunchConstants.VEL_ARROW_COLOR);

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
            this.isBoosterEventClicked = value.isBoosterEventClicked;
            this.isShipEventClicked = value.isShipEventClicked;
            if (this.isBoosterEventClicked || this.isShipEventClicked) {
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
                    let ssCH4Volume: number = MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, this.starship.options.shipRingHeight * StarshipConstants.CH4_PERCENTAGE);   
                    let ssLOXVolume: number = MathHelper.getVolumeofCylinder(StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, this.starship.options.shipRingHeight * StarshipConstants.LOX_PERCENTAGE);
                
                    let shCH4Volume: number = MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, this.superHeavy.options.boosterRingHeight * SuperHeavyConstants.CH4_PERCENTAGE);
                    let shLOXVolume: number = MathHelper.getVolumeofCylinder(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, this.superHeavy.options.boosterRingHeight * SuperHeavyConstants.LOX_PERCENTAGE);

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
                    this.stackGroup.position.copy(this.OLIT.group.position.clone().add(this.OLIT.olm.position.clone().add(new Vector3(0, this.OLIT.olm.userData.aabb.getSize(new Vector3).y - OLITConstants.OLM_RING_HEIGHT * OLITConstants.OLM_SCALE.y * OLITConstants.OLIT_SCALE.y, 0))).applyEuler(this.OLIT.group.rotation));
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
                    if (this.starshipRPs.length == 0 && this.superHeavyRPs.length == 0) {
                        this.createPs();
                    }
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

                        this.tc.scene.add(this.OLITArrow);
                        this.tc.scene.add(this.superHeavyLandingArrow);
                        this.tc.scene.add(this.starshipLandingArrow);
                        this.superHeavyLandingArrow.visible = false;
                        this.starshipLandingArrow.visible = false;
                        this.tc.scene.add(this.starshipVelArrow);
                        this.tc.scene.add(this.superHeavyVelArrow);

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

                        this.starship.flightController = new FlightController(PRTransients.realPositions.starshipPosition.clone(), this.stackGroup.userData.flightController.initialVelocity.clone().divideScalar(CelestialConstants.REAL_SCALE), new Euler().setFromQuaternion(this.stackGroup.userData.flightController.initialRotation.clone()));
                        this.superHeavy.flightController = new FlightController(PRTransients.realPositions.superHeavyPosition.clone(), this.stackGroup.userData.flightController.initialVelocity.clone().divideScalar(CelestialConstants.REAL_SCALE), new Euler().setFromQuaternion(this.stackGroup.userData.flightController.initialRotation.clone()));

                        this.starship.flightController.setInitials(this.starship.getCOM(), this.stackGroup.userData.flightController.velocity.clone().divideScalar(CelestialConstants.REAL_SCALE), this.stackGroup.userData.flightController.rotation.clone(), this.stackGroup.userData.flightController.relRotation.clone(), this.stackGroup.userData.flightController.fakeRotation.clone(), this.stackGroup.userData.flightController.angularVelocity.clone());
                        this.superHeavy.flightController.setInitials(this.superHeavy.getCOM(), this.stackGroup.userData.flightController.velocity.clone().divideScalar(CelestialConstants.REAL_SCALE), this.stackGroup.userData.flightController.rotation.clone(), this.stackGroup.userData.flightController.relRotation.clone(), this.stackGroup.userData.flightController.fakeRotation.clone(), this.stackGroup.userData.flightController.angularVelocity.clone().add(LaunchConstants.SEPARATION_ANG_VEL.clone()));

                        this.superHeavy.flightController.acceleration.sub(this.starship.getThrustVector(this.stackGroup.userData.flightController.getAltitude()).applyQuaternion(this.starship.flightController.rotation).divideScalar(this.superHeavy.getMass()));
                        this.superHeavy.startSepGridFinSequence = false;

                        this.justSeparated = false;
                    }
                    if (this.dt >= LaunchConstants.STARTUP_DT && this.dt < LaunchConstants.MECO_DT && !this.superHeavy.startStartupSequence) {
                        this.superHeavy.startStartupSequence = true;
                    }

                    if (this.liftedOff) {
                        this.handleEventEnable();
                        if (!this.separated) {
                            let altitude: number = this.stackGroup.userData.flightController.getAltitude();

                            if ((this.superHeavy.options.hsrHeight > SuperHeavyConstants.MIN_HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y && this.starship.endStartupSequence) || (this.superHeavy.options.hsrHeight <= SuperHeavyConstants.MIN_HSR_HEIGHT * LaunchConstants.REAL_LIFE_SCALE.y && this.superHeavy.endMECOSequence)) {
                                this.separated = true;
                                this.justSeparated = true;
                            }

                            if (altitude <= 0) {
                                this.starshipDisabled = true;
                                this.superHeavyDisabled = true;

                                let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(this.stackGroup.userData.flightController.rotation);
                                let dot: number = orientation.dot(this.stackGroup.userData.flightController.position.clone().normalize());
                                if (dot > 1 - LaunchConstants.LANDING_DOT_PRODUCT_ACCEPT && this.stackGroup.userData.flightController.relVelocity.length() < LaunchConstants.LANDING_VELOCITY_ACCEPT) {
                                    this.starshipLandedSafe = true;
                                    this.superHeavyLandedSafe = true;
                                }
                                else {
                                    this.starshipLandedSafe = false;
                                    this.superHeavyLandedSafe = false;
                                }

                                this.stackGroup.userData.flightController.reset();
                            }
                            else {
                                // thrust

                                this.stackGroup.userData.flightController.acceleration = new Vector3(0, 0, 0);

                                this.stackGroup.userData.flightController.acceleration.add(this.superHeavy.getThrustVector(altitude).clone().divideScalar((this.superHeavy.getMass() + this.starship.getMass())).applyQuaternion(this.stackGroup.userData.flightController.rotation));

                                // torque
                                this.stackGroup.userData.flightController.angularAcceleration = new Vector3(0, 0, 0);
                                // gimbal
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getThrustTorque(this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitchYaw()));

                                // grid fins
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getGridFinPitchYawTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitchYaw()));
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getGridFinRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.getStackMOIRoll()));
                                // drag sh
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getDragPitchYawTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.stackGroup.userData.flightController.angularVelocity, this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitchYaw()));
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.superHeavy.getDragRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.stackGroup.userData.flightController.angularVelocity, altitude).divideScalar(this.getStackMOIRoll()));
                                this.stackGroup.userData.flightController.acceleration.add(this.superHeavy.getDragVector(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.superHeavy.getMass()));

                                // flaps
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.starship.getFlapPitchTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.getStackMOIPitchYaw()));
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.starship.getFlapRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.getStackMOIRoll()));
                                // drag ss
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.starship.getDragPitchYawTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.stackGroup.userData.flightController.angularVelocity, this.getStackCOM(), altitude).divideScalar(this.getStackMOIPitchYaw()));
                                this.stackGroup.userData.flightController.angularAcceleration.add(this.starship.getDragRollTorque(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, this.stackGroup.userData.flightController.angularVelocity, altitude).divideScalar(this.getStackMOIRoll()));
                                this.stackGroup.userData.flightController.acceleration.add(this.starship.getDragVector(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, altitude).divideScalar(this.superHeavy.getMass()));

                                // gravity

                                this.stackGroup.userData.flightController.acceleration.add(this.stackGroup.userData.flightController.position.clone().normalize().multiplyScalar(-LaunchHelper.getGEarth(altitude)));

                                // update flight controller

                                this.stackGroup.userData.flightController.update(delta, this.getStackCOM());
                            }

                            // update real positions and rotations
                            PRTransients.realPositions.stackGroupPosition = this.stackGroup.userData.flightController.fakePosition.clone().divideScalar(CelestialConstants.REAL_SCALE);

                            PRTransients.realRotations.stackGroupRotation = new Euler().setFromQuaternion(this.stackGroup.userData.flightController.rotation);

                            PRTransients.realPositions.superHeavyVelPosition = this.stackGroup.userData.flightController.fakePosition.clone().add(this.getStackCOM().clone().applyQuaternion(this.stackGroup.userData.flightController.rotation)).divideScalar(CelestialConstants.REAL_SCALE);
                            PRTransients.realPositions.superHeavyVelDirection = this.stackGroup.userData.flightController.relVelocity.clone().normalize();
                            PRTransients.realPositions.starshipVelPosition = this.stackGroup.userData.flightController.fakePosition.clone().add(this.getStackCOM().clone().applyQuaternion(this.stackGroup.userData.flightController.rotation)).divideScalar(CelestialConstants.REAL_SCALE);
                            PRTransients.realPositions.starshipVelDirection = this.stackGroup.userData.flightController.relVelocity.clone().normalize();

                            telemetry.update((value) => {
                                value.separated = this.separated;

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
                            if (shAltitude <= 0) {
                                this.superHeavyDisabled = true;

                                let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(this.superHeavy.flightController.rotation);
                                let dot: number = orientation.dot(this.superHeavy.flightController.position.clone().normalize());
                                if (dot > 1 - LaunchConstants.LANDING_DOT_PRODUCT_ACCEPT && this.superHeavy.flightController.relVelocity.length() < LaunchConstants.LANDING_VELOCITY_ACCEPT) {
                                    this.superHeavyLandedSafe = true;
                                }
                                else {
                                    this.superHeavyLandedSafe = false;
                                }

                                this.superHeavy.flightController.reset();
                            }
                            else {
                                // thrust

                                this.superHeavy.flightController.acceleration = new Vector3(0, 0, 0);
    
                                this.superHeavy.flightController.acceleration.add(this.superHeavy.getThrustVector(shAltitude).clone().divideScalar(this.superHeavy.getMass()).applyQuaternion(this.superHeavy.flightController.rotation));
    
                                // torque
                                this.superHeavy.flightController.angularAcceleration = new Vector3(0, 0, 0);
                                // gimbal
                                if (!this.superHeavy.startLandingSequence) {
                                    this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getThrustTorque(this.getStackCOM(), shAltitude).divideScalar(this.superHeavy.getMOIPitchYaw()));
                                }
                                
                                // grid fins
                                this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getGridFinPitchYawTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, this.superHeavy.getCOM(), shAltitude).divideScalar(this.superHeavy.getMOIPitchYaw()));
                                this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getGridFinRollTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, shAltitude).divideScalar(this.superHeavy.getMOIRoll()));
                                // drag sh
                                this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getDragPitchYawTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, this.superHeavy.flightController.angularVelocity, this.superHeavy.getCOM(), shAltitude).divideScalar(this.superHeavy.getMOIPitchYaw()));
                                this.superHeavy.flightController.angularAcceleration.add(this.superHeavy.getDragRollTorque(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, this.superHeavy.flightController.angularVelocity, shAltitude).divideScalar(this.superHeavy.getMOIRoll()));
                                this.superHeavy.flightController.acceleration.add(this.superHeavy.getDragVector(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, shAltitude).divideScalar(this.superHeavy.getMass()));
    
                                // gravity
    
                                this.superHeavy.flightController.acceleration.add(this.superHeavy.flightController.position.clone().normalize().multiplyScalar(-LaunchHelper.getGEarth(shAltitude)));

                                // update flight controller

                                this.superHeavy.flightController.update(delta, this.superHeavy.getCOM());
                            }
                            if (ssAltitude <= 0) {
                                this.starshipDisabled = true;

                                let orientation: Vector3 = new Vector3(0, 1, 0).applyQuaternion(this.starship.flightController.rotation);
                                let dot: number = orientation.dot(this.starship.flightController.position.clone().normalize());
                                if (dot > 1 - LaunchConstants.LANDING_DOT_PRODUCT_ACCEPT && this.starship.flightController.relVelocity.length() < LaunchConstants.LANDING_VELOCITY_ACCEPT) {
                                    this.starshipLandedSafe = true;
                                }
                                else {
                                    this.starshipLandedSafe = false;
                                }

                                this.starship.flightController.reset();
                            }
                            else {
                                // thrust

                                this.starship.flightController.acceleration = new Vector3(0, 0, 0);

                                this.starship.flightController.acceleration.add(this.starship.getThrustVector(ssAltitude).clone().divideScalar(this.starship.getMass()).applyQuaternion(this.starship.flightController.rotation));

                                // torque
                                this.starship.flightController.angularAcceleration = new Vector3(0, 0, 0);
                                // gimbal
                                if (!this.starship.startLandingSequence) {
                                    this.starship.flightController.angularAcceleration.add(this.starship.getThrustTorque(this.starship.getCOM(), ssAltitude).divideScalar(this.starship.getMOIPitchYaw()));
                                }

                                // flaps
                                this.starship.flightController.angularAcceleration.add(this.starship.getFlapPitchTorque(this.starship.flightController.rotation, this.starship.flightController.relVelocity, ssAltitude).divideScalar(this.starship.getMOIPitchYaw()));
                                this.starship.flightController.angularAcceleration.add(this.starship.getFlapRollTorque(this.starship.flightController.rotation, this.starship.flightController.relVelocity, ssAltitude).divideScalar(this.starship.getMOIRoll()));
                                // drag ss
                                this.starship.flightController.angularAcceleration.add(this.starship.getDragPitchYawTorque(this.starship.flightController.rotation, this.starship.flightController.relVelocity, this.starship.flightController.angularVelocity, this.starship.getCOM(), ssAltitude).divideScalar(this.starship.getMOIPitchYaw()));
                                this.starship.flightController.angularAcceleration.add(this.starship.getDragRollTorque(this.starship.flightController.rotation, this.starship.flightController.relVelocity, this.starship.flightController.angularVelocity, ssAltitude).divideScalar(this.starship.getMOIRoll()));
                                this.starship.flightController.acceleration.add(this.starship.getDragVector(this.starship.flightController.rotation, this.starship.flightController.relVelocity, ssAltitude).divideScalar(this.starship.getMass()));

                                // gravity

                                this.starship.flightController.acceleration.add(this.starship.flightController.position.clone().normalize().multiplyScalar(-LaunchHelper.getGEarth(ssAltitude)));

                                // update flight controller
                                
                                this.starship.flightController.update(delta, this.starship.getCOM());
                            }

                            // update real positions and rotations
                            PRTransients.realPositions.superHeavyPosition = this.superHeavy.flightController.fakePosition.clone().divideScalar(CelestialConstants.REAL_SCALE);
                            PRTransients.realPositions.starshipPosition = this.starship.flightController.fakePosition.clone().divideScalar(CelestialConstants.REAL_SCALE);

                            PRTransients.realRotations.superHeavyRotation = new Euler().setFromQuaternion(this.superHeavy.flightController.rotation);
                            PRTransients.realRotations.starshipRotation = new Euler().setFromQuaternion(this.starship.flightController.rotation);

                            PRTransients.realPositions.superHeavyVelPosition = this.superHeavy.flightController.fakePosition.clone().add(this.superHeavy.getCOM().clone().applyQuaternion(this.superHeavy.flightController.rotation)).divideScalar(CelestialConstants.REAL_SCALE);
                            PRTransients.realPositions.superHeavyVelDirection = this.superHeavy.flightController.relVelocity.clone().normalize();
                            PRTransients.realPositions.starshipVelPosition = this.starship.flightController.fakePosition.clone().add(this.starship.getCOM().clone().applyQuaternion(this.starship.flightController.rotation)).divideScalar(CelestialConstants.REAL_SCALE);
                            PRTransients.realPositions.starshipVelDirection = this.starship.flightController.relVelocity.clone().normalize();

                            if (this.superHeavy.startLandingSequence) {
                                PRTransients.realPositions.superHeavyLandingArrowPosition = this.superHeavy.landingPosition.clone().divideScalar(CelestialConstants.REAL_SCALE);
                                PRTransients.realPositions.superHeavyLandingArrowDirection = this.superHeavy.landingPosition.clone().normalize();
                            }

                            if (this.starship.startLandingSequence) {
                                PRTransients.realPositions.starshipLandingArrowPosition = this.starship.landingPosition.clone().divideScalar(CelestialConstants.REAL_SCALE);
                                PRTransients.realPositions.starshipLandingArrowDirection = this.starship.landingPosition.clone().normalize();
                            }

                            telemetry.update((value) => {
                                value.separated = this.separated;

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
                        if (this.dt >= LaunchConstants.PAD_DT) {
                            this.canLiftOff = false;
                            this.OLIT.startQDSwing = false;
                            this.superHeavy.runForceShutdown();
                            this.starship.runForceShutdown();
                            telemetry.update((value) => {
                                value.currBoosterEvent = LaunchConstants.BOOSTER_LAUNCH_EVENTS.length;
                                value.currShipEvent = LaunchConstants.SHIP_LAUNCH_EVENTS.length;
                                value.superHeavyDisabled = true;
                                value.starshipDisabled = true;
                                return value;
                            });
                        }
                        else {
                            let altitude: number = LaunchHelper.getAltitude(this.group.position.clone().add(this.stackGroup.position.clone().add(this.superHeavy.group.position)));
                            if (this.superHeavy.getThrustVector(altitude).y - this.getStackWeight(altitude) > 0) {
                                this.canLiftOff = true;
                                this.OLIT.startQDSwing = true;
                            }
                        }
                    }
                    this.updatePs(delta);
                }
            }
            if (!this.hasSetInitialPosition) {
                let rotation: Euler = new Euler(153.875 * Math.PI / 180, 96.65 * Math.PI / 180, 0);
                PRTransients.realPositions.groupPosition = new Vector3(1, 0, 0).applyEuler(rotation).multiplyScalar(CelestialConstants.EARTH_EFFECTIVE_RADIUS);
                this.hasSetInitialPosition = true;
            }
            PRTransients.realPositions.groupPosition.applyEuler(new Euler(0, CelestialConstants.EARTH_ROTATION_SPEED * delta, 0)); // this is normal
            PRTransients.realRotations.groupRotation.copy(new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), PRTransients.realPositions.groupPosition.clone().normalize()).multiply(new Quaternion().setFromEuler(this.earthRot)).multiply(new Quaternion().setFromEuler(LaunchConstants.ROTATION_GROUP))));
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
        let rot: Quaternion = MathHelper.getAngleBetweenVectors(PRTransients.realPositions.orbitControlsPosition.clone().sub(this.targetPos).normalize(), new Vector3(0, 1, 0));
        for (let key of Object.keys(PRTransients.realPositions)) {
            if (key !== "sunPosition" && !key.includes("Direction")) {
                PRTransients.fakePositions[key].copy(this.targetPos.clone().add(PRTransients.realPositions[key].clone().sub(this.targetPos).sub(PRTransients.realPositions.orbitControlsPosition.clone()).applyQuaternion(rot)));
            }
            else {
                PRTransients.fakePositions[key].copy(this.targetPos.clone().add(PRTransients.realPositions[key].clone().sub(this.targetPos).applyQuaternion(rot)));
            }
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
                this.updateView();
        }
    }

    public updateObjects(): void {
        if (this.group != null && this.starship.group != null && this.superHeavy.group != null && this.OLIT.group != null) {
            if (this.starship.hasUpdatedAABB && this.superHeavy.hasUpdatedAABB && this.OLIT.hasUpdatedAABB) {    
                this.group.position.copy(PRTransients.fakePositions.groupPosition);
                this.group.rotation.copy(PRTransients.fakeRotations.groupRotation);
                if (this.liftedOff) {
                    if (this.separated && !this.justSeparated) {
                        this.starship.group.position.copy(PRTransients.fakePositions.starshipPosition);
                        this.starship.group.rotation.copy(PRTransients.fakeRotations.starshipRotation);
                        this.superHeavy.group.position.copy(PRTransients.fakePositions.superHeavyPosition);
                        this.superHeavy.group.rotation.copy(PRTransients.fakeRotations.superHeavyRotation);

                        if (this.starship.startLandingSequence) {
                            this.starshipLandingArrow.visible = true;
                            this.starshipLandingArrow.position.copy(PRTransients.fakePositions.starshipLandingArrowPosition);
                            this.starshipLandingArrow.setDirection(PRTransients.fakePositions.starshipLandingArrowDirection);
                        }
                        else {
                            this.starshipLandingArrow.visible = false;
                        }
                        if (this.superHeavy.startLandingSequence) {
                            this.superHeavyLandingArrow.visible = true;
                            this.superHeavyLandingArrow.position.copy(PRTransients.fakePositions.superHeavyLandingArrowPosition);
                            this.superHeavyLandingArrow.setDirection(PRTransients.fakePositions.superHeavyLandingArrowDirection);
                        }
                        else {
                            this.superHeavyLandingArrow.visible = false;
                        }
                    }
                    else {
                        this.stackGroup.position.copy(PRTransients.fakePositions.stackGroupPosition);
                        this.stackGroup.rotation.copy(PRTransients.fakeRotations.stackGroupRotation);
                    }

                    this.starshipVelArrow.position.copy(PRTransients.fakePositions.starshipVelPosition);
                    this.superHeavyVelArrow.position.copy(PRTransients.fakePositions.superHeavyVelPosition);
                    this.starshipVelArrow.setDirection(PRTransients.fakePositions.starshipVelDirection);
                    this.superHeavyVelArrow.setDirection(PRTransients.fakePositions.superHeavyVelDirection);

                    this.OLITArrow.position.copy(PRTransients.fakePositions.groupPosition.clone().add(this.OLIT.olm.position.clone().applyEuler(PRTransients.fakeRotations.groupRotation)));
                    this.OLITArrow.setDirection(new Vector3(0, 1, 0));
                }
            }
        }
    }

    public updateCamera(): void {
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
            this.updateObjects();
            this.updateCamera();
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
        COM.add(this.starship.getCOM().clone().add(new Vector3(0, this.superHeavy.group.userData.aabb.getSize(new Vector3).y / LaunchConstants.REAL_LIFE_SCALE.y, 0)).multiplyScalar(this.starship.getMass()));
        return COM.divideScalar(this.getStackMass());
    }

    public getStackMOIRoll(): number {
        return 1/2 * this.getStackMass() * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, 2); // the ring scale is the same anyway
    }

    public getStackMOIPitchYaw(): number {
        return 1/4 * this.getStackMass() * Math.pow(SuperHeavyConstants.BOOSTER_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x + StarshipConstants.SHIP_RING_SCALE.x * LaunchConstants.REAL_LIFE_SCALE.x, 2) + 1/12 * this.getStackMass() * Math.pow(this.superHeavy.options.boosterRingHeight * LaunchConstants.REAL_LIFE_SCALE.y + this.starship.options.shipRingHeight * LaunchConstants.REAL_LIFE_SCALE.y, 2);
    }

    public handleEventEnable(): void {
        if (this.dt >= LaunchConstants.MECO_DT) {
            this.isBoosterEventEnabled = true;
        }
        if ((this.currBoosterEvent == 1 && this.superHeavy.endMECOSequence) || this.currBoosterEvent > 1) {
            this.isShipEventEnabled = true;
        }

        let shAltitude: number = this.stackGroup.userData.flightController.getAltitude();
        let ssAltitude: number = this.stackGroup.userData.flightController.getAltitude();
        if (this.separated && !this.justSeparated) {
            shAltitude = this.superHeavy.flightController.getAltitude();
            ssAltitude = this.starship.flightController.getAltitude();
        }
        if (this.superHeavy.LOX <= 0 || this.superHeavy.CH4 <= 0 || shAltitude <= 0) {
            this.superHeavy.startStartupSequence = false;
            this.superHeavy.startMECOSequence = false;
            this.superHeavy.startBoostbackSequence = false;
            this.superHeavy.startBoostbackShutdownSequence = false;
            this.superHeavy.startLandingSequence = false;
            
            this.superHeavy.endMECOSequence = true;
            this.superHeavy.endBoostbackSequence = true;
            this.superHeavy.endBoostbackShutdownSequence = true;
            this.superHeavy.endLandingSequence = true;

            this.superHeavy.runForceShutdown();
            this.currBoosterEvent = LaunchConstants.BOOSTER_LAUNCH_EVENTS.length; // hide
        }

        if (this.starship.LOX <= 0 || this.starship.CH4 <= 0 || ssAltitude <= 0) {
            this.starship.startStartupSequence = false;
            this.starship.startSECOSequence = false;
            this.starship.startLandingSequence = false;

            this.starship.endStartupSequence = true;
            this.starship.endSECOSequence = true;
            this.starship.endLandingSequence = true;

            this.starship.runForceShutdown();
            this.currShipEvent = LaunchConstants.SHIP_LAUNCH_EVENTS.length; // hide
        }

        if (
            (this.currBoosterEvent == 1 && (!this.separated || this.justSeparated)) ||
            (this.currBoosterEvent == 2 && this.superHeavy.startBoostbackSequence && !this.superHeavy.endBoostbackSequence) ||
            (this.currBoosterEvent == 3 && this.superHeavy.startBoostbackShutdownSequence && !this.superHeavy.endBoostbackShutdownSequence)
        ) {
            this.isBoosterEventEnabled = false;
        }

        if (
            this.currShipEvent == 1 && this.starship.startStartupSequence && !this.starship.endStartupSequence ||
            this.currShipEvent == 2 && this.starship.startSECOSequence && !this.starship.endSECOSequence
        ) {
            this.isShipEventEnabled = false;
        }
        
        telemetry.update((value) => {
            value.currBoosterEvent = this.currBoosterEvent;
            value.isBoosterEventEnabled = this.isBoosterEventEnabled;
            value.isBoosterEventClicked = this.isBoosterEventClicked;

            value.currShipEvent = this.currShipEvent;
            value.isShipEventEnabled = this.isShipEventEnabled;
            value.isShipEventClicked = this.isShipEventClicked;
            return value;
        });
    }

    public handleEventClick(): void {
        if (this.isBoosterEventClicked && this.isBoosterEventEnabled) {
            this.isBoosterEventClicked = false;
            this.isBoosterEventEnabled = false;
            if (this.currBoosterEvent == 0) {
                this.superHeavy.startMECOSequence = true;
            }
            else if (this.currBoosterEvent == 1) {
                this.superHeavy.startBoostbackSequence = true;
            }
            else if (this.currBoosterEvent == 2) {
                this.superHeavy.startBoostbackShutdownSequence = true;
            }
            else if (this.currBoosterEvent == 3) {
                this.superHeavy.startLandingSequence = true;
            }
            this.currBoosterEvent++;
        }
        if (this.isShipEventClicked && this.isShipEventEnabled) {
            this.isShipEventClicked = false;
            this.isShipEventEnabled = false;
            if (this.currShipEvent == 0) {
                this.starship.startStartupSequence = true;
            }
            else if (this.currShipEvent == 1) {
                this.starship.startSECOSequence = true;
            }
            else if (this.currShipEvent == 2) {
                this.starship.startLandingSequence = true;
            }
            this.currShipEvent++;
        }
        
        telemetry.update((value) => {
            value.currBoosterEvent = this.currBoosterEvent;
            value.isBoosterEventEnabled = this.isBoosterEventEnabled;
            value.isBoosterEventClicked = this.isBoosterEventClicked;

            value.currShipEvent = this.currShipEvent;
            value.isShipEventEnabled = this.isShipEventEnabled;
            value.isShipEventClicked = this.isShipEventClicked;
            return value;
        });
    }

    public createPs(): void {
        for (let i = 0; i < this.superHeavy.rSeas.length; i++) {
            let rp: RaptorParticle = new RaptorParticle(this.tc);
            this.superHeavyRPs.push(rp);
        }
        for (let i = 0; i < this.starship.rSeas.length; i++) {
            let rp: RaptorParticle = new RaptorParticle(this.tc);
            this.starshipRPs.push(rp);
        }
        for (let i = 0; i < this.starship.rVacs.length; i++) {
            let rp: RaptorParticle = new RaptorParticle(this.tc);
            this.starshipRPs.push(rp);
        }
        this.delugeP = new DelugeParticle(this.tc);
        this.hotStageP = new HotStageParticle(this.tc);
        this.starshipREP = new ReentryParticle(this.tc);
        this.superHeavyREP = new ReentryParticle(this.tc);
        this.starshipEP = new ExplosionParticle(this.tc);
        this.superHeavyEP = new ExplosionParticle(this.tc);
    }

    public updatePs(delta: number): void {
        if (this.dt >= LaunchConstants.STARTUP_DT) {
            let ssAltitude = 0;
            let shAltitude = 0;
            if (this.stackGroup != null && this.stackGroup.userData.flightController != null) {
                if (this.separated && !this.justSeparated) {
                    ssAltitude = this.starship.flightController.getAltitude();
                    shAltitude = this.superHeavy.flightController.getAltitude();
                }
                else {
                    ssAltitude = this.stackGroup.userData.flightController.getAltitude();
                    shAltitude = this.stackGroup.userData.flightController.getAltitude();
                }
            }
            for (let i = 0; i < this.superHeavy.rSeas.length; i++) {
                let rSea: Object3D = this.superHeavy.rSeas[i];
                let rSeaObj: Object3D = this.superHeavy.rSeaObjs[i];
                let rp: RaptorParticle = this.superHeavyRPs[i];
                if (rSea != null && rSeaObj != null && rp != null) {
                    let position: Vector3 = rSeaObj.getWorldPosition(new Vector3());
                    let rotation: Quaternion = rSeaObj.getWorldQuaternion(new Quaternion());
                    rp.update(position, rotation, rSea.userData.raptor.throttle, shAltitude);
                }
            }
            for (let i = 0; i < this.starship.rSeas.length; i++) {
                let rSea: Object3D = this.starship.rSeas[i];
                let rSeaObj: Object3D = this.starship.rSeaObjs[i];
                let rp: RaptorParticle = this.starshipRPs[i];
                if (rSea != null && rSeaObj != null && rp != null) {
                    let position: Vector3 = rSeaObj.getWorldPosition(new Vector3());
                    let rotation: Quaternion = rSeaObj.getWorldQuaternion(new Quaternion());
                    rp.update(position, rotation, rSea.userData.raptor.throttle, ssAltitude);
                }
            }
            for (let i = 0; i < this.starship.rVacs.length; i++) {
                let rVac: Object3D = this.starship.rVacs[i];
                let rVacObj: Object3D = this.starship.rVacObjs[i];
                let rp: RaptorParticle = this.starshipRPs[i + this.starship.rSeas.length];
                if (rVac != null && rVacObj != null && rp != null) {
                    let position: Vector3 = rVacObj.getWorldPosition(new Vector3());
                    let rotation: Quaternion = rVacObj.getWorldQuaternion(new Quaternion());
                    rp.update(position, rotation, rVac.userData.raptor.throttle * ParticleConstants.RAPTOR_RADIUS_SEA_TO_VAC, ssAltitude);
                }
            }
        }
        if (this.dt >= LaunchConstants.DELUGE_START_DT) {
            this.delugeP.update(this.OLIT.olm.getWorldPosition(new Vector3()), this.OLIT.olm.getWorldQuaternion(new Quaternion()), (this.liftedOff && this.dt >= LaunchConstants.DELUGE_STOP_DT) || (!this.liftedOff && this.dt >= LaunchConstants.PAD_DT) ? 0 : 1);
        }

        if (this.liftedOff) {
            if (this.starship.startStartupSequence && !this.separated) {
                this.hotStageP.update(this.superHeavy.hsr.getWorldPosition(new Vector3()), this.superHeavy.hsr.getWorldQuaternion(new Quaternion()), 1);            
            }
            else {
                this.hotStageP.update(this.superHeavy.hsr.getWorldPosition(new Vector3()), this.superHeavy.hsr.getWorldQuaternion(new Quaternion()), 0);
            }
    
            let ssCenter = this.starship.group.getWorldPosition(new Vector3).add(this.starship.group.userData.aabb.getCenter(new Vector3).clone().applyQuaternion(this.starship.group.getWorldQuaternion(new Quaternion)));
            let shCenter = this.superHeavy.group.getWorldPosition(new Vector3).add(this.superHeavy.group.userData.aabb.getCenter(new Vector3).clone().applyQuaternion(this.superHeavy.group.getWorldQuaternion(new Quaternion)));
            let ssDrag: number = 0;
            let shDrag: number = 0;
            let ssAltitude: number = this.starship.flightController.getAltitude();
            let shAltitude: number = this.superHeavy.flightController.getAltitude();
            let stackAltitude: number = this.stackGroup.userData.flightController.getAltitude();
            if (this.separated && !this.justSeparated && this.starship.flightController != null && this.superHeavy.flightController != null) {
                ssDrag = this.starship.getDragVector(this.starship.flightController.rotation, this.starship.flightController.relVelocity, ssAltitude).divideScalar(this.starship.getMass()).length();
                shDrag = this.superHeavy.getDragVector(this.superHeavy.flightController.rotation, this.superHeavy.flightController.relVelocity, shAltitude).divideScalar(this.superHeavy.getMass()).length();
                ssDrag *= this.starship.flightController.relVelocity.length();
                shDrag *= this.superHeavy.flightController.relVelocity.length();
                
                if (ssDrag >= ParticleConstants.REENTRY_THRESHOLD && ParticleConstants.REENTRY_MIN_ALTITUDE <= ssAltitude && ssAltitude <= ParticleConstants.REENTRY_MAX_ALTITUDE) {
                    this.starshipREP.update(ssCenter, this.starshipVelArrow.quaternion, 1);
                }
                else {
                    this.starshipREP.update(ssCenter, this.starshipVelArrow.quaternion, 0);
                }
                if (shDrag >= ParticleConstants.REENTRY_THRESHOLD && ParticleConstants.REENTRY_MIN_ALTITUDE <= shAltitude && shAltitude <= ParticleConstants.REENTRY_MAX_ALTITUDE) {
                    this.superHeavyREP.update(shCenter, this.superHeavyVelArrow.quaternion, 1);
                }
                else {
                    this.superHeavyREP.update(shCenter, this.superHeavyVelArrow.quaternion, 0);
                }
            }
            else if (this.stackGroup != null && this.stackGroup.userData.flightController != null) {
                ssDrag = this.starship.getDragVector(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, stackAltitude).divideScalar(this.starship.getMass()).length();
                shDrag = this.superHeavy.getDragVector(this.stackGroup.userData.flightController.rotation, this.stackGroup.userData.flightController.relVelocity, stackAltitude).divideScalar(this.superHeavy.getMass()).length();
                ssDrag *= this.stackGroup.userData.flightController.relVelocity.length();
                shDrag *= this.stackGroup.userData.flightController.relVelocity.length();
                
                if (ssDrag >= ParticleConstants.REENTRY_THRESHOLD && ParticleConstants.REENTRY_MIN_ALTITUDE <= stackAltitude && stackAltitude <= ParticleConstants.REENTRY_MAX_ALTITUDE) {
                    this.starshipREP.update(ssCenter, this.starshipVelArrow.quaternion, 1);
                }
                else {
                    this.starshipREP.update(ssCenter, this.starshipVelArrow.quaternion, 0);
                }
                if (shDrag >= ParticleConstants.REENTRY_THRESHOLD && ParticleConstants.REENTRY_MIN_ALTITUDE <= stackAltitude && stackAltitude <= ParticleConstants.REENTRY_MAX_ALTITUDE) {
                    this.superHeavyREP.update(shCenter, this.superHeavyVelArrow.quaternion, 1);
                }
                else {
                    this.superHeavyREP.update(shCenter, this.superHeavyVelArrow.quaternion, 0);
                }
            }

            if (this.separated && !this.justSeparated) {
                if (this.starship.flightController != null && this.starship.flightController.getAltitude() <= 0 && !this.starshipLandedSafe && this.starshipEPCooldown == -1) {
                    this.starshipEPCooldown = ParticleConstants.EXPLOSION_DURATION;
                }
                if (this.superHeavy.flightController != null && this.superHeavy.flightController.getAltitude() <= 0 && !this.superHeavyLandedSafe && this.superHeavyEPCooldown == -1) {
                    this.superHeavyEPCooldown = ParticleConstants.EXPLOSION_DURATION;
                }
            }
            else {
                if (this.stackGroup.userData.flightController != null && this.stackGroup.userData.flightController.getAltitude() <= 0 && !this.starshipLandedSafe && !this.superHeavyLandedSafe) {
                    this.starshipEPCooldown = ParticleConstants.EXPLOSION_DURATION;
                    this.superHeavyEPCooldown = ParticleConstants.EXPLOSION_DURATION;
                }
            }
            if (this.starshipEPCooldown > 0) {
                this.starshipEPCooldown -= delta;
                this.starshipEP.update(ssCenter, this.starship.group.getWorldQuaternion(new Quaternion()), 1);
            }
            else if (this.starshipEPCooldown != -1) {
                this.starshipEP.update(ssCenter, this.starship.group.getWorldQuaternion(new Quaternion()), 0);
            }
            if (this.superHeavyEPCooldown > 0) {
                this.superHeavyEPCooldown -= delta;
                this.superHeavyEP.update(shCenter, this.superHeavy.group.getWorldQuaternion(new Quaternion()), 1);
            }
            else if (this.superHeavyEPCooldown != -1) {
                this.superHeavyEP.update(shCenter, this.superHeavy.group.getWorldQuaternion(new Quaternion()), 0);
            }
        }
    }
}