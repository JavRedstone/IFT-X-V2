import { Euler, Vector3 } from "three";
import { CelestialConstants } from "../constants/CelestialConstants";
import { PhysicsConstants } from "../constants/PhysicsConstants";

export class FlightController {
    public initialPosition: Vector3 = new Vector3(0, 0, 0);
    public position: Vector3 = new Vector3(0, 0, 0);

    public initialVelocity: Vector3 = new Vector3(0, 0, 0);
    public velocity: Vector3 = new Vector3(0, 0, 0);
    public acceleration: Vector3 = new Vector3(0, 0, 0);

    public initialRotation: Euler = new Euler(0, 0, 0);
    public rotation: Euler = new Euler(0, 0, 0);
    public angularVelocity: Vector3 = new Vector3(0, 0, 0);
    public angularAcceleration: Vector3 = new Vector3(0, 0, 0);

    public constructor(initialPosition: Vector3, initialVelocity: Vector3, initialRotation: Euler) {
        this.initialPosition = initialPosition.clone().multiplyScalar(CelestialConstants.REAL_SCALE);
        this.position = initialPosition.clone().multiplyScalar(CelestialConstants.REAL_SCALE);

        this.initialVelocity = initialVelocity.clone().multiplyScalar(CelestialConstants.REAL_SCALE);
        this.velocity = initialVelocity.clone().multiplyScalar(CelestialConstants.REAL_SCALE);

        this.initialRotation = initialRotation.clone();
        this.rotation = initialRotation.clone();
    }

    public update(delta: number): void {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.position.add(this.velocity.clone().multiplyScalar(delta));

        this.angularVelocity.add(this.angularAcceleration.clone().multiplyScalar(delta));
        
        this.rotation.x += this.angularVelocity.x * delta;
        this.rotation.y += this.angularVelocity.y * delta;
        this.rotation.z += this.angularVelocity.z * delta;
    }

    public getRelativeVelocity(): Vector3 {
        return this.velocity.clone().sub(this.initialVelocity);
    }

    public getRelativeRotation(): Euler {
        return new Euler(
            this.rotation.x - this.initialRotation.x,
            this.rotation.y - this.initialRotation.y,
            this.rotation.z - this.initialRotation.z
        );
    }

    public getAltitude(): number {
        return this.position.clone().length() - PhysicsConstants.RADIUS_EARTH * CelestialConstants.EARTH_EFFECTIVE_MULTIPLIER;
    }
}