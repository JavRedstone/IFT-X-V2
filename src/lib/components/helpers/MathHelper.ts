import { Euler, Quaternion, Vector3 } from "three";

export class MathHelper {    
    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

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
    
    public static getCircularRotations(n: number, angularOffset: number): Euler[] {
        let rotations = [];
        for (let i = 0; i < n; i++) {
            let x = 0;
            let y = 2 * Math.PI * i / n + angularOffset;
            let z = 0;
            rotations.push(new Euler(x, y, z));
        }
        return rotations;
    }

    // given a circle of radius r, get the maximum number of circles of radius r2 that can be placed around the circle, with the center of circle r2 being on the circle r
    // 2 * pi * r / (2 * r2) = number of circles
    public static getMaxCirclesAroundCircle(r: number, r2: number): number {
        return Math.floor(2 * Math.PI * r / (2 * r2));
    }

    public static getAzimuthElevationFromPos(position: Vector3): { azimuth: number, elevation: number } {
        let azimuth = Math.atan2(position.x, position.z);
        let elevation = Math.atan2(position.y, Math.sqrt(position.x * position.x + position.z * position.z));
        return { azimuth, elevation };
    }

    public static invRot(euler: Euler): Euler {
        return new Euler().setFromQuaternion(new Quaternion().setFromEuler(euler).invert());
    }

    public static isInRadiusOf(center: Vector3, radius: number, point: Vector3): boolean {
        return center.distanceTo(point) < radius;
    }
    
    public static getAngleBetweenVectors(v1: Vector3, v2: Vector3): Quaternion {
        let angle = v1.angleTo(v2);
        let axis = new Vector3().crossVectors(v1, v2).normalize();
        return new Quaternion().setFromAxisAngle(axis, angle);
    }
}