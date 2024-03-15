import { EquirectangularReflectionMapping, Mesh, MeshStandardMaterial, SphereGeometry, type Scene } from "three";
import { CelestialManager } from "./CelestialManager";
import { CelestialObj } from "$lib/components/structs/CelestialObj.js";
import { loadTexture } from "./TextureManager.js";
import type { ThrelteContext } from "@threlte/core";
import { TextureConstants } from "$lib/components/constants/TextureConstants.js";

export class SceneManager {
    public tc: ThrelteContext;
    public celestialManager: CelestialManager;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.celestialManager = new CelestialManager([CelestialObj.EARTH, CelestialObj.MOON, CelestialObj.MARS]);
        this.setBackground();
    }

    public async setBackground() {
        let envMap = await loadTexture(TextureConstants.TEXTURE_URL + "2k_stars.jpg");
        envMap.mapping = EquirectangularReflectionMapping;
        this.tc.scene.background = envMap;
    }

    public async createEarth() {
    
    }
}