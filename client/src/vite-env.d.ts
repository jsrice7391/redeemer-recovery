/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_API_URL?: string;
  // Add more VITE_ prefixed env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
