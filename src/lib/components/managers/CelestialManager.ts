import { type ThrelteContext } from "@threlte/core";
import { AdditiveBlending, BackSide, DoubleSide, EquirectangularReflectionMapping, Group, LoadingManager, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { TextureHelper } from "../helpers/TextureHelper";
import { CelestialConstants } from "../constants/CelestialConstants";
import { TextureConstants } from "../constants/TextureConstants";
import { PRTransients } from "../constants/transients/PRTransients";
import { gameSettings } from "../stores/ui-store";

export class CelestialManager {
    public tc: ThrelteContext;
    public loadingManager: LoadingManager;

    public earthGroup: Group = new Group();
    public earth: Mesh = new Mesh();
    public earthMaterial: MeshStandardMaterial = new MeshStandardMaterial();
    public clouds: Mesh = new Mesh();
    public atmosphere: Mesh = new Mesh();
    
    public moon: Mesh = new Mesh();

    public textureResolution: number = TextureConstants.DEFAULT_TEXTURE_RESOLUTION;

    public skyEnabled: boolean = true;
    public addedAtmosphere: boolean = true;

    constructor(tc: ThrelteContext, loadingManager: LoadingManager) {
        this.tc = tc;
        this.loadingManager = loadingManager;
        this.setup();
    }

    public async setup(): Promise<void> {
        gameSettings.subscribe((value) => {
            this.textureResolution = value.textureResolution;
        });
        
        await this.setBackground();
        await this.createEarth();
        await this.createMoon();
        this.tc.scene.add(this.earthGroup);
    }

    public async setBackground(): Promise<void> {
        let envMap = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/stars.jpg", this.loadingManager);
        envMap.mapping = EquirectangularReflectionMapping;
        this.tc.scene.background = envMap;
    }

    public async createEarth(): Promise<void> {
        let map = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/map.jpg", this.loadingManager);
        map.colorSpace = SRGBColorSpace;

        let bump = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/bump.jpg", this.loadingManager);

        let spec = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/spec.jpg", this.loadingManager);

        let lights = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/lights2.gif", this.loadingManager);

        this.earthGroup = new Group();
        // this.earthGroup.rotation.z = 23.5 / 360 * 2 * Math.PI;

        let Egeometry = new SphereGeometry(CelestialConstants.EARTH_RADIUS, CelestialConstants.EARTH_VERTICES, CelestialConstants.EARTH_VERTICES);
        let Ematerial = new MeshStandardMaterial({
            map: map,
            bumpScale: CelestialConstants.EARTH_BUMP_SCALE,
            roughnessMap: spec,
            roughness: CelestialConstants.EARTH_ROUGHNESS,
            metalnessMap: spec,
            metalness: CelestialConstants.EARTH_METALNESS,
            emissiveMap: lights,
            emissive: CelestialConstants.EARTH_EMISSIVE,
            emissiveIntensity: CelestialConstants.EARTH_EMISSIVE_INTENSITY,
        });
        this.earth = new Mesh(Egeometry, Ematerial);
        this.earthGroup.add(this.earth);
        
        let clouds = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/clouds.jpg", this.loadingManager);
        clouds.colorSpace = SRGBColorSpace;

        let Cgeometry = new SphereGeometry(CelestialConstants.CLOUDS_RADIUS, CelestialConstants.EARTH_VERTICES, CelestialConstants.EARTH_VERTICES);
        let Cmaterial = new MeshStandardMaterial({
            alphaMap: clouds,
            transparent: true,
            side: DoubleSide
        });
        this.clouds = new Mesh(Cgeometry, Cmaterial);
        this.earthGroup.add(this.clouds);

        let Ageometry = new SphereGeometry(CelestialConstants.ATMOSPHERE_RADIUS, CelestialConstants.EARTH_VERTICES, CelestialConstants.EARTH_VERTICES);
        let Amaterial = new ShaderMaterial({
            vertexShader: `varying vec3 vNormal;
            varying vec3 eyeVector;
            
            void main() {
                // modelMatrix transforms the coordinates local to the model into world space
                vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );
            
                // normalMatrix is a matrix that is used to transform normals from object space to view space.
                vNormal = normalize( normalMatrix * normal );
            
                // vector pointing from camera to vertex in view space
                eyeVector = normalize(mvPos.xyz);
            
                gl_Position = projectionMatrix * mvPos;
            }`,
            fragmentShader: `varying vec3 vNormal;
            varying vec3 eyeVector;
            uniform float atmOpacity;
            uniform float atmPowFactor;
            uniform float atmMultiplier;
            uniform float atmFactor;
            
            void main() {
                // Starting from the atmosphere edge, dotP would increase from 0 to 1
                float dotP = dot( vNormal, eyeVector );
                // This factor is to create the effect of a realistic thickening of the atmosphere coloring
                float factor = pow(dotP, atmPowFactor) * atmMultiplier;
                // Adding in a bit of dotP to the color to make it whiter while thickening
                vec3 atmColor = vec3(0.35 + dotP/4.5, 0.35 + dotP/4.5, 1.0);
                // use atmOpacity to control the overall intensity of the atmospheric color
                gl_FragColor = vec4(atmColor, atmOpacity) * factor * atmFactor;
            
                // (optional) colorSpace conversion for output
                gl_FragColor = linearToOutputTexel( gl_FragColor );
            }`,
            uniforms: {
                atmOpacity: { value: CelestialConstants.ATMOSPHERIC_OPACITY },
                atmPowFactor: { value: CelestialConstants.ATMOSPHERIC_POW_FACTOR },
                atmMultiplier: { value: CelestialConstants.ATMOSPHERIC_MULTIPLIER },
                atmFactor: { value: 0 }
            },
            blending: AdditiveBlending,
            side: BackSide
        });
        this.atmosphere = new Mesh(Ageometry, Amaterial);
        // this.earthGroup.add(this.atmosphere);

        Ematerial.onBeforeCompile = (shader) => {
            // shader.uniforms.tClouds = { value: clouds };
            // shader.uniforms.tClouds.value.wrapS = RepeatWrapping;
            // shader.uniforms.uv_xOffset = { value: 0 };
            shader.uniforms.fresnelFactor = { value: 0 };
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
                #include <common>
                // uniform sampler2D tClouds;
                // uniform float uv_xOffset;
                uniform float fresnelFactor;
            `);

            // Adding cloud shadows to the Earth
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

                /*
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
                */

                // adding a small amount of atmospheric fresnel effect to make it more realistic
                // fine tune the first constant below for stronger or weaker effect
                float intensity = 1.0 - dot(vNormal, vec3( 0.0, 0.0, 1.0 ) ); // first constant was 1.4
                vec3 atmosphere = vec3( 0.3, 0.6, 1.0 ) * pow(intensity, 5.0);
            
                diffuseColor.rgb += atmosphere * fresnelFactor;
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

            Ematerial.userData.shader = shader;
        }

        this.earthMaterial = Ematerial;
    }

    public async createMoon(): Promise<void> {
        let map = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/moon_map.jpg", this.loadingManager);
        map.colorSpace = SRGBColorSpace;

        let bump = await TextureHelper.loadTexture(TextureConstants.TEXTURE_URL + TextureConstants.TEXTURE_RESOLUTIONS[this.textureResolution] + "/moon_bump.jpg", this.loadingManager);

        let Mgeometry = new SphereGeometry(CelestialConstants.MOON_RADIUS, CelestialConstants.MOON_VERTICES, CelestialConstants.MOON_VERTICES);
        let Mmaterial = new MeshStandardMaterial({
            map: map,
            bumpMap: bump,
            bumpScale: CelestialConstants.MOON_BUMP_SCALE,
            metalness: CelestialConstants.MOON_METALNESS,
            roughness: CelestialConstants.MOON_ROUGHNESS
        });
        this.moon = new Mesh(Mgeometry, Mmaterial);
        PRTransients.realPositions.moonPosition.copy(new Vector3(0, 0, CelestialConstants.MOON_DISTANCE));
        this.tc.scene.add(this.moon);
    }

    public updateReals(delta: number): void {
        this.updateRealPositions(delta);
        this.updateRealRotations(delta);
    }
    
    public updateScene(delta: number): void {
        this.updatePositions(delta);
        this.updateRotations(delta);
        this.updateShader(delta);
    }

    public updateRealPositions(delta: number): void {
        PRTransients.realPositions.moonPosition.applyAxisAngle(new Vector3(0, 1, 0), delta * CelestialConstants.MOON_ORBIT_SPEED);
    }

    public updateRealRotations(delta: number): void {
        PRTransients.realRotations.earthRotation.y += delta * CelestialConstants.EARTH_ROTATION_SPEED;
        PRTransients.realRotations.cloudRotation.y += delta * CelestialConstants.CLOUDS_ROTATION_SPEED;
        PRTransients.realRotations.moonRotation.y += delta * CelestialConstants.MOON_ORBIT_SPEED;
    }

    public updatePositions(delta: number): void {
        this.earthGroup.position.copy(PRTransients.fakePositions.earthPosition);
        this.moon.position.copy(PRTransients.fakePositions.moonPosition);
    }

    public updateRotations(delta: number): void {
        this.earth.rotation.copy(PRTransients.fakeRotations.earthRotation);
        this.clouds.rotation.copy(PRTransients.fakeRotations.cloudRotation);
        this.moon.rotation.copy(PRTransients.fakeRotations.moonRotation);
    }

    public updateShader(delta: number): void {
        // 3. calculate uv_xOffset and pass it into the shader used by Earth's MeshStandardMaterial
        // As for each n radians Point X has rotated, Point Y would have rotated 2n radians.
        // Thus uv.x of Point Y would always be = uv.x of Point X - n / 2π.
        // Dividing n by 2π is to convert from radians(i.e. 0 to 2π) into the uv space(i.e. 0 to 1).
        // The offset n / 2π would be passed into the shader program via the uniform variable: uv_xOffset.
        // We do offset % 1 because the value of 1 for uv.x means full circle,
        // whenever uv_xOffset is larger than one, offsetting 2π radians is like no offset at all.

        let shader = this.earthMaterial.userData.shader;
        if (shader) {
        //     let offset = (delta * (CelestialConstants.CLOUDS_ROTATION_SPEED - CelestialConstants.EARTH_ROTATION_SPEED)) / (2 * Math.PI)
        //     shader.uniforms.uv_xOffset.value += offset % 1;
            if (this.skyEnabled) {
                shader.uniforms.fresnelFactor.value = 0;
            }
            else {
                shader.uniforms.fresnelFactor.value = 1;
            }
        }
    }
}