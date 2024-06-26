import { Euler, Quaternion, Vector3 } from "three";
import { CelestialConstants } from "../constants/CelestialConstants";
import { PhysicsConstants } from "../constants/PhysicsConstants";

export class FlightController {
    public initialPosition: Vector3 = new Vector3(0, 0, 0);
    public position: Vector3 = new Vector3(0, 0, 0);
    public relPosition: Vector3 = new Vector3(0, 0, 0);
    public fakePosition: Vector3 = new Vector3();

    public initialVelocity: Vector3 = new Vector3(0, 0, 0);
    public velocity: Vector3 = new Vector3(0, 0, 0);
    public relVelocity: Vector3 = new Vector3(0, 0, 0);
    public acceleration: Vector3 = new Vector3(0, 0, 0);

    public initialRotation: Quaternion = new Quaternion();
    public rotation: Quaternion = new Quaternion();
    public relRotation: Quaternion = new Quaternion();
    public fakeRotation: Vector3 = new Vector3();
    public angularVelocity: Vector3 = new Vector3();
    public angularAcceleration: Vector3 = new Vector3();

    public constructor(initialPosition: Vector3, initialVelocity: Vector3, initialRotation: Euler) {
        this.initialPosition = initialPosition.clone().multiplyScalar(CelestialConstants.REAL_SCALE);
        this.position = initialPosition.clone().multiplyScalar(CelestialConstants.REAL_SCALE);

        this.initialVelocity = initialVelocity.clone().multiplyScalar(CelestialConstants.REAL_SCALE);
        this.velocity = initialVelocity.clone().multiplyScalar(CelestialConstants.REAL_SCALE);

        this.initialRotation = new Quaternion().setFromEuler(initialRotation);
        this.rotation = new Quaternion().setFromEuler(initialRotation);
    }

    public setInitials(COM: Vector3, velocity: Vector3, rotation: Quaternion, relRotation: Quaternion, fakeRotation: Vector3, angularVelocity: Vector3): void {
        this.velocity = velocity.clone().multiplyScalar(CelestialConstants.REAL_SCALE);
        this.relVelocity = velocity.clone().multiplyScalar(CelestialConstants.REAL_SCALE);

        this.rotation = rotation.clone();
        this.relRotation = relRotation.clone();
        this.fakeRotation = fakeRotation.clone();

        this.angularVelocity = angularVelocity.clone();

        let fakePosition = this.position.clone();
        let iRotatedCOM: Vector3 = COM.clone().applyQuaternion(this.initialRotation.clone());
        let iActualCOM: Vector3 = fakePosition.clone().add(iRotatedCOM);
        let rotatedCOM: Vector3 = COM.clone().applyQuaternion(this.rotation.clone());
        let actualCOM: Vector3 = fakePosition.clone().add(rotatedCOM);
        this.position = fakePosition.clone().sub(iActualCOM).add(actualCOM); // this works
    }

    public update(delta: number, COM: Vector3): void {
        this.updateLinear(delta);
        this.updateAngular(delta, COM);
    }

    public updateLinear(delta: number): void {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.relVelocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.position.add(this.velocity.clone().multiplyScalar(delta));
        this.relPosition.add(this.relVelocity.clone().multiplyScalar(delta));
    }

    public updateAngular(delta: number, COM: Vector3): void {
        this.angularVelocity.add(this.angularAcceleration.clone().multiplyScalar(delta));
        let angVelQuat: Quaternion = new Quaternion().setFromEuler(new Euler(
            this.angularVelocity.x * delta,
            this.angularVelocity.y * delta,
            this.angularVelocity.z * delta,
        ));
        this.rotation.multiply(angVelQuat);
        this.relRotation.multiply(angVelQuat);
        this.fakeRotation.add(this.angularVelocity.clone().multiplyScalar(delta));

        let iRotatedCOM: Vector3 = COM.clone().applyQuaternion(this.initialRotation.clone());
        let iActualCOM: Vector3 = this.position.clone().add(iRotatedCOM);
        let rotatedCOM: Vector3 = COM.clone().applyQuaternion(this.rotation.clone());
        let actualCOM: Vector3 = this.position.clone().add(rotatedCOM);
        this.fakePosition = this.position.clone().sub(actualCOM).add(iActualCOM); // this works
    }

    public getDisplayAngle(): number {
        return this.fakeRotation.z; // more necessary
    }

    public getAltitude(): number {
        return this.position.clone().length() - PhysicsConstants.RADIUS_EARTH * CelestialConstants.EARTH_EFFECTIVE_MULTIPLIER;
    }

    public reset(): void {
        this.position = this.position.clone().normalize().multiplyScalar(CelestialConstants.EARTH_EFFECTIVE_RADIUS * CelestialConstants.REAL_SCALE);
        this.velocity = new Vector3(0, 0, 0);
        this.relVelocity = new Vector3(0, 0, 0);
        this.acceleration = new Vector3(0, 0, 0);

        this.angularVelocity = new Vector3(0, 0, 0);
        this.angularAcceleration = new Vector3(0, 0, 0);
    }
}