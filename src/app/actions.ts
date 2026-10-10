"use server";

import { updateTag } from "next/cache";
import { CATS_TAG } from "@/lib/cats";

// Called after an upload or delete so the gallery and map show it right away.
export async function refreshCats() {
  updateTag(CATS_TAG);
}
