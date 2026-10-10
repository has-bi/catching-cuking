import { Suspense } from "react";
import CatMapLoader from "@/components/CatMapLoader";
import { getCats } from "@/lib/cats";

export const metadata = { title: "Peta · Kucing Jakarta" };

export default function MapPage() {
  return (
    <main className="h-[calc(100dvh-4rem-env(safe-area-inset-bottom))]">
      <Suspense fallback={<MapSkeleton />}>
        <MapWithCats />
      </Suspense>
    </main>
  );
}

async function MapWithCats() {
  const cats = await getCats();
  return <CatMapLoader cats={cats.filter((c) => c.lat != null && c.lng != null)} />;
}

function MapSkeleton() {
  return <div className="h-full w-full animate-pulse bg-border" />;
}
