<script lang="ts">
  import { SceneManager } from '$lib/components/managers/SceneManager';
  import { T, useThrelte, type ThrelteContext } from '@threlte/core'
  import { OrbitControls, Sky } from '@threlte/extras'
  import { onMount } from 'svelte';
  import { CameraConstants } from './constants/CameraConstants';
  import { Group, Mesh } from 'three';
  import ForwardL from './models/forward_L.svelte';
  import ForwardR from './models/forward_R.svelte';
  import AftL from './models/aft_L.svelte';
  import AftR from './models/aft_R.svelte';
  import Nosecone from './models/nosecone.svelte';
  import ShipRing from './models/ship_ring.svelte';
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

  const TC: ThrelteContext = useThrelte();  
  let sceneManager: SceneManager = new SceneManager(TC);
  
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

  bind:ref={sceneManager.camera}
>
  <OrbitControls
    enableZoom={true}
    enableRotate={true}
    enableKeys={false}
    enablePan={false}
    enableDamping={true}
    minDistance={CameraConstants.CAMERA_MIN_DISTANCE}
    maxDistance={CameraConstants.CAMERA_MAX_DISTANCE}

    bind:ref={sceneManager.orbitControls}
  />
</T.PerspectiveCamera>

{#if sceneManager.skyManager.options.enabled}
  <Sky
    setEnvironment={sceneManager.skyManager.options.setEnvironment}
    turbidity={sceneManager.skyManager.options.turbidity}
    rayleigh={sceneManager.skyManager.options.rayleigh}
    mieCoefficient={sceneManager.skyManager.options.mieCoefficient}
    mieDirectionalG={sceneManager.skyManager.options.mieDirectionalG}
    elevation={sceneManager.skyManager.options.elevation}
    azimuth={sceneManager.skyManager.options.azimuth}
  ></Sky>
{/if}

<T.Group bind:ref={sceneManager.launchManager.starship.group}>
  <Nosecone bind:ref={sceneManager.launchManager.starship.nosecone}/>
  <ShipRing bind:ref={sceneManager.launchManager.starship.shipRing}/>
  <ForwardL bind:ref={sceneManager.launchManager.starship.forwardL}/>
  <ForwardR bind:ref={sceneManager.launchManager.starship.forwardR}/>
  <AftL bind:ref={sceneManager.launchManager.starship.aftL}/>
  <AftR bind:ref={sceneManager.launchManager.starship.aftR}/>
  {#each sceneManager.launchManager.starship.rSeas as rSea}
    <Rsea
      position={[rSea.position.x, rSea.position.y, rSea.position.z]}
      rotation={[rSea.rotation.x, rSea.rotation.y, rSea.rotation.z]}
      scale={[rSea.scale.x, rSea.scale.y, rSea.scale.z]}
    />
  {/each}
  {#each sceneManager.launchManager.starship.rVacs as rVac}
    <Rvac
      position={[rVac.position.x, rVac.position.y, rVac.position.z]}
      rotation={[rVac.rotation.x, rVac.rotation.y, rVac.rotation.z]}
      scale={[rVac.scale.x, rVac.scale.y, rVac.scale.z]}
    />
  {/each}
</T.Group>

<!-- <T.Group bind:ref={sceneManager.launchManager.superHeavy.group}>
  <Hsr bind:ref={sceneManager.launchManager.superHeavy.hsr}/>
  <BoosterRing bind:ref={sceneManager.launchManager.superHeavy.boosterRing}/>
  {#each sceneManager.launchManager.superHeavy.gridFins as gridFin}
    <GridFin
      position={[gridFin.position.x, gridFin.position.y, gridFin.position.z]}
      rotation={[gridFin.rotation.x, gridFin.rotation.y, gridFin.rotation.z]}
      scale={[gridFin.scale.x, gridFin.scale.y, gridFin.scale.z]}
    />
  {/each}
  {#each sceneManager.launchManager.superHeavy.chines as chine}
    <Chine
      position={[chine.position.x, chine.position.y, chine.position.z]}
      rotation={[chine.rotation.x, chine.rotation.y, chine.rotation.z]}
      scale={[chine.scale.x, chine.scale.y, chine.scale.z]}
    />
  {/each}
  {#each sceneManager.launchManager.superHeavy.rSeas as rSea}
    <Rsea
      position={[rSea.position.x, rSea.position.y, rSea.position.z]}
      rotation={[rSea.rotation.x, rSea.rotation.y, rSea.rotation.z]}
      scale={[rSea.scale.x, rSea.scale.y, rSea.scale.z]}
    />
  {/each}
</T.Group> -->

<!-- <T.Group bind:ref={sceneManager.launchManager.OLIT.group}>
  <Top bind:ref={sceneManager.launchManager.OLIT.top}/>
  <Body bind:ref={sceneManager.launchManager.OLIT.body}/>
  <Arms bind:ref={sceneManager.launchManager.OLIT.arm1}/>
  <Arms bind:ref={sceneManager.launchManager.OLIT.arm2}/>
  <Qd bind:ref={sceneManager.launchManager.OLIT.qd}/>
  <Olm bind:ref={sceneManager.launchManager.OLIT.olm}/>
</T.Group> -->