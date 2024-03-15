<script lang="ts">
  import { SceneManager } from '$lib/components/managers/SceneManager';
  import { T, useThrelte, type ThrelteContext } from '@threlte/core'
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras'

  const TC: ThrelteContext = useThrelte();  
  let sceneManager: SceneManager = new SceneManager(TC);
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 0, 0]}
  fov={100}
>
  <OrbitControls
    enableZoom
    enableDamping
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  intensity={0.8}
  position.x={0}
  position.y={10}
/>
<T.AmbientLight intensity={1} />