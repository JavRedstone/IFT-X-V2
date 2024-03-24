import { Euler, Group, Quaternion, Spherical, Vector3 } from "three";
import { ObjectHelper } from "./ObjectHelper";

export class MathHelper {    
    public static getCircularPositions(n: number, r: number, angularOffset: number): Vector3[] {
        let positions = [];
        for (let i = 0; i < n; i++) {
            let x = r * Math.cos(2 * Math.PI * i / n + angularOffset);
            let y = 0;
            let z = r * Math.sin(2 * Math.PI * i / n + angularOffset);
            positions.push(new Vector3(x, y, z));
        }
        return positions;
    }
    
    public static getGroupCenteredPositions(n: number, r: number, group: Group, angularOffset: number): Vector3[] {
        let positions = MathHelper.getCircularPositions(n, r, angularOffset);
        let center = ObjectHelper.getObjectCenter(group);
        for (let i = 0; i < n; i++) {
            positions[i].add(center);
        }
        return positions;
    }
    
    public static getCircularRotations(n: number, angularOffset: number): Euler[] {
        let rotations = [];
        for (let i = 0; i < n; i++) {
            let x = 0;
            let y = 2 * Math.PI * (n-i) / n + angularOffset;
            let z = 0;
            rotations.push(new Euler(x, y, z));
        }
        return rotations;
    }

    public static getAzimuthElevationFromPos(position: Vector3): { azimuth: number, elevation: number } {
        let azimuth = Math.atan2(position.x, position.z);
        let elevation = Math.atan2(position.y, Math.sqrt(position.x * position.x + position.z * position.z));
        return { azimuth, elevation };
    }

    public static invRot(euler: Euler): Euler {
        return new Euler().setFromQuaternion(new Quaternion().setFromEuler(euler).invert());
    }
}