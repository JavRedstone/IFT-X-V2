import { Group, Vector3, Box3, Object3D } from 'three';

export class ObjectHelper {
    public static getObjectDimensions(object: Object3D): Vector3 {
        let box = new Box3().setFromObject(object);
        return box.getSize(new Vector3());
    }
    
    public static getObjectCenter(object: Object3D): Vector3 {
        let box = new Box3().setFromObject(object);
        return box.getCenter(new Vector3());
    }
}