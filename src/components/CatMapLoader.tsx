"use client";

import dynamic from "next/dynamic";
import type { Cat } from "@/lib/types";

// Leaflet touches `window`, so it can only render in the browser.
const CatMap = dynamic(() => import("./CatMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-border" />,
});

export default function CatMapLoader({ cats }: { cats: Cat[] }) {
  return <CatMap cats={cats} />;
}
