"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { JAKARTA } from "@/lib/types";

const pin = L.divIcon({
  className: "pin-marker",
  html: "📍",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

type Props = {
  value: [number, number] | null;
  onChange: (pos: [number, number]) => void;
};

// Tap the map or drag the pin to fix the location when GPS is off.
export default function LocationPicker({ value, onChange }: Props) {
  return (
    <MapContainer
      center={value ?? JAKARTA}
      zoom={value ? 17 : 11}
      className="h-56 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPlace onChange={onChange} />
      <FollowValue value={value} />
      {value && (
        <Marker
          position={value}
          icon={pin}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = (e.target as L.Marker).getLatLng();
              onChange([lat, lng]);
            },
          }}
        />
      )}
    </MapContainer>
  );
}

function ClickToPlace({ onChange }: Pick<Props, "onChange">) {
  useMapEvents({ click: (e) => onChange([e.latlng.lat, e.latlng.lng]) });
  return null;
}

function FollowValue({ value }: Pick<Props, "value">) {
  const map = useMap();
  useEffect(() => {
    if (value) map.setView(value, Math.max(map.getZoom(), 16));
  }, [map, value]);
  return null;
}
