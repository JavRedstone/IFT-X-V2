<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import Launch from './ui/launch.svelte';
    import Customize from './ui/customize.svelte';
</script>

<Canvas>
  <Scene />
</Canvas>
<!-- <Customize /> -->
<Launch />