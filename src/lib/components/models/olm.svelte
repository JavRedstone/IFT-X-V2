<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 C:\DuDu\Olympiads_School\Computer\Websites\IFT-X\IFT-X\static\models\olm.glb --root /models/ --types --printwidth 120 --precision 2
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
      Cylinder003_1: THREE.Mesh
      Cylinder003_2: THREE.Mesh
      Cylinder003_3: THREE.Mesh
    }
    materials: {
      ['Material.002']: THREE.MeshStandardMaterial
      ['Emissive.001']: THREE.MeshStandardMaterial
      Steel: THREE.MeshStandardMaterial
    }
  }

  const gltf = useGltf<GLTFResult>('/models/olm.glb')

  const component = forwardEventHandlers()
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Group position={[0, 3.4, 0]} scale={[1.6, 0.25, 1.6]}>
      <T.Mesh geometry={gltf.nodes.Cylinder003_1.geometry} material={gltf.materials['Material.002']} />
      <T.Mesh geometry={gltf.nodes.Cylinder003_2.geometry} material={gltf.materials['Emissive.001']} />
      <T.Mesh geometry={gltf.nodes.Cylinder003_3.geometry} material={gltf.materials.Steel} />
    </T.Group>
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
