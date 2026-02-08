/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VALID_TOKENS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
