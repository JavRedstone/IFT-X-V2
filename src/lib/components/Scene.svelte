<script lang="ts">
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
  import { LaunchManager } from './managers/LaunchManager';
  import OuterCylinder from './models/outer_cylinder.svelte';
  import { SceneConstants } from './constants/SceneConstants';

  const TC: ThrelteContext = useThrelte();  
  let sceneManager: SceneManager = new SceneManager(TC);
  let updInterval: number = setInterval(() => updateScene(SceneConstants.DELTA), 1000 / SceneConstants.FPS);

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

  function updateScene(delta: number) {
    sceneManager.updateScene(delta);
    updateSky();
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

<T.Group bind:ref={sceneManager.launchManager.group}>
  <T.Group bind:ref={sceneManager.launchManager.starship.group}>
    <Nosecone bind:ref={sceneManager.launchManager.starship.nosecone}/>
    <ShipRing bind:ref={sceneManager.launchManager.starship.shipRing}/>
    <ForwardL bind:ref={sceneManager.launchManager.starship.forwardL}/>
    <ForwardR bind:ref={sceneManager.launchManager.starship.forwardR}/>
    <AftL bind:ref={sceneManager.launchManager.starship.aftL}/>
    <AftR bind:ref={sceneManager.launchManager.starship.aftR}/>
    <ThrustPuck bind:ref={sceneManager.launchManager.starship.thrustPuck}/>
    {#each sceneManager.launchManager.starship.rSeas as rSea, i}
      <Rsea
        position={[rSea.position.x, rSea.position.y, rSea.position.z]}
        rotation={[rSea.rotation.x, rSea.rotation.y, rSea.rotation.z]}
        scale={[rSea.scale.x, rSea.scale.y, rSea.scale.z]}
        userData={rSea.userData}
        bind:ref={sceneManager.launchManager.starship.rSeaObjs[i]}
      />
    {/each}
    {#each sceneManager.launchManager.starship.rVacs as rVac, i}
      <Rvac
        position={[rVac.position.x, rVac.position.y, rVac.position.z]}
        rotation={[rVac.rotation.x, rVac.rotation.y, rVac.rotation.z]}
        scale={[rVac.scale.x, rVac.scale.y, rVac.scale.z]}
        userData={rVac.userData}
        bind:ref={sceneManager.launchManager.starship.rVacObjs[i]}
      />
    {/each}
  </T.Group>
  
  <T.Group bind:ref={sceneManager.launchManager.superHeavy.group}>
    <Hsr bind:ref={sceneManager.launchManager.superHeavy.hsr}/>
    <BoosterRing bind:ref={sceneManager.launchManager.superHeavy.boosterRing}/>
    {#each sceneManager.launchManager.superHeavy.gridFins as gridFin, i}
      <GridFin
        position={[gridFin.position.x, gridFin.position.y, gridFin.position.z]}
        rotation={[gridFin.rotation.x, gridFin.rotation.y, gridFin.rotation.z]}
        scale={[gridFin.scale.x, gridFin.scale.y, gridFin.scale.z]}
        userData={gridFin.userData}
        bind:ref={sceneManager.launchManager.superHeavy.gridFinObjs[i]}
      />
    {/each}
    {#each sceneManager.launchManager.superHeavy.chines as chine, i}
      <Chine
        position={[chine.position.x, chine.position.y, chine.position.z]}
        rotation={[chine.rotation.x, chine.rotation.y, chine.rotation.z]}
        scale={[chine.scale.x, chine.scale.y, chine.scale.z]}
        userData={chine.userData}
        bind:ref={sceneManager.launchManager.superHeavy.chineObjs[i]}
      />
    {/each}
    {#each sceneManager.launchManager.superHeavy.rSeas as rSea, i}
      <Rsea
        position={[rSea.position.x, rSea.position.y, rSea.position.z]}
        rotation={[rSea.rotation.x, rSea.rotation.y, rSea.rotation.z]}
        scale={[rSea.scale.x, rSea.scale.y, rSea.scale.z]}
        userData={rSea.userData}
        bind:ref={sceneManager.launchManager.superHeavy.rSeaObjs[i]}
      />
    {/each}
    {#each sceneManager.launchManager.superHeavy.outerCylinders as outerCylinder, i}
    <OuterCylinder
      position={[outerCylinder.position.x, outerCylinder.position.y, outerCylinder.position.z]}
      rotation={[outerCylinder.rotation.x, outerCylinder.rotation.y, outerCylinder.rotation.z]}
      scale={[outerCylinder.scale.x, outerCylinder.scale.y, outerCylinder.scale.z]}
      userData={outerCylinder.userData}
      bind:ref={sceneManager.launchManager.superHeavy.outerCylinderObjs[i]}
    />
  {/each}
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
</T.Group>