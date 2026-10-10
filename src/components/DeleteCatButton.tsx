"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { refreshCats } from "@/app/actions";
import { useSession } from "@/lib/session";
import { BUCKET, supabase } from "@/lib/supabase";
import type { Cat } from "@/lib/types";

// Only rendered for Nadya (signed in). RLS blocks deletes from anyone else anyway.
export default function DeleteCatButton({ cat }: { cat: Cat }) {
  const session = useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!session) return null;

  async function onDelete() {
    if (!confirm(`Hapus ${cat.name || "kucing ini"}?`)) return;
    setBusy(true);
    const db = supabase();
    const { error } = await db.from("cats").delete().eq("id", cat.id);
    if (error) {
      alert(`Gagal menghapus: ${error.message}`);
      setBusy(false);
      return;
    }
    await db.storage.from(BUCKET).remove([cat.photo_path, cat.thumb_path]);
    await refreshCats();
    router.replace("/");
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="w-full rounded-xl py-2.5 text-sm font-medium text-red-600 disabled:opacity-50"
    >
      {busy ? "Menghapus…" : "Hapus foto ini"}
    </button>
  );
}
