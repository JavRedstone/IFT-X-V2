<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import Telemetry from './ui/telemetry.svelte';
  import Customize from './ui/customize.svelte';
  import Fueling from './ui/fueling.svelte';
  import { onMount } from 'svelte';
  import { toggles } from './stores/ui-store';

  let initialized: boolean = false;
  let toggleOptions: any = {
    editMode: false,
    paused: false,
  }

  function setupUpdator(): void {
    toggles.subscribe((value) => {
      initialized = true;
      toggleOptions.editMode = value.editMode;
      toggleOptions.paused = value.paused;
    });
  }

  onMount(() => {
    setupUpdator();
  });
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

{#if initialized}
  <div class="page">
    <Canvas>
      <Scene />
    </Canvas>
  </div>
  {#if toggleOptions.editMode}
    <Customize />
  {:else}
    <Telemetry />
    <Fueling />
  {/if}
{/if}