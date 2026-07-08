/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_TRACKING_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
