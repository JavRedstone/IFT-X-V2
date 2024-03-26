import { Euler, Vector3 } from "three";

export class PRTransients {
    public static realPositions: any = {
        earthPosition: new Vector3(0, 0, 0),
        moonPosition: new Vector3(0, 0, 0),
        sunPosition: new Vector3(0, 0, 0),

        groupPosition: new Vector3(0, 0, 0),
        cameraPosition: new Vector3(0, 0, 0),
        orbitControlsPosition: new Vector3(0, 0, 0)
    };

    public static realRotations: any = {
        earthRotation: new Euler(0, 0, 0),
        cloudRotation: new Euler(0, 0, 0),
        moonRotation: new Euler(0, 0, 0),

        groupRotation: new Euler(0, 0, 0)
    };

    public static fakePositions: any = {
        earthPosition: new Vector3(0, 0, 0),
        moonPosition: new Vector3(0, 0, 0),
        sunPosition: new Vector3(0, 0, 0),

        groupPosition: new Vector3(0, 0, 0),
        cameraPosition: new Vector3(0, 0, 0),
        orbitControlsPosition: new Vector3(0, 0, 0)
    };

    public static fakeRotations: any = {
        earthRotation: new Euler(0, 0, 0),
        cloudRotation: new Euler(0, 0, 0),
        moonRotation: new Euler(0, 0, 0),

        groupRotation: new Euler(0, 0, 0)
    };
}