/**
 * Returns the base URL for all API calls.
 * - On Vercel (separate deployments): set VITE_API_URL to the backend's Vercel URL,
 *   e.g. https://requisor-ai-api-server.vercel.app
 * - In local dev / Replit: falls back to relative "/api" (same-origin proxy)
 */
export const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "") + "/api";
