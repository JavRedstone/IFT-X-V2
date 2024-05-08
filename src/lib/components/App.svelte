<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import Telemetry from './ui/flight/telemetry.svelte';
  import Customize from './ui/flight/customize.svelte';
  import Fueling from './ui/flight/fueling.svelte';
  import { onMount } from 'svelte';
  import { toggles } from './stores/ui-store';

  let initialized: boolean = false;
  let toggleValues: any = {
    isEditing: false,
    isFueling: false,
    isLaunching: false,
  }

  function setupUpdator(): void {
    toggles.subscribe((value) => {
      initialized = true;
      toggleValues.isEditing = value.isEditing;
      toggleValues.isFueling = value.isFueling;
      toggleValues.isLaunching = value.isLaunching;
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
  {#if toggleValues.isEditing}
    <Customize />
  {:else if toggleValues.isFueling}
    <Fueling />
  {:else if toggleValues.isLaunching}
    <Telemetry />
  {/if}
{/if}