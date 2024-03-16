import { DirectionalLight, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, SphereGeometry, Texture, TextureLoader, type Scene } from "three";
import type { ThrelteContext } from "@threlte/core";
import { TextureConstants } from "$lib/components/constants/TextureConstants.js";
import { SceneConstants } from "../constants/SceneConstants";
import { CelestialConstants } from "../constants/CelestialConstants";
import { OrbitControls } from "@threlte/extras";

export class SceneManager {
    public tc: ThrelteContext;
    public orbitControls: OrbitControls;

    public sun: DirectionalLight = new DirectionalLight();
    public group: Group = new Group();
    public earth: Mesh = new Mesh();
    public earthMaterial: MeshStandardMaterial = new MeshStandardMaterial();
    public clouds: Mesh = new Mesh();

    public updInterval: number = 0;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setupScene();
    }

    public async setupScene() {
        await this.setBackground();
        this.createSun();
        await this.createEarth();
        this.tc.scene.add(this.group);
        this.updInterval = setInterval(() => this.updateScene(SceneConstants.DELTA), 1000 / 60);
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

        let spec = await this.loadTexture(TextureConstants.TEXTURE_URL + "spec.jpg");

        let lights = await this.loadTexture(TextureConstants.TEXTURE_URL + "lights2.gif");

        this.group = new Group();
        this.group.rotation.z = 23.5 / 360 * 2 * Math.PI

        let Egeometry = new SphereGeometry(CelestialConstants.RADIUS, 64, 64);
        let Ematerial = new MeshStandardMaterial({
            map: map,
            bumpMap: bump,
            bumpScale: TextureConstants.BUMP_SCALE,
            roughnessMap: spec,
            roughness: TextureConstants.ROUGHNESS,
            metalnessMap: spec,
            metalness: TextureConstants.METALNESS,
            emissiveMap: lights,
            emissive: TextureConstants.EMISSIVE,
        });
        this.earth = new Mesh(Egeometry, Ematerial);
        this.group.add(this.earth);
        
        let clouds = await this.loadTexture(TextureConstants.TEXTURE_URL + "clouds.jpg");
        clouds.colorSpace = SRGBColorSpace;

        let Cgeometry = new SphereGeometry(CelestialConstants.CLOUDS_RADIUS, 64, 64);
        let Cmaterial = new MeshStandardMaterial({
            alphaMap: clouds,
            transparent: true
        });
        this.clouds = new Mesh(Cgeometry, Cmaterial);
        this.group.add(this.clouds);

        Ematerial.onBeforeCompile = (shader) => {
            shader.uniforms.tClouds = { value: clouds };
            shader.uniforms.tClouds.value.wrapS = RepeatWrapping;
            shader.uniforms.uv_xOffset = { value: 0 };
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
                #include <common>
                uniform sampler2D tClouds;
                uniform float uv_xOffset;
            `);

            // Adding cloud shadows to the Earth
            shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
                #include <emissivemap_fragment>

                // Methodology explanation:
                //
                // Our goal here is to use a “negative light map” approach to cast cloud shadows,
                // the idea is on any uv point on earth map(Point X),
                // we find the corresponding uv point(Point Y) on clouds map that is directly above Point X,
                // then we extract color value at Point Y.
                // We then darken the color value at Point X depending on the color value at Point Y,
                // that is the intensity of the clouds at Point Y.
                //
                // Since the clouds are made to spin twice as fast as the earth,
                // in order to get the correct shadows(clouds) position in this earth's fragment shader
                // we need to minus earth's UV.x coordinate by uv_xOffset,
                // which is calculated and explained in the updateScene()
                // after minus by uv_xOffset, the result would be in the range of -1 to 1,
                // we need to set RepeatWrapping for wrapS of the clouds texture so that texture2D still works for -1 to 0

                float cloudsMapValue = texture2D(tClouds, vec2(vMapUv.x - uv_xOffset, vMapUv.y)).r;
                
                // The shadow should be more intense where the clouds are more intense,
                // thus we do 1.0 minus cloudsMapValue to obtain the shadowValue, which is multiplied to diffuseColor
                // we also clamp the shadowValue to a minimum of 0.2 so it doesn't get too dark
                
                diffuseColor.rgb *= max(1.0 - cloudsMapValue, 0.2 );
            `);

            // Reversing the roughness map because we provide the ocean map
            shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
                float roughnessFactor = roughness;

                #ifdef USE_ROUGHNESSMAP

                vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
                // reversing the black and white values because we provide the ocean map
                texelRoughness = vec4(1.0) - texelRoughness;

                // reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
                roughnessFactor *= clamp(texelRoughness.g, 0.5, 1.0);

                #endif
            `);

            // Adding night lights to the Earth
            shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
                #ifdef USE_EMISSIVEMAP

                vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );

                // Methodology of showing night lights only:
                //
                // going through the shader calculations in the meshphysical shader chunks (mostly on the vertex side),
                // we can confirm that geometryNormal is the normalized normal in view space,
                // for the night side of the earth, the dot product between geometryNormal and the directional light would be negative
                // since the direction vector actually points from target to position of the DirectionalLight,
                // for lit side of the earth, the reverse happens thus emissiveColor would be multiplied with 0.
                // The smoothstep is to smoothen the change between night and day

                emissiveColor *= 1.0 - smoothstep(-0.02, 0.0, dot(vNormal, directionalLights[0].direction));
                
                totalEmissiveRadiance *= emissiveColor.rgb;

                #endif
            `);

            Ematerial.userData.shader = shader;
        }

        this.earthMaterial = Ematerial;
    }

    public updateScene(delta: number) {
        this.earth.rotateY(delta * CelestialConstants.ROTATION_SPEED);
        this.clouds.rotateY(delta * CelestialConstants.CLOUDS_ROTATION_SPEED);
        // 3. calculate uv_xOffset and pass it into the shader used by Earth's MeshStandardMaterial
        // As for each n radians Point X has rotated, Point Y would have rotated 2n radians.
        // Thus uv.x of Point Y would always be = uv.x of Point X - n / 2π.
        // Dividing n by 2π is to convert from radians(i.e. 0 to 2π) into the uv space(i.e. 0 to 1).
        // The offset n / 2π would be passed into the shader program via the uniform variable: uv_xOffset.
        // We do offset % 1 because the value of 1 for uv.x means full circle,
        // whenever uv_xOffset is larger than one, offsetting 2π radians is like no offset at all.
        let shader = this.earthMaterial.userData.shader;
        if (shader) {
            let offset = (delta * CelestialConstants.ROTATION_SPEED) / (2 * Math.PI)
            shader.uniforms.uv_xOffset.value += offset % 1;
        }
    }

    public loadTexture = (url: string) => {
        return new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject);
        });
    };
}