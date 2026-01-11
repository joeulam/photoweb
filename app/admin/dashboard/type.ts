export type Collection = {
  id: number;
  title: string;
  description: string;
  location?: string;
  year?: string;
};

export type Photo = {
  id: number;
  title: string;
  category: string;
  src: string;
  collection_id: number | null;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
  shutter_speed?: string;
};