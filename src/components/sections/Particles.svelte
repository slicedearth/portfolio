<script lang="ts">
  import { onMount } from "svelte"
  import Particles, { initParticlesEngine } from "@tsparticles/svelte"
  import { loadBasic } from "@tsparticles/basic"
  import { loadImageShape } from "@tsparticles/shape-image"
  import { loadRotateUpdater } from "@tsparticles/updater-rotate"
  import { loadInteractivityPlugin } from "@tsparticles/plugin-interactivity"
  import { loadParticlesCollisionsInteraction } from "@tsparticles/interaction-particles-collisions"
  import { tsparticlesConfig } from "./tsparticles-config"

  let ready = $state(false)

  onMount(async () => {
    await initParticlesEngine(async engine => {
      await Promise.all([
        loadBasic(engine),
        loadImageShape(engine),
        loadRotateUpdater(engine),
        loadInteractivityPlugin(engine),
      ])
      await loadParticlesCollisionsInteraction(engine)
    })
    ready = true
  })
</script>

{#if ready}
  <Particles id="tsparticles" class="animate-fade-in absolute inset-0 -z-10" options={tsparticlesConfig} />
{/if}
