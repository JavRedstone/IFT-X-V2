<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 C:\DuDu\Olympiads_School\Computer\Websites\IFT-X\static\models\grid_fin.glb --root /models/ --types --printwidth 120 --precision 2
-->

<script lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, type Props, type Events, type Slots, forwardEventHandlers } from '@threlte/core'
  import { useGltf } from '@threlte/extras'

  type $$Props = Props<THREE.Group>
  type $$Events = Events<THREE.Group>
  type $$Slots = Slots<THREE.Group> & { fallback: {}; error: { error: any } }

  export const ref = new Group()

  type GLTFResult = {
    nodes: {
      Cylinder016: THREE.Mesh
      Cylinder016_1: THREE.Mesh
    }
    materials: {
      ['Material.005']: THREE.MeshStandardMaterial
      ['Material.006']: THREE.MeshStandardMaterial
    }
  }

  const gltf = useGltf<GLTFResult>('/models/grid_fin.glb')

  const component = forwardEventHandlers()
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Mesh geometry={gltf.nodes.Cylinder016.geometry} material={gltf.materials['Material.005']} />
    <T.Mesh geometry={gltf.nodes.Cylinder016_1.geometry} material={gltf.materials['Material.006']} />
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
