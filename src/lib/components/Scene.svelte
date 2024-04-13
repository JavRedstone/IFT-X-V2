<script lang="ts">
	import BoosterFrost from './models/booster_frost.svelte';
	import ShipFrost from './models/ship_frost.svelte';
	import Carriage from './models/carriage.svelte';
  import { SceneManager } from '$lib/components/managers/SceneManager';
  import { T, useThrelte, type ThrelteContext } from '@threlte/core'
  import { OrbitControls, Sky } from '@threlte/extras'
  import { onMount } from 'svelte';
  import { CameraConstants } from './constants/CameraConstants';
  import ForwardL from './models/forward_L.svelte';
  import ForwardR from './models/forward_R.svelte';
  import AftL from './models/aft_L.svelte';
  import AftR from './models/aft_R.svelte';
  import Nosecone from './models/nosecone.svelte';
  import ShipRing from './models/ship_ring.svelte';
	import ThrustPuck from './models/thrust_puck.svelte';
  import Rsea from './models/rsea.svelte';
  import Rvac from './models/rvac.svelte';
  import Hsr from './models/hsr.svelte';
  import BoosterRing from './models/booster_ring.svelte';
  import GridFin from './models/grid_fin.svelte';
	import Chine from './models/chine.svelte';
	import Top from './models/top.svelte';
  import Body from './models/body.svelte';
  import Arms from './models/arms.svelte';
  import Qd from './models/qd.svelte';
  import Olm from './models/olm.svelte';
  import OuterCylinder from './models/outer_cylinder.svelte';
  import { SceneConstants } from './constants/SceneConstants';
  import type { Object3D, SphereGeometry } from 'three';

  const TC: ThrelteContext = useThrelte();  
  let sceneManager: SceneManager = new SceneManager(TC);
  let updInterval: number = setInterval(() => updateAll(SceneConstants.DELTA), 1000 * SceneConstants.DELTA);

  function updateAll(delta: number) {
    sceneManager.updateAll(delta);
    updateSky();
    updateStarship();
    updateSuperHeavy();
  }
  
  let skyOptions = {
    enabled: false,
    setEnvironment: false,
    turbidity: 0,
    rayleigh: 0,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    elevation: 0,
    azimuth: 0
  }

  function updateSky() {
    skyOptions.enabled = sceneManager.skyManager.enabled;
    skyOptions.setEnvironment = sceneManager.skyManager.setEnvironment;
    skyOptions.turbidity = sceneManager.skyManager.turbidity;
    skyOptions.rayleigh = sceneManager.skyManager.rayleigh;
    skyOptions.mieCoefficient = sceneManager.skyManager.mieCoefficient;
    skyOptions.mieDirectionalG = sceneManager.skyManager.mieDirectionalG;
    skyOptions.elevation = sceneManager.skyManager.elevation;
    skyOptions.azimuth = sceneManager.skyManager.azimuth;
  }

  let rSeasSS: Object3D[] = [];
  let rVacsSS: Object3D[] = [];

  function updateStarship(): void {
    rSeasSS = sceneManager.launchManager.starship.rSeas;
    rVacsSS = sceneManager.launchManager.starship.rVacs;
  }

  let gridFinsSH: Object3D[] = [];
  let chinesSH: Object3D[] = [];
  let rSeasSH: Object3D[] = [];
  let outerCylindersSH: Object3D[] = [];

  function updateSuperHeavy(): void {
    gridFinsSH = sceneManager.launchManager.superHeavy.gridFins;
    chinesSH = sceneManager.launchManager.superHeavy.chines;
    rSeasSH = sceneManager.launchManager.superHeavy.rSeas;
    outerCylindersSH = sceneManager.launchManager.superHeavy.outerCylinders;
  }
  
  const { scene, renderer, camera, size, autoRender, renderStage } = TC;
  $: if (camera && scene) sceneManager.postprocessingManager.updateRenderPass($camera, $size);

  // renderScene();

  // function renderScene() {
  //   renderer.render(scene, $camera);
  //   requestAnimationFrame(renderScene);
  // }
  
  onMount(() => {
    let before: boolean = autoRender.current;
    autoRender.set(false);
    return () => {
      autoRender.set(before);
    }
  });
</script>

<T.PerspectiveCamera
  makeDefault
  fov={CameraConstants.CAMERA_FOV}
  zoom={CameraConstants.CAMERA_ZOOM}
  near={CameraConstants.CAMERA_NEAR}
  far={CameraConstants.CAMERA_FAR}

  bind:ref={sceneManager.launchManager.camera}
