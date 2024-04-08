import { Vector3 } from "three";
import { RaptorConstants } from "../constants/controls/RaptorConstants";
import { PhysicsConstants } from "../constants/PhysicsConstants";
import { CelestialConstants } from "../constants/CelestialConstants";

export class LaunchHelper {
    public static getFuelMass(radius: number, height: number, density: number): number {
        return Math.PI * radius * radius * height * density;
    }

    public static getThrust(isSea: boolean, type: number): number {
        if (isSea) {
            switch (type) {
                case 1:
                    return RaptorConstants.R_SEA_THRUST_1;
                case 2:
                    return RaptorConstants.R_SEA_THRUST_2;
                case 3:
                    return RaptorConstants.R_SEA_THRUST_3;
                default:
                    return 0;
            }
        }
        else {
            switch (type) {
                case 1:
                    return RaptorConstants.R_VAC_THRUST_1;
                case 2:
                    return RaptorConstants.R_VAC_THRUST_2;
                case 3:
                    return RaptorConstants.R_VAC_THRUST_3;
                default:
                    return 0;
            }
        }
    }

    public static getTWR(thrust: number, mass: number, gravity: number) {
        return thrust / (mass * gravity);
    }

    public static getTString(dt: number): string {
        // format: T-00:00:00
        let sign = dt < 0 ? "-" : "+";
        dt = Math.abs(dt);
        let hours = Math.floor(dt / 3600);
        let minutes = Math.floor((dt % 3600) / 60);
        let seconds = Math.floor(dt % 60);
        return `T${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    public static getGEarth(altitude: number): number {
        return PhysicsConstants.GRAVITATIONAL_CONSTANT * PhysicsConstants.MASS_EARTH / (PhysicsConstants.RADIUS_EARTH * CelestialConstants.EARTH_EFFECTIVE_MULTIPLIER + altitude) ** 2;
    }

    public static getThrustLoss(altitude: number): number {
        return RaptorConstants.THRUST_LOSS * altitude;
    }

    public static getAltitude(position: Vector3): number {
        return position.length() - CelestialConstants.EARTH_EFFECTIVE_RADIUS;
    }
}