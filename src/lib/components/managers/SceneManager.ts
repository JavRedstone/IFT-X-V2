import { DirectionalLight, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, SRGBColorSpace, SphereGeometry, Texture, TextureLoader, type Scene } from "three";
import type { ThrelteContext } from "@threlte/core";
import { TextureConstants } from "$lib/components/constants/TextureConstants.js";
import { SceneConstants } from "../constants/SceneConstants";
import { CelestialConstants } from "../constants/CelestialConstants";

export class SceneManager {
    public tc: ThrelteContext;
    public sun: DirectionalLight = new DirectionalLight();
    public group: Group = new Group();
    public earth: Mesh = new Mesh();
    public clouds: Mesh = new Mesh();
    
    public interval: number = 0;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setupScene();
        
    }

    public async setupScene() {
        await this.setBackground();
        this.createSun();
        await this.createEarth();
        await this.createClouds();
        this.tc.scene.add(this.group);
        this.interval = setInterval(() => {
            this.update(SceneConstants.DELTA);
        }, SceneConstants.DELTA * 1000);
    }

    public async setBackground() {
        let envMap = await this.loadTexture(TextureConstants.TEXTURE_URL + "stars.jpg");
        envMap.mapping = EquirectangularReflectionMapping;
        this.tc.scene.background = envMap;
    }

    public createSun() {
        let directionalLight = new DirectionalLight(0xffffff, CelestialConstants.SUN_INTENSITY);
        directionalLight.position.set(-50, 0, 30);
        this.tc.scene.add(directionalLight);
    }

    public async createEarth() {
        let map = await this.loadTexture(TextureConstants.TEXTURE_URL + "map.jpg");
        map.colorSpace = SRGBColorSpace;

        let bump = await this.loadTexture(TextureConstants.TEXTURE_URL + "bump.jpg");

        this.group = new Group();
        this.group.rotation.z = 23.5 / 360 * 2 * Math.PI

        let geometry = new SphereGeometry(CelestialConstants.RADIUS, 64, 64);
        let material = new MeshStandardMaterial({
            map: map,
            bumpMap: bump,
            bumpScale: TextureConstants.BUMP_SCALE
        });
        this.earth = new Mesh(geometry, material);
        this.group.add(this.earth);
    }

    public async createClouds() {
        let clouds = await this.loadTexture(TextureConstants.TEXTURE_URL + "clouds.jpg");
        clouds.colorSpace = SRGBColorSpace;

        let geometry = new SphereGeometry(CelestialConstants.CLOUDS_RADIUS, 64, 64);
        let material = new MeshStandardMaterial({
            alphaMap: clouds,
            transparent: true
        });
        this.clouds = new Mesh(geometry, material);
        this.group.add(this.clouds);
    }

    public update(delta: number) {
        this.earth.rotateY(delta * CelestialConstants.ROTATION_SPEED);
        this.clouds.rotateY(delta * CelestialConstants.CLOUDS_ROTATION_SPEED);
    }

    public loadTexture = (url: string) => {
        return new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject);
        });
    };
}