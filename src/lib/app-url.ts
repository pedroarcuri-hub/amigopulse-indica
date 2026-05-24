// Official URL of this app (Indica). Used for auth redirects (reset password,
// email confirmation, etc.). The Supabase backend is shared between Pulse,
// Club, Premia and Indica — each app must provide its own VITE_APP_URL so
// redirects always come back to the right domain.
//
// In production: VITE_APP_URL=https://indica.amigotech.com.br
// In dev/preview: falls back to window.location.origin so previews keep working.
export const APP_URL: string =
  (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

// Program name (in public.programs.name) that this app represents.
export const INDICA_PROGRAM_NAME: string =
  (import.meta.env.VITE_INDICA_PROGRAM_NAME as string | undefined) || "indica";
