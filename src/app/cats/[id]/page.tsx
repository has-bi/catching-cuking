import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DeleteCatButton from "@/components/DeleteCatButton";
import { getCat } from "@/lib/cats";
import { formatDate } from "@/lib/format";
import { publicUrl } from "@/lib/supabase";

export default function CatPage({ params }: PageProps<"/cats/[id]">) {
  return (
    <main>
      <Suspense fallback={<div className="aspect-[4/5] animate-pulse bg-border" />}>
        <CatDetail params={params} />
      </Suspense>
    </main>
  );
}

async function CatDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = await getCat(id);
  if (!cat) notFound();

  const date = cat.taken_at ?? cat.created_at;
  const hasLocation = cat.lat != null && cat.lng != null;

  return (
    <article>
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- already compressed */}
        <img
          src={publicUrl(cat.photo_path)}
          alt={cat.name ?? "Kucing"}
          className="max-h-[75dvh] w-full bg-black object-contain"
        />
        <Link
          href="/"
          aria-label="Kembali"
          className="absolute top-[calc(0.75rem+env(safe-area-inset-top))] left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-lg text-white"
        >
          ←
        </Link>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h1 className="text-2xl font-bold">{cat.name || "Kucing tanpa nama"}</h1>
          <p className="text-sm text-muted">
            {[cat.area, formatDate(date)].filter(Boolean).join(" · ")}
          </p>
        </div>

        {cat.notes && <p className="whitespace-pre-line">{cat.notes}</p>}

        {hasLocation && (
          <div className="flex gap-2">
            <Link
              href={`/map?cat=${cat.id}`}
              className="flex-1 rounded-xl border border-border bg-card py-2.5 text-center text-sm font-medium"
            >
              🗺️ Lihat di peta
            </Link>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${cat.lat},${cat.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl border border-border bg-card py-2.5 text-center text-sm font-medium"
            >
              📍 Google Maps
            </a>
          </div>
        )}

        <DeleteCatButton cat={cat} />
      </div>
    </article>
  );
}
