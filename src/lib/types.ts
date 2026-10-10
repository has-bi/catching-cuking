export type Cat = {
  id: string;
  created_at: string;
  name: string | null;
  area: string | null;
  notes: string | null;
  lat: number | null;
  lng: number | null;
  taken_at: string | null;
  photo_path: string;
  thumb_path: string;
};

export const JAKARTA: [number, number] = [-6.2, 106.8166];
