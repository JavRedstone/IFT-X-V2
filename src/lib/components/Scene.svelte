<script lang="ts">
  import { SceneManager } from '$lib/components/managers/SceneManager';
  import { T, useThrelte, type ThrelteContext } from '@threlte/core'
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras'
  import { onMount } from 'svelte';

  const TC: ThrelteContext = useThrelte();  
  let sceneManager: SceneManager = new SceneManager(TC);
  
  const { scene, renderer, camera, size, autoRender, renderStage } = TC;
  $: if (camera && scene) sceneManager.effectManager.updateRenderPass($camera, $size);

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
  position={[0, 0, 50]}
  fov={75}

  bind:ref={sceneManager.camera}
>
  <OrbitControls
    enableZoom
    enableDamping

    bind:this={sceneManager.orbitControls}
  />
</T.PerspectiveCamera>