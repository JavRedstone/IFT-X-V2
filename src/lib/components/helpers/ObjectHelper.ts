import { Box3, Object3D, Vector3 } from 'three';
import { OBB } from 'three/addons/math/OBB.js';

export class ObjectHelper {
    public static getAabb(object: Object3D): Box3 {
        return new Box3().setFromObject(object);
    }
    
    public static getObb(object: Object3D): OBB {
        return new OBB().fromBox3(ObjectHelper.getAabb(object));
    }
}