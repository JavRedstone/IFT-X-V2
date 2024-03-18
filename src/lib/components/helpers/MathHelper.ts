import { Box3, Euler, Vector3 } from "three";

export class MathHelper {
    public static getGroupDimensions(group): Vector3 {
        let box = new Box3().setFromObject(group);
        return box.getSize(new Vector3());
    }
    
    public static getGroupCenter(group): Vector3 {
        let box = new Box3().setFromObject(group);
        return box.getCenter(new Vector3());
    }
    
    public static getCircularPositions(n: number, r: number): Vector3[] {
        let positions = [];
        for (let i = 0; i < n; i++) {
            let x = r * Math.cos(2 * Math.PI * i / n);
            let z = r * Math.sin(2 * Math.PI * i / n);
            positions.push(new Vector3(x, 0, z));
        }
        return positions;
    }
    
    public static getGroupCenteredPositions(n: number, r: number, group): Vector3[] {
        let positions = MathHelper.getCircularPositions(n, r);
        let center = MathHelper.getGroupCenter(group);
        for (let i = 0; i < n; i++) {
            positions[i].add(center);
        }
        return positions;
    }
    
    public static getCircularRotations(n: number): Euler[] {
        let rotations = [];
        for (let i = 0; i < n; i++) {
            let x = 0;
            let y = 2 * Math.PI * i / n;
            let z = 0;
            rotations.push(new Euler(x, y, z));
        }
        return rotations;
    }
}