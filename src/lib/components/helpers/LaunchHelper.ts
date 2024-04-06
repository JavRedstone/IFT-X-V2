import { RaptorConstants } from "../constants/controls/RaptorConstants";

export class LaunchHelper {
    public static getFuelMass(radius: number, height: number, density: number): number {
        return Math.PI * radius * radius * height * density;
    }

    public static getThrust(isSea: boolean, type: number): number {
        if (isSea) {
            switch (type) {
                case 1:
                    return RaptorConstants.THRUST_SEA_1;
                case 2:
                    return RaptorConstants.THRUST_SEA_2;
                case 3:
                    return RaptorConstants.THRUST_SEA_3;
                default:
                    return 0;
            }
        }
        else {
            switch (type) {
                case 1:
                    return RaptorConstants.THRUST_VAC_1;
                case 2:
                    return RaptorConstants.THRUST_VAC_2;
                case 3:
                    return RaptorConstants.THRUST_VAC_3;
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
}