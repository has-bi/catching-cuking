"use client";

import Link from "next/link";
import Header from "@/components/Header";
import UploadForm from "@/components/UploadForm";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const session = useSession();

  return (
    <main>
      <Header title="Tambah Kucing 📷" />
      {session === undefined && <p className="px-4 text-muted">Memuat…</p>}
      {session === null && (
        <div className="px-4 py-12 text-center">
          <p className="text-muted">Hanya Nadya yang bisa menambah foto.</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-white"
          >
            Masuk
          </Link>
        </div>
      )}
      {session && (
        <>
          <UploadForm />
          <button
            onClick={() => supabase().auth.signOut()}
            className="mx-auto mt-6 block text-sm text-muted underline"
          >
            Keluar
          </button>
        </>
      )}
    </main>
  );
}
