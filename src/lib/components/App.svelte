<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import Telemetry from './ui/flight/telemetry.svelte';
  import Customize from './ui/flight/customize.svelte';
  import Fueling from './ui/flight/fueling.svelte';
  import { onMount } from 'svelte';
  import { toggles, uiSwitches } from './stores/ui-store';
  import Start from './ui/main/start.svelte';
  import Loading from './ui/main/loading.svelte';

  let uiValues: any = {
    start: true,
    loading: false,
    settings: false,
    credits: false,
    playing: false,
  };
  let toggleValues: any = {
    isEditing: false,
    isFueling: false,
    isLaunching: false,
  };

  function setupUpdator(): void {
    uiSwitches.subscribe((value) => {
      uiValues.start = value.start;
      uiValues.loading = value.loading;
      uiValues.settings = value.settings;
      uiValues.credits = value.credits;
      uiValues.playing = value.playing;
    });

    toggles.subscribe((value) => {
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

{#if uiValues.start}
  <Start />
{:else}
  <div class="page" style="visibility: {uiValues.loading ? 'hidden' : 'visible'}">
    <Canvas>
      <Scene />
    </Canvas>
  </div>
  {#if uiValues.loading}
    <Loading />
  {:else if uiValues.playing}
    {#if toggleValues.isEditing}
      <Customize />
    {:else if toggleValues.isFueling}
      <Fueling />
    {:else if toggleValues.isLaunching}
      <Telemetry />
    {/if}
  {/if}
{/if}