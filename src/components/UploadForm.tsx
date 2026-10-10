"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { refreshCats } from "@/app/actions";
import { compressPhoto, formatKB, readPhotoMeta } from "@/lib/image";
import { BUCKET, supabase } from "@/lib/supabase";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-xl bg-border" />,
});

type Compressed = { full: File; thumb: File };
type LocationSource = "exif" | "gps" | "manual" | null;

const sourceLabel: Record<Exclude<LocationSource, null>, string> = {
  exif: "dari data foto",
  gps: "dari lokasi HP sekarang",
  manual: "dipilih manual",
};

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressed, setCompressed] = useState<Compressed | null>(null);
  const [takenAt, setTakenAt] = useState<Date | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [source, setSource] = useState<LocationSource>(null);
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function locateMe() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setSource("gps");
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setCompressed(null);
    setError(null);

    const meta = await readPhotoMeta(picked);
    setTakenAt(meta.takenAt);
    if (meta.lat != null && meta.lng != null) {
      setPosition([meta.lat, meta.lng]);
      setSource("exif");
    } else {
      // Many phones strip GPS on web upload; usually she's still near the cat.
      locateMe();
    }

    try {
      setCompressed(await compressPhoto(picked));
    } catch {
      setError("Gagal memproses foto. Coba foto lain.");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!compressed) return;
    const form = new FormData(e.currentTarget);
    const text = (key: string) => (form.get(key) as string).trim() || null;

    setError(null);
    setStatus("Mengupload foto…");
    const db = supabase();
    const id = crypto.randomUUID();
    const photoPath = `${id}.jpg`;
    const thumbPath = `${id}-thumb.jpg`;
    const storage = db.storage.from(BUCKET);
    const opts = { contentType: "image/jpeg", cacheControl: "31536000" };

    const uploads = await Promise.all([
      storage.upload(photoPath, compressed.full, opts),
      storage.upload(thumbPath, compressed.thumb, opts),
    ]);
    const uploadError = uploads.find((u) => u.error)?.error;
    if (uploadError) {
      await storage.remove([photoPath, thumbPath]);
      setStatus(null);
      return setError(`Upload gagal: ${uploadError.message}`);
    }

    setStatus("Menyimpan…");
    const { error: insertError } = await db.from("cats").insert({
      id,
      name: text("name"),
      area: text("area"),
      notes: text("notes"),
      lat: position?.[0] ?? null,
      lng: position?.[1] ?? null,
      taken_at: takenAt?.toISOString() ?? null,
      photo_path: photoPath,
      thumb_path: thumbPath,
    });
    if (insertError) {
      await storage.remove([photoPath, thumbPath]);
      setStatus(null);
      return setError(`Gagal menyimpan: ${insertError.message}`);
    }

    await refreshCats();
    router.push(`/cats/${id}`);
  }

  const busy = status !== null;

  return (
    <form onSubmit={onSubmit} className="space-y-4 px-4">
      <label className="block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img src={preview} alt="Preview" className="max-h-80 w-full object-contain" />
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted">
            <span className="text-4xl">📷</span>
            <span className="font-medium">Ambil atau pilih foto</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onPick} className="sr-only" />
      </label>

      {file && (
        <p className="text-xs text-muted">
          {compressed
            ? `Dikompres: ${formatKB(file.size)} → ${formatKB(compressed.full.size)}`
            : "Mengompres foto…"}
        </p>
      )}

      {file && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Lokasi{" "}
                {source && <span className="font-normal text-muted">({sourceLabel[source]})</span>}
              </span>
              <button
                type="button"
                onClick={locateMe}
                disabled={locating}
                className="text-accent disabled:opacity-50"
              >
                {locating ? "Mencari…" : "📍 Lokasi saya"}
              </button>
            </div>
            <LocationPicker
              value={position}
              onChange={(pos) => {
                setPosition(pos);
                setSource("manual");
              }}
            />
            {!position && (
              <p className="text-xs text-muted">Tap peta untuk menandai lokasi kucing.</p>
            )}
          </div>

          <Field name="name" label="Nama panggilan" placeholder="Oyen" />
          <Field name="area" label="Area" placeholder="Blok M, Kemang, GBK…" />
          <label className="block space-y-1">
            <span className="text-sm font-medium">Catatan</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Lagi tidur di depan warung…"
              className="w-full rounded-xl border border-border bg-card px-4 py-3"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={!compressed || busy}
            className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white disabled:opacity-50"
          >
            {status ?? "Simpan kucing 🐱"}
          </button>
        </>
      )}
    </form>
  );
}

function Field({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-4 py-3"
      />
    </label>
  );
}
