import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// The Vercel ↔ Supabase integration may set either name.
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const BUCKET = "cat-photos";

export const isConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

// One client for browser and server. Data is public-read (RLS), and writes
// only happen in the browser with Nadya's session, so no cookie handling needed.
export function supabase(): SupabaseClient {
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and fill it in.",
    );
  }
  client ??= createClient(url, key);
  return client;
}

export function publicUrl(path: string): string {
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}
