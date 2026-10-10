import { isConfigured } from "@/lib/supabase";

export default function SetupNotice() {
  if (isConfigured) return null;
  return (
    <div className="mx-4 mb-4 rounded-xl border border-border bg-accent-soft p-3 text-sm">
      Supabase belum di-setup. Copy <code>.env.example</code> ke{" "}
      <code>.env.local</code> lalu isi URL dan key-nya. Lihat README.
    </div>
  );
}
