import { cacheLife, cacheTag } from "next/cache";
import { isConfigured, supabase } from "./supabase";
import type { Cat } from "./types";

export const CATS_TAG = "cats";

export async function getCats(): Promise<Cat[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATS_TAG);

  if (!isConfigured) return [];
  const { data, error } = await supabase()
    .from("cats")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    // Don't fail the build or the whole page when the DB is unreachable or the
    // schema isn't set up yet; show an empty gallery and leave a trace in the logs.
    console.error("getCats failed:", error.message);
    return [];
  }
  return data;
}

export async function getCat(id: string): Promise<Cat | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATS_TAG);

  if (!isConfigured) return null;
  const { data, error } = await supabase()
    .from("cats")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
