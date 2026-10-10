import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import SetupNotice from "@/components/SetupNotice";
import { getCats } from "@/lib/cats";
import { publicUrl } from "@/lib/supabase";

export default function GalleryPage() {
  return (
    <main>
      <Header title="Kucing Jakarta 🐾" subtitle="Koleksi kucing yang Nadya temui" />
      <SetupNotice />
      <Suspense fallback={<GridSkeleton />}>
        <CatGrid />
      </Suspense>
    </main>
  );
}

async function CatGrid() {
  const cats = await getCats();

  if (cats.length === 0) {
    return (
      <div className="px-4 py-16 text-center text-muted">
        <p className="text-5xl">🐈</p>
        <p className="mt-3">Belum ada kucing. Ketemu kucing hari ini?</p>
        <Link
          href="/upload"
          className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-white"
        >
          Tambah foto pertama
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="px-4 pb-2 text-sm text-muted">{cats.length} kucing</p>
      <ul className="grid grid-cols-3 gap-0.5">
        {cats.map((cat) => (
          <li key={cat.id}>
            <Link href={`/cats/${cat.id}`} className="relative block aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element -- already compressed thumbnails */}
              <img
                src={publicUrl(cat.thumb_path)}
                alt={cat.name ?? "Kucing"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {cat.name && (
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 px-1.5 pt-4 pb-1 text-xs font-medium text-white">
                  {cat.name}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-3 gap-0.5">
      {Array.from({ length: 9 }, (_, i) => (
        <li key={i} className="aspect-square animate-pulse bg-border" />
      ))}
    </ul>
  );
}
