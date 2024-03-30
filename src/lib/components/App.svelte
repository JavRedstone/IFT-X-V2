<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import Launch from './ui/launch.svelte';
  import Customize from './ui/customize.svelte';
</script>
<style>
  @keyframes increaseOpacity {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
  }

  .page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    animation: increaseOpacity 1s;
  }
</style>

<div class="page">
  <Canvas>
    <Scene />
  </Canvas>
</div>
<Customize />
<!-- <Launch /> -->