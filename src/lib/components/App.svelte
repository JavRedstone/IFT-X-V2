<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from './Scene.svelte';
  import Telemetry from './ui/flight/telemetry.svelte';
  import Customize from './ui/flight/customize.svelte';
  import Fueling from './ui/flight/fueling.svelte';
  import { onMount } from 'svelte';
  import { gameSettings, toggles, uiSwitches } from './stores/ui-store';
  import Start from './ui/main/start.svelte';
  import Loading from './ui/main/loading.svelte';
  
  import UltrabySavfk from '$lib/components/music/ultra_by_savfk.mp3';

  let audio: HTMLAudioElement;

  let uiValues: any = {
    start: true,
    loading: false,
    playing: false,
  };
  let toggleValues: any = {
    isEditing: false,
    isFueling: false,
    isLaunching: false,
  };

  function setupAudio(): void {
    document.body.addEventListener('click', () => {
      audio.play();
    });
  }

  function setupUpdator(): void {
    uiSwitches.subscribe((value) => {
      uiValues.start = value.start;
      uiValues.loading = value.loading;
      uiValues.playing = value.playing;
    });

    toggles.subscribe((value) => {
      toggleValues.isEditing = value.isEditing;
      toggleValues.isFueling = value.isFueling;
      toggleValues.isLaunching = value.isLaunching;
    });

    gameSettings.subscribe((value) => {
      audio.volume = value.volume;
      audio.muted = value.volume === 0;
    });
  }

  onMount(() => {
    setupAudio();
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

<audio bind:this={audio} loop={true} autoplay={true}>
  <source src={UltrabySavfk} type="audio/mpeg" />
</audio>

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