"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError("Email atau password salah.");
    router.replace("/upload");
  }

  return (
    <main>
      <Header title="Masuk" subtitle="Khusus Nadya untuk menambah foto" />
      <form onSubmit={onSubmit} className="space-y-3 px-4">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-xl bg-accent py-3 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Masuk…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
