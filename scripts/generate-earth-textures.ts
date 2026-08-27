import { readFile } from "node:fs/promises"
import sharp from "sharp"

type Position = [longitude: number, latitude: number]
type LinearRing = Position[]
type LandGeometry =
  | { type: "Polygon"; coordinates: LinearRing[] }
  | { type: "MultiPolygon"; coordinates: LinearRing[][] }

type LandCollection = {
  features: Array<{ geometry: LandGeometry }>
}

const width = 2048
const height = 1024
const reliefWidth = 1024
const reliefHeight = 512
const dataPath = "src/assets/data/natural-earth-land-110m.json"
const surfacePath = "src/assets/brand/earth-surface.webp"
const reliefPath = "src/assets/brand/earth-relief.webp"

const land = JSON.parse(await readFile(dataPath, "utf8")) as LandCollection

const point = ([longitude, latitude]: Position) => [
  ((longitude + 180) / 360) * width,
  ((90 - latitude) / 180) * height,
]

const ringPath = (ring: LinearRing) =>
  ring
    .map((coordinate, index) => {
      const [x, y] = point(coordinate)
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ") + " Z"

const geometryPath = (geometry: LandGeometry) => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map(ringPath).join(" ")
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flatMap(polygon => polygon.map(ringPath))
      .join(" ")
  }

  throw new Error("Unsupported Natural Earth geometry.")
}

const landPaths = land.features
  .map(
    feature =>
      `<path d="${geometryPath(feature.geometry)}" fill-rule="evenodd"/>`,
  )
  .join("")

const longitudeLines = Array.from(
  { length: 11 },
  (_, index) => ((index + 1) * width) / 12,
)
  .map(
    x =>
      `<path d="M${x.toFixed(2)} 0V${height}" vector-effect="non-scaling-stroke"/>`,
  )
  .join("")

const latitudeLines = Array.from(
  { length: 5 },
  (_, index) => ((index + 1) * height) / 6,
)
  .map(
    y =>
      `<path d="M0 ${y.toFixed(2)}H${width}" vector-effect="non-scaling-stroke"/>`,
  )
  .join("")

const surface = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#081722"/>
        <stop offset="0.52" stop-color="#0d2635"/>
        <stop offset="1" stop-color="#07131d"/>
      </linearGradient>
      <filter id="surface-grain" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="27" result="noise"/>
        <feColorMatrix in="noise" type="saturate" values="0" result="mono"/>
        <feComponentTransfer in="mono" result="grain">
          <feFuncA type="table" tableValues="0 0.11"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="grain" mode="soft-light"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#ocean)"/>
    <g fill="none" stroke="#62a3b0" stroke-opacity="0.16" stroke-width="1">
      ${longitudeLines}
      ${latitudeLines}
    </g>
    <g fill="#354d53" stroke="#77bdc5" stroke-opacity="0.52" stroke-width="1.25" filter="url(#surface-grain)">
      ${landPaths}
    </g>
  </svg>
`)

const relief = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <filter id="relief" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045 0.08" numOctaves="4" seed="41" result="noise"/>
        <feComposite in="noise" in2="SourceGraphic" operator="in" result="land-noise"/>
        <feBlend in="SourceGraphic" in2="land-noise" mode="multiply"/>
        <feGaussianBlur stdDeviation="0.7"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="#686868"/>
    <g fill="#b8b8b8" filter="url(#relief)">
      ${landPaths}
    </g>
  </svg>
`)

await Promise.all([
  sharp(surface).webp({ quality: 88, effort: 6 }).toFile(surfacePath),
  sharp(relief)
    .resize(reliefWidth, reliefHeight)
    .greyscale()
    .webp({ quality: 82, effort: 6 })
    .toFile(reliefPath),
])

console.log(`Generated ${surfacePath} and ${reliefPath} from Natural Earth.`)
