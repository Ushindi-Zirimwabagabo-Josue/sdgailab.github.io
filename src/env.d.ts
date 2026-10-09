/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SENTRY_DSN?: string;
  readonly PUBLIC_SENTRY_ENVIRONMENT?: string;
  /** Optional: error | warn | info | debug — controls DEV console verbosity */
  readonly PUBLIC_LOG_LEVEL?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'particles.js' {
  const particlesJs: Record<string, never>;
  export default particlesJs;
}

declare global {
  interface Window {
    particlesJS?: {
      load: (tagId: string, pathConfigJson: string, callback?: () => void) => void;
    };
  }
}

export {};
