import type { SlicedEarthSceneController } from "../components/sections/sliced-earth-scene"

type Connection = EventTarget & { saveData?: boolean }

export const mountEarthLifecycle = (
  root: HTMLElement,
  button: HTMLButtonElement,
) => {
  let canvas = root.querySelector<HTMLCanvasElement>("[data-earth-canvas]")!
  const hero = root.closest<HTMLElement>(".hero-shell")!
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  const width = matchMedia("(min-width: 768px)")
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection
  let disposed = false
  let userStatic = false
  let failed = false
  let intersecting =
    hero.getBoundingClientRect().bottom > 0 &&
    hero.getBoundingClientRect().top < innerHeight
  let generation = 0
  let pending: AbortController | undefined
  let scene: SlicedEarthSceneController | undefined
  let handoff: number | undefined
  let motionFrame: number | undefined

  const layoutEligible = () =>
    width.matches && root.clientWidth / root.clientHeight >= 16 / 9
  const eligible = () =>
    !disposed &&
    !userStatic &&
    !motion.matches &&
    layoutEligible() &&
    !connection?.saveData
  const staticState = (state = "static") => {
    root.dataset.earthMotion = state
    root.dataset.earthHandoff = "static"
    delete root.dataset.earthReady
  }
  const stop = (state = "static") => {
    generation += 1
    staticState(state)
    const previousPending = pending
    const previousScene = scene
    pending = undefined
    scene = undefined
    canvas.removeEventListener("webglcontextlost", contextLost)
    previousPending?.abort()
    if (handoff !== undefined) cancelAnimationFrame(handoff)
    if (motionFrame !== undefined) cancelAnimationFrame(motionFrame)
    handoff = motionFrame = undefined
    previousScene?.dispose()
    if (previousPending || previousScene) {
      const replacement = canvas.cloneNode(false) as HTMLCanvasElement
      canvas.replaceWith(replacement)
      canvas = replacement
    }
    if (!disposed) canvas.addEventListener("webglcontextlost", contextLost)
  }
  const updateButton = () => {
    button.hidden =
      failed ||
      !layoutEligible() ||
      motion.matches ||
      connection?.saveData === true
    button.textContent = userStatic ? "Animate globe" : "Static view"
    button.setAttribute("aria-pressed", String(userStatic))
  }
  const fail = () => {
    failed = true
    stop("unavailable")
    updateButton()
  }
  const start = async () => {
    const token = ++generation
    const abort = new AbortController()
    pending = abort
    root.dataset.earthMotion = "loading"
    root.dataset.earthHandoff = "pending"
    const timeout = setTimeout(() => {
      if (token === generation && !disposed) fail()
    }, 12_000)
    try {
      const { mountSlicedEarthScene } =
        await import("../components/sections/sliced-earth-scene")
      if (
        abort.signal.aborted ||
        !eligible() ||
        token !== generation ||
        !root.isConnected
      )
        return
      const mounted = await mountSlicedEarthScene({
        canvas,
        root,
        pointerTarget: hero,
        signal: abort.signal,
      })
      if (
        abort.signal.aborted ||
        !eligible() ||
        token !== generation ||
        !root.isConnected
      ) {
        mounted.dispose()
        return
      }
      pending = undefined
      scene = mounted
      root.dataset.earthMotion = "paused"
      root.dataset.earthReady = "true"
      // The poster stays visible until the scene has rendered successfully.
      handoff = requestAnimationFrame(() => {
        if (!eligible() || token !== generation) return
        root.dataset.earthHandoff = "complete"
        motionFrame = requestAnimationFrame(() => {
          if (!eligible() || token !== generation) return
          scene?.startMotion()
          root.dataset.earthMotion = "running"
        })
      })
    } catch (error) {
      if (!abort.signal.aborted && token === generation && !disposed) {
        console.warn(
          "Optional globe unavailable; retaining the static image.",
          error,
        )
        fail()
      }
    } finally {
      clearTimeout(timeout)
    }
  }
  const sync = () => {
    if (disposed) return
    updateButton()
    if (!eligible()) {
      stop(failed ? "unavailable" : "static")
      return
    }
    if (
      !failed &&
      !pending &&
      !scene &&
      intersecting &&
      document.visibilityState === "visible"
    )
      void start()
  }
  const toggle = () => {
    userStatic = !userStatic
    sync()
  }
  const contextLost = (event: Event) => {
    if (disposed || failed || (!scene && !pending)) return
    event.preventDefault()
    // No automatic retry: a lost context retains the poster until a fresh visit.
    fail()
  }
  const intersection = new IntersectionObserver(
    entries => {
      intersecting = entries.some(entry => entry.isIntersecting)
      sync()
    },
    { threshold: 0.01 },
  )
  const resize = new ResizeObserver(sync)
  motion.addEventListener("change", sync)
  width.addEventListener("change", sync)
  connection?.addEventListener("change", sync)
  button.addEventListener("click", toggle)
  canvas.addEventListener("webglcontextlost", contextLost)
  document.addEventListener("visibilitychange", sync)
  intersection.observe(hero)
  resize.observe(root)
  staticState()
  sync()

  return () => {
    if (disposed) return
    disposed = true
    stop("disposed")
    motion.removeEventListener("change", sync)
    width.removeEventListener("change", sync)
    connection?.removeEventListener("change", sync)
    button.removeEventListener("click", toggle)
    canvas.removeEventListener("webglcontextlost", contextLost)
    document.removeEventListener("visibilitychange", sync)
    intersection.disconnect()
    resize.disconnect()
  }
}
