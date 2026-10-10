import imageCompression from "browser-image-compression";
import exifr from "exifr";

export type PhotoMeta = {
  lat: number | null;
  lng: number | null;
  takenAt: Date | null;
};

// Read EXIF before compressing: re-encoding through canvas drops all metadata.
export async function readPhotoMeta(file: File): Promise<PhotoMeta> {
  const [gps, tags] = await Promise.all([
    exifr.gps(file).catch(() => undefined),
    exifr.parse(file, ["DateTimeOriginal"]).catch(() => undefined),
  ]);
  const takenAt = tags?.DateTimeOriginal;
  return {
    lat: gps?.latitude ?? null,
    lng: gps?.longitude ?? null,
    takenAt: takenAt instanceof Date ? takenAt : null,
  };
}

// Full photo ~400KB for the detail page, thumbnail ~60KB for grid and map.
export async function compressPhoto(file: File) {
  const [full, thumb] = await Promise.all([
    imageCompression(file, {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1600,
      fileType: "image/jpeg",
      initialQuality: 0.8,
      useWebWorker: true,
    }),
    imageCompression(file, {
      maxSizeMB: 0.06,
      maxWidthOrHeight: 480,
      fileType: "image/jpeg",
      initialQuality: 0.75,
      useWebWorker: true,
    }),
  ]);
  return { full, thumb };
}

export function formatKB(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}
