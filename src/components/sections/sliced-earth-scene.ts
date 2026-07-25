import {
  ACESFilmicToneMapping,
  AmbientLight,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  LinearFilter,
  Line,
  LineDashedMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three"
import reliefUrl from "../../assets/brand/earth-relief.webp?url"
import surfaceUrl from "../../assets/brand/earth-surface.webp?url"

type MountOptions = {
  canvas: HTMLCanvasElement
  root: HTMLElement
  onReady: () => void
}

type GlobeBand = {
  baseOffset: number
  group: Group
  thetaEnd: number
  thetaStart: number
}

type RoutePulse = {
  curve: CatmullRomCurve3
  mesh: Mesh<SphereGeometry, MeshBasicMaterial>
  phase: number
  speed: number
}

type RoutePulseOptions = {
  geometry: SphereGeometry
  material: MeshBasicMaterial
  phase: number
}

type Location = {
  latitude: number
  longitude: number
}

const globeRadius = 2.18
const posterAspectRatio = 16 / 9
const accent = 0x5eead4
const bandDefinitions = [
  { latitudeTop: 90, latitudeBottom: 25, offset: 0.3 },
  { latitudeTop: 25, latitudeBottom: -50, offset: 0 },
  { latitudeTop: -50, latitudeBottom: -90, offset: -0.24 },
]

const activeRoutes: Array<[Location, Location]> = [
  [
    { latitude: -37.81, longitude: 144.96 },
    { latitude: 1.35, longitude: 103.82 },
  ],
  [
    { latitude: 1.35, longitude: 103.82 },
    { latitude: 19.08, longitude: 72.88 },
  ],
  [
    { latitude: 1.35, longitude: 103.82 },
    { latitude: 14.72, longitude: -17.47 },
  ],
  [
    { latitude: 14.6, longitude: 120.98 },
    { latitude: -12.05, longitude: -77.04 },
  ],
  [
    { latitude: 35.68, longitude: 139.65 },
    { latitude: 52.52, longitude: 13.41 },
  ],
  [
    { latitude: -37.81, longitude: 144.96 },
    { latitude: -33.87, longitude: 151.21 },
  ],
  [
    { latitude: 37.77, longitude: -122.42 },
    { latitude: 40.71, longitude: -74.01 },
  ],
  [
    { latitude: 40.71, longitude: -74.01 },
    { latitude: 51.51, longitude: -0.13 },
  ],
  [
    { latitude: 19.43, longitude: -99.13 },
    { latitude: 4.71, longitude: -74.07 },
  ],
  [
    { latitude: 4.71, longitude: -74.07 },
    { latitude: -23.55, longitude: -46.63 },
  ],
  [
    { latitude: -23.55, longitude: -46.63 },
    { latitude: -33.92, longitude: 18.42 },
  ],
  [
    { latitude: -33.92, longitude: 18.42 },
    { latitude: -1.29, longitude: 36.82 },
  ],
]

const blockedRoutes: Array<[Location, Location]> = [
  [
    { latitude: -37.81, longitude: 144.96 },
    { latitude: 35.68, longitude: 139.65 },
  ],
  [
    { latitude: 1.35, longitude: 103.82 },
    { latitude: 39.9, longitude: 116.41 },
  ],
  [
    { latitude: 51.51, longitude: -0.13 },
    { latitude: -33.92, longitude: 18.42 },
  ],
]

const latitudeToTheta = (latitude: number) => MathUtils.degToRad(90 - latitude)

const restoreGlobalLatitudeUv = (geometry: SphereGeometry) => {
  const positions = geometry.getAttribute("position")
  const uvs = geometry.getAttribute("uv")

  for (let index = 0; index < positions.count; index += 1) {
    const latitudeTheta = Math.acos(
      MathUtils.clamp(positions.getY(index) / globeRadius, -1, 1),
    )
    uvs.setY(index, 1 - latitudeTheta / Math.PI)
  }

  uvs.needsUpdate = true
  return geometry
}

const locationVector = (
  { latitude, longitude }: Location,
  radius = globeRadius,
) => {
  const phi = latitudeToTheta(latitude)
  const theta = MathUtils.degToRad(longitude + 180)

  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

const bandForPoint = (point: Vector3, bands: GlobeBand[]) => {
  const theta = Math.acos(MathUtils.clamp(point.y / point.length(), -1, 1))
  return bands.find(
    band => theta >= band.thetaStart - 0.001 && theta <= band.thetaEnd + 0.001,
  )
}

const createCoreTexture = () => {
  const size = 640
  const centre = size / 2
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Unable to create slicedearth core texture.")
  }

  const gradient = context.createRadialGradient(
    centre,
    centre,
    0,
    centre,
    centre,
    centre,
  )
  gradient.addColorStop(0, "#78909a")
  gradient.addColorStop(0.12, "#617982")
  gradient.addColorStop(0.125, "#18252d")
  gradient.addColorStop(0.31, "#334952")
  gradient.addColorStop(0.32, "#101a21")
  gradient.addColorStop(0.55, "#263941")
  gradient.addColorStop(0.565, "#111c23")
  gradient.addColorStop(0.78, "#1d3038")
  gradient.addColorStop(0.795, "#0c151b")
  gradient.addColorStop(1, "#263b43")

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  context.globalCompositeOperation = "soft-light"
  for (let index = 0; index < 1800; index += 1) {
    const angle = index * 2.399963
    const radius = Math.sqrt(index / 1800) * centre
    const x = centre + Math.cos(angle) * radius
    const y = centre + Math.sin(angle) * radius
    const light = index % 7 === 0
    context.fillStyle = light
      ? "rgba(196, 217, 222, 0.09)"
      : "rgba(4, 10, 14, 0.12)"
    context.fillRect(x, y, 1, 1)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  return texture
}

const createCap = (
  radius: number,
  y: number,
  facesUp: boolean,
  material: MeshStandardMaterial,
  edgeMaterial: MeshStandardMaterial,
) => {
  const group = new Group()
  const cap = new Mesh(new CircleGeometry(radius, 128), material)
  cap.rotation.x = facesUp ? -Math.PI / 2 : Math.PI / 2
  cap.position.y = y
  group.add(cap)

  if (radius > 0.08) {
    const edge = new Mesh(
      new TorusGeometry(radius, 0.016, 8, 128),
      edgeMaterial,
    )
    edge.rotation.x = Math.PI / 2
    edge.position.y = y
    group.add(edge)
  }

  return group
}

const createRoutePoints = (start: Location, end: Location) => {
  const startVector = locationVector(start, 1).normalize()
  const endVector = locationVector(end, 1).normalize()
  const axis = startVector.clone().cross(endVector).normalize()
  const angle = Math.acos(MathUtils.clamp(startVector.dot(endVector), -1, 1))

  return Array.from({ length: 97 }, (_, index) =>
    startVector
      .clone()
      .applyAxisAngle(axis, angle * (index / 96))
      .multiplyScalar(globeRadius + 0.028),
  )
}

const routeProgress = (cycle: number) => {
  const wrapped = ((cycle % 2) + 2) % 2
  const pingPong = wrapped <= 1 ? wrapped : 2 - wrapped
  return MathUtils.smoothstep(pingPong, 0, 1)
}

const addBlockedRoute = (
  start: Location,
  end: Location,
  bands: GlobeBand[],
  material: LineDashedMaterial,
) => {
  const points = createRoutePoints(start, end)
  let activeBand: GlobeBand | undefined
  let activePoints: Vector3[] = []

  const commit = () => {
    if (!activeBand || activePoints.length < 2) return

    const line = new Line(
      new BufferGeometry().setFromPoints(activePoints),
      material,
    )
    line.computeLineDistances()
    activeBand.group.add(line)
  }

  for (const point of points) {
    const pointBand = bandForPoint(point, bands)

    if (pointBand !== activeBand) {
      commit()
      activeBand = pointBand
      activePoints = []
    }

    if (pointBand) activePoints.push(point)
  }

  commit()
}

const addRoute = (
  start: Location,
  end: Location,
  bands: GlobeBand[],
  material: MeshBasicMaterial,
  pulseOptions: RoutePulseOptions,
): RoutePulse | undefined => {
  const points = createRoutePoints(start, end)
  const segments: Array<{
    band: GlobeBand
    curve: CatmullRomCurve3
    length: number
  }> = []
  let activeBand: GlobeBand | undefined
  let activePoints: Vector3[] = []

  const commit = () => {
    if (!activeBand || activePoints.length < 2) return

    const curve = new CatmullRomCurve3(activePoints)
    const geometry = new TubeGeometry(
      curve,
      Math.max(activePoints.length * 2, 12),
      0.007,
      5,
      false,
    )
    activeBand.group.add(new Mesh(geometry, material))
    segments.push({
      band: activeBand,
      curve,
      length: curve.getLength(),
    })
  }

  for (const point of points) {
    const pointBand = bandForPoint(point, bands)

    if (pointBand !== activeBand) {
      commit()
      activeBand = pointBand
      activePoints = []
    }

    if (pointBand) activePoints.push(point)
  }

  commit()

  const pulseSegment = segments.reduce<(typeof segments)[number] | undefined>(
    (longest, segment) =>
      !longest || segment.length > longest.length ? segment : longest,
    undefined,
  )

  if (!pulseSegment) return

  const pulse = new Mesh(pulseOptions.geometry, pulseOptions.material)
  pulse.position.copy(
    pulseSegment.curve.getPointAt(routeProgress(pulseOptions.phase * 2)),
  )
  pulseSegment.band.group.add(pulse)

  return {
    curve: pulseSegment.curve,
    mesh: pulse,
    phase: pulseOptions.phase,
    speed: 0.82 + pulseOptions.phase * 0.28,
  } satisfies RoutePulse
}

const disposeMaterial = (
  material: LineDashedMaterial | MeshBasicMaterial | MeshStandardMaterial,
) => {
  for (const value of Object.values(material)) {
    if (value instanceof Texture) value.dispose()
  }
  material.dispose()
}

export const mountSlicedEarthScene = async ({
  canvas,
  root,
  onReady,
}: MountOptions) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "high-performance",
  })
  renderer.setClearColor(0x070a0e, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.94
  const renderPixelRatio = Math.min(Math.max(window.devicePixelRatio, 1.5), 2)
  renderer.setPixelRatio(renderPixelRatio)

  const scene = new Scene()
  const camera = new PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 1.8, 9.2)

  scene.add(new AmbientLight(0x668090, 0.38))
  scene.add(new HemisphereLight(0x9fc9dd, 0x05080c, 1.55))

  const keyLight = new DirectionalLight(0xd7f5ff, 3.4)
  keyLight.position.set(-3.5, 4.5, 6.2)
  scene.add(keyLight)

  const rimLight = new DirectionalLight(0x4b9bb7, 2.1)
  rimLight.position.set(5, -1.5, -2.5)
  scene.add(rimLight)

  const textureLoader = new TextureLoader()
  const [surfaceTexture, reliefTexture] = await Promise.all([
    textureLoader.loadAsync(surfaceUrl),
    textureLoader.loadAsync(reliefUrl),
  ])
  surfaceTexture.colorSpace = SRGBColorSpace

  for (const texture of [surfaceTexture, reliefTexture]) {
    texture.wrapS = RepeatWrapping
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)
  }

  const surfaceMaterial = new MeshStandardMaterial({
    bumpMap: reliefTexture,
    bumpScale: 0.026,
    map: surfaceTexture,
    metalness: 0.02,
    roughness: 0.93,
  })
  const coreTexture = createCoreTexture()
  const strataMaterial = new MeshStandardMaterial({
    emissive: new Color(0x0b151b),
    emissiveIntensity: 0.36,
    map: coreTexture,
    metalness: 0,
    roughness: 1,
    side: DoubleSide,
  })
  const edgeMaterial = new MeshStandardMaterial({
    color: new Color(0x243842),
    metalness: 0,
    roughness: 0.96,
  })
  const routeMaterial = new MeshBasicMaterial({
    color: accent,
    opacity: 0.5,
    transparent: true,
  })
  const blockedRouteMaterial = new LineDashedMaterial({
    color: accent,
    dashSize: 0.035,
    depthWrite: false,
    gapSize: 0.045,
    opacity: 0.22,
    transparent: true,
  })
  const nodeGeometry = new SphereGeometry(0.034, 12, 8)
  const nodeMaterial = new MeshBasicMaterial({ color: accent })

  const model = new Group()
  const axisTilt = new Group()
  const globe = new Group()
  model.add(axisTilt)
  axisTilt.add(globe)
  scene.add(model)

  const bands: GlobeBand[] = bandDefinitions.map(definition => {
    const thetaStart = latitudeToTheta(definition.latitudeTop)
    const thetaEnd = latitudeToTheta(definition.latitudeBottom)
    const band = new Group()
    band.position.y = definition.offset

    const surfaceGeometry = restoreGlobalLatitudeUv(
      new SphereGeometry(
        globeRadius,
        128,
        72,
        0,
        Math.PI * 2,
        thetaStart,
        thetaEnd - thetaStart,
      ),
    )
    const surface = new Mesh(surfaceGeometry, surfaceMaterial)
    band.add(surface)

    if (thetaStart > 0.001) {
      const radius = globeRadius * Math.sin(thetaStart)
      const y = globeRadius * Math.cos(thetaStart)
      band.add(createCap(radius, y, true, strataMaterial, edgeMaterial))
    }

    if (thetaEnd < Math.PI - 0.001) {
      const radius = globeRadius * Math.sin(thetaEnd)
      const y = globeRadius * Math.cos(thetaEnd)
      band.add(createCap(radius, y, false, strataMaterial, edgeMaterial))
    }

    globe.add(band)
    return {
      baseOffset: definition.offset,
      group: band,
      thetaEnd,
      thetaStart,
    }
  })

  for (const [start, end] of blockedRoutes) {
    addBlockedRoute(start, end, bands, blockedRouteMaterial)
  }

  const routePulses = activeRoutes
    .map(([start, end], index) =>
      addRoute(start, end, bands, routeMaterial, {
        geometry: nodeGeometry,
        material: nodeMaterial,
        phase: index / activeRoutes.length,
      }),
    )
    .filter((pulse): pulse is RoutePulse => pulse !== undefined)

  const baseRotation = MathUtils.degToRad(139)
  const axialTilt = -MathUtils.degToRad(23.44)
  axisTilt.rotation.set(0.035, 0, axialTilt)
  globe.rotation.set(0, baseRotation, 0)

  let pointerX = 0
  let pointerY = 0
  let targetPointerX = 0
  let targetPointerY = 0
  let disposed = false
  let frame = 0
  let visible = true
  let lastRender = 0
  // The canvas begins moving beneath the aligned poster during the crossfade.
  const sceneStartTime = performance.now()

  const resize = () => {
    const width = root.clientWidth
    const height = root.clientHeight
    if (width === 0 || height === 0) return

    renderer.setSize(width, height, false)

    const rootAspectRatio = width / height
    const viewportWidth =
      rootAspectRatio >= posterAspectRatio ? height * posterAspectRatio : width
    const viewportHeight =
      rootAspectRatio >= posterAspectRatio ? height : width / posterAspectRatio
    const viewportX = (width - viewportWidth) / 2
    const viewportY = (height - viewportHeight) / 2

    renderer.setScissorTest(false)
    renderer.clear()
    renderer.setViewport(viewportX, viewportY, viewportWidth, viewportHeight)
    renderer.setScissor(viewportX, viewportY, viewportWidth, viewportHeight)
    renderer.setScissorTest(true)

    camera.aspect = posterAspectRatio
    camera.updateProjectionMatrix()

    model.position.set(2.15, -0.24, 0)
    model.scale.setScalar(1.02)

    camera.lookAt(model.position.x * 0.16, -0.16, 0)
  }

  const render = (time: number) => {
    if (disposed) return
    frame = window.requestAnimationFrame(render)
    if (!visible || time - lastRender < 32) return
    lastRender = time
    const elapsed = Math.max(0, time - sceneStartTime)

    pointerX += (targetPointerX - pointerX) * 0.045
    pointerY += (targetPointerY - pointerY) * 0.045
    globe.rotation.y = baseRotation + elapsed * 0.000011 + pointerX * 0.055
    axisTilt.rotation.x = 0.035 + pointerY * 0.025

    const sliceSeparation = Math.sin(elapsed * 0.00045) * 0.03
    for (const [index, band] of bands.entries()) {
      const direction = index === 0 ? 1 : index === 2 ? -1 : 0
      band.group.position.x = pointerX * direction * 0.035
      band.group.position.y =
        band.baseOffset + direction * (sliceSeparation + pointerY * 0.024)
    }

    for (const pulse of routePulses) {
      const cycle = elapsed * 0.00005 * pulse.speed + pulse.phase * 2
      const progress = routeProgress(cycle)
      const fade = Math.sin(progress * Math.PI)
      pulse.mesh.position.copy(pulse.curve.getPointAt(progress))
      pulse.mesh.scale.setScalar(0.78 + fade * 0.32)
    }

    renderer.render(scene, camera)
  }

  const onPointerMove = (event: PointerEvent) => {
    const bounds = root.getBoundingClientRect()
    targetPointerX = (event.clientX - bounds.left) / bounds.width - 0.5
    targetPointerY = (event.clientY - bounds.top) / bounds.height - 0.5
  }

  const onPointerLeave = () => {
    targetPointerX = 0
    targetPointerY = 0
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(root)

  const intersectionObserver = new IntersectionObserver(
    entries => {
      visible = entries.some(entry => entry.isIntersecting)
    },
    { threshold: 0.01 },
  )
  intersectionObserver.observe(root)

  root.addEventListener("pointermove", onPointerMove)
  root.addEventListener("pointerleave", onPointerLeave)

  resize()
  renderer.render(scene, camera)
  window.requestAnimationFrame(onReady)
  frame = window.requestAnimationFrame(render)

  return () => {
    disposed = true
    window.cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    root.removeEventListener("pointermove", onPointerMove)
    root.removeEventListener("pointerleave", onPointerLeave)

    scene.traverse(object => {
      if (!(object instanceof Line) && !(object instanceof Mesh)) return
      object.geometry.dispose()
      if (Array.isArray(object.material)) {
        object.material.forEach(disposeMaterial)
      } else {
        disposeMaterial(object.material)
      }
    })

    renderer.dispose()
    renderer.forceContextLoss()
  }
}
