"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { formatDate } from "@/lib/format";
import { publicUrl } from "@/lib/supabase";
import { JAKARTA, type Cat } from "@/lib/types";

function photoIcon(cat: Cat) {
  return L.divIcon({
    className: "cat-marker",
    html: `<img src="${publicUrl(cat.thumb_path)}" alt="" loading="lazy" />`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
}

export default function CatMap({ cats }: { cats: Cat[] }) {
  const focusId = useSearchParams().get("cat");
  const focus = cats.find((c) => c.id === focusId);

  return (
    <MapContainer
      center={focus ? [focus.lat!, focus.lng!] : JAKARTA}
      zoom={focus ? 17 : 12}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cats.map((cat) => (
        <Marker key={cat.id} position={[cat.lat!, cat.lng!]} icon={photoIcon(cat)}>
          <Popup>
            <Link href={`/cats/${cat.id}`} className="block w-40 text-inherit!">
              {/* eslint-disable-next-line @next/next/no-img-element -- already compressed */}
              <img
                src={publicUrl(cat.thumb_path)}
                alt={cat.name ?? "Kucing"}
                className="aspect-square w-full rounded-md object-cover"
              />
              <strong className="mt-1 block">{cat.name || "Kucing tanpa nama"}</strong>
              <span className="text-xs opacity-70">
                {[cat.area, formatDate(cat.taken_at ?? cat.created_at)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
