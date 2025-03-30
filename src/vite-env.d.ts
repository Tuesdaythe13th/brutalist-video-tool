
/// <reference types="vite/client" />
/// <reference path="./types/custom-elements.d.ts" />

// Add environment variable type support even though we're not using it in the browser
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