>
  <OrbitControls
    enableZoom={true}
    enableRotate={true}
    enableKeys={false}
    enablePan={false}
    enableDamping={true}
    minDistance={CameraConstants.CAMERA_MIN_DISTANCE}
    maxDistance={CameraConstants.CAMERA_MAX_DISTANCE}

    bind:ref={sceneManager.launchManager.orbitControls}
  />
</T.PerspectiveCamera>

{#if sceneManager.skyManager.enabled}
  <Sky
    setEnvironment={skyOptions.setEnvironment}
    turbidity={skyOptions.turbidity}
    rayleigh={skyOptions.rayleigh}
    mieCoefficient={skyOptions.mieCoefficient}
    mieDirectionalG={skyOptions.mieDirectionalG}
    elevation={skyOptions.elevation}
    azimuth={skyOptions.azimuth}
  ></Sky>
{/if}

<T.Group bind:ref={sceneManager.launchManager.starship.group}>
  <Nosecone bind:ref={sceneManager.launchManager.starship.nosecone}/>
  <ShipRing bind:ref={sceneManager.launchManager.starship.shipRing}/>
  <ForwardL bind:ref={sceneManager.launchManager.starship.forwardL}/>
  <ForwardR bind:ref={sceneManager.launchManager.starship.forwardR}/>
  <AftL bind:ref={sceneManager.launchManager.starship.aftL}/>
  <AftR bind:ref={sceneManager.launchManager.starship.aftR}/>
  <ThrustPuck bind:ref={sceneManager.launchManager.starship.thrustPuck}/>
  {#each rSeasSS as rSea, i}
    <Rsea
      position={[rSea.position.x, rSea.position.y, rSea.position.z]}
      rotation={[rSea.rotation.x, rSea.rotation.y, rSea.rotation.z]}
      scale={[rSea.scale.x, rSea.scale.y, rSea.scale.z]}
      userData={rSea.userData}
      bind:ref={sceneManager.launchManager.starship.rSeaObjs[i]}
    />
  {/each}
  {#each rVacsSS as rVac, i}
    <Rvac
      position={[rVac.position.x, rVac.position.y, rVac.position.z]}
      rotation={[rVac.rotation.x, rVac.rotation.y, rVac.rotation.z]}
      scale={[rVac.scale.x, rVac.scale.y, rVac.scale.z]}
      userData={rVac.userData}
      bind:ref={sceneManager.launchManager.starship.rVacObjs[i]}
    />
  {/each}
  <ShipFrost
    position={[sceneManager.launchManager.starship.CH4Frost.position.x, sceneManager.launchManager.starship.CH4Frost.position.y, sceneManager.launchManager.starship.CH4Frost.position.z]}
    rotation={[sceneManager.launchManager.starship.CH4Frost.rotation.x, sceneManager.launchManager.starship.CH4Frost.rotation.y, sceneManager.launchManager.starship.CH4Frost.rotation.z]}
    scale={[sceneManager.launchManager.starship.CH4Frost.scale.x, sceneManager.launchManager.starship.CH4Frost.scale.y, sceneManager.launchManager.starship.CH4Frost.scale.z]}
    bind:ref={sceneManager.launchManager.starship.CH4Frost}
  />
  <ShipFrost
    position={[sceneManager.launchManager.starship.LOXFrost.position.x, sceneManager.launchManager.starship.LOXFrost.position.y, sceneManager.launchManager.starship.LOXFrost.position.z]}
    rotation={[sceneManager.launchManager.starship.LOXFrost.rotation.x, sceneManager.launchManager.starship.LOXFrost.rotation.y, sceneManager.launchManager.starship.LOXFrost.rotation.z]}
    scale={[sceneManager.launchManager.starship.LOXFrost.scale.x, sceneManager.launchManager.starship.LOXFrost.scale.y, sceneManager.launchManager.starship.LOXFrost.scale.z]}
    bind:ref={sceneManager.launchManager.starship.LOXFrost}
  />
</T.Group>

<T.Group bind:ref={sceneManager.launchManager.superHeavy.group}>
  <Hsr bind:ref={sceneManager.launchManager.superHeavy.hsr}/>
  <BoosterRing bind:ref={sceneManager.launchManager.superHeavy.boosterRing}/>
  {#each gridFinsSH as gridFin, i}
    <GridFin
      position={[gridFin.position.x, gridFin.position.y, gridFin.position.z]}
      rotation={[gridFin.rotation.x, gridFin.rotation.y, gridFin.rotation.z]}
      scale={[gridFin.scale.x, gridFin.scale.y, gridFin.scale.z]}
      userData={gridFin.userData}
      bind:ref={sceneManager.launchManager.superHeavy.gridFinObjs[i]}
    />
  {/each}
  {#each chinesSH as chine, i}
    <Chine
      position={[chine.position.x, chine.position.y, chine.position.z]}
      rotation={[chine.rotation.x, chine.rotation.y, chine.rotation.z]}
      scale={[chine.scale.x, chine.scale.y, chine.scale.z]}
      userData={chine.userData}
      bind:ref={sceneManager.launchManager.superHeavy.chineObjs[i]}
    />
  {/each}
  {#each rSeasSH as rSea, i}
    <Rsea
      position={[rSea.position.x, rSea.position.y, rSea.position.z]}
      rotation={[rSea.rotation.x, rSea.rotation.y, rSea.rotation.z]}
      scale={[rSea.scale.x, rSea.scale.y, rSea.scale.z]}
      userData={rSea.userData}
      bind:ref={sceneManager.launchManager.superHeavy.rSeaObjs[i]}
    />
  {/each}
  {#each outerCylindersSH as outerCylinder, i}
    <OuterCylinder
      position={[outerCylinder.position.x, outerCylinder.position.y, outerCylinder.position.z]}
      rotation={[outerCylinder.rotation.x, outerCylinder.rotation.y, outerCylinder.rotation.z]}
      scale={[outerCylinder.scale.x, outerCylinder.scale.y, outerCylinder.scale.z]}
      userData={outerCylinder.userData}
      bind:ref={sceneManager.launchManager.superHeavy.outerCylinderObjs[i]}
    />
  {/each}
  <BoosterFrost
    position={[sceneManager.launchManager.superHeavy.CH4Frost.position.x, sceneManager.launchManager.superHeavy.CH4Frost.position.y, sceneManager.launchManager.superHeavy.CH4Frost.position.z]}
    rotation={[sceneManager.launchManager.superHeavy.CH4Frost.rotation.x, sceneManager.launchManager.superHeavy.CH4Frost.rotation.y, sceneManager.launchManager.superHeavy.CH4Frost.rotation.z]}
    scale={[sceneManager.launchManager.superHeavy.CH4Frost.scale.x, sceneManager.launchManager.superHeavy.CH4Frost.scale.y, sceneManager.launchManager.superHeavy.CH4Frost.scale.z]}
    bind:ref={sceneManager.launchManager.superHeavy.CH4Frost}
  />
  <BoosterFrost
    position={[sceneManager.launchManager.superHeavy.LOXFrost.position.x, sceneManager.launchManager.superHeavy.LOXFrost.position.y, sceneManager.launchManager.superHeavy.LOXFrost.position.z]}
    rotation={[sceneManager.launchManager.superHeavy.LOXFrost.rotation.x, sceneManager.launchManager.superHeavy.LOXFrost.rotation.y, sceneManager.launchManager.superHeavy.LOXFrost.rotation.z]}
    scale={[sceneManager.launchManager.superHeavy.LOXFrost.scale.x, sceneManager.launchManager.superHeavy.LOXFrost.scale.y, sceneManager.launchManager.superHeavy.LOXFrost.scale.z]}
    bind:ref={sceneManager.launchManager.superHeavy.LOXFrost}
  />
</T.Group>

<T.Group bind:ref={sceneManager.launchManager.OLIT.group}>
  <Top bind:ref={sceneManager.launchManager.OLIT.top}/>
  <Body bind:ref={sceneManager.launchManager.OLIT.body}/>
  <Arms bind:ref={sceneManager.launchManager.OLIT.arm1}/>
  <Arms bind:ref={sceneManager.launchManager.OLIT.arm2}/>
  <Carriage bind:ref={sceneManager.launchManager.OLIT.carriageArms}/>
  <Qd bind:ref={sceneManager.launchManager.OLIT.qd}/>
  <Carriage bind:ref={sceneManager.launchManager.OLIT.carriageQd}/>
  <Olm bind:ref={sceneManager.launchManager.OLIT.olm}/>
</T.Group>

<!-- <T.Mesh>
  <T.SphereGeometry args={[0.0002, 32, 32]} />
  <T.MeshBasicMaterial color="red" />
</T.Mesh> -->