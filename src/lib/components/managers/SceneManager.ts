import { DirectionalLight, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, SRGBColorSpace, SphereGeometry, Texture, TextureLoader, type Scene } from "three";
import type { ThrelteContext } from "@threlte/core";
import { TextureConstants } from "$lib/components/constants/TextureConstants.js";
import { PropertyConstants } from "../constants/PropertyConstants";

export class SceneManager {
    public tc: ThrelteContext;
    public sun: DirectionalLight = new DirectionalLight();
    public group: Group = new Group();
    public earth: Mesh = new Mesh();

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setBackground();
        this.createSun();
        this.createEarth();
    }

    public async setBackground() {
        let envMap = await this.loadTexture(TextureConstants.TEXTURE_URL + "stars.jpg");
        envMap.mapping = EquirectangularReflectionMapping;
        this.tc.scene.background = envMap;
    }

    public createSun() {
        let directionalLight = new DirectionalLight(0xffffff, PropertyConstants.SUN_INTENSITY);
        directionalLight.position.set(-50, 0, 30);
        this.tc.scene.add(directionalLight);
    }

    public async createEarth() {
        let map = await this.loadTexture(TextureConstants.TEXTURE_URL + "map.jpg");
        map.colorSpace = SRGBColorSpace;

        this.group = new Group();
        this.group.rotation.z = 23.5 / 360 * 2 * Math.PI

        let geometry = new SphereGeometry(10, 64, 64);
        let material = new MeshStandardMaterial({ map: map });
        this.earth = new Mesh(geometry, material);
        this.group.add(this.earth);

        this.earth.rotateY(-0.3);

        this.tc.scene.add(this.group);
    }

    public loadTexture = (url: string) => {
        return new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject);
        });
    };
}