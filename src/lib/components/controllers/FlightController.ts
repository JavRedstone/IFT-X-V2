import { Euler, Quaternion, Vector3 } from "three";
import { CelestialConstants } from "../constants/CelestialConstants";
import { PhysicsConstants } from "../constants/PhysicsConstants";

export class FlightController {
    public initialPosition: Vector3 = new Vector3(0, 0, 0);
    public position: Vector3 = new Vector3(0, 0, 0);

    public initialVelocity: Vector3 = new Vector3(0, 0, 0);
    public velocity: Vector3 = new Vector3(0, 0, 0);
    public acceleration: Vector3 = new Vector3(0, 0, 0);

    public initialRotation: Quaternion = new Quaternion();
    public rotation: Quaternion = new Quaternion();
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

    public update(delta: number): void {
        this.updateLinear(delta);
        this.updateAngular(delta);
    }

    public updateLinear(delta: number): void {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.position.add(this.velocity.clone().multiplyScalar(delta));
    }

    public updateAngular(delta: number): void {
        this.angularVelocity.add(this.angularAcceleration.clone().multiplyScalar(delta));
        this.rotation.multiply(new Quaternion().setFromEuler(new Euler(
            this.angularVelocity.x * delta,
            this.angularVelocity.y * delta,
            this.angularVelocity.z * delta
        )));
    }

    public getRelativeVelocity(): Vector3 {
        return this.velocity.clone().sub(this.initialVelocity);
    }

    public getRelativeRotation(): Euler {
        let initialEuler: Euler = new Euler().setFromQuaternion(this.initialRotation);
        let currentEuler: Euler = new Euler().setFromQuaternion(this.rotation);
        return new Euler(
            currentEuler.x - initialEuler.x,
            currentEuler.y - initialEuler.y,
            currentEuler.z - initialEuler.z
        );
    }

    public getAltitude(): number {
        return this.position.clone().length() - PhysicsConstants.RADIUS_EARTH * CelestialConstants.EARTH_EFFECTIVE_MULTIPLIER;
    }
}