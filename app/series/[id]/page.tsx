"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import NextImage from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Photo = {
  id: number;
  title: string;
  category: string;
  src: string;
  collection_id: number;
  camera?: string;
  lens?: string;
  iso?: string;
};

type Collection = {
  id: number;
  title: string;
  location: string;
  year: string;
  description: string;
  cover_image?: string;
};

export default function SeriesPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      const { data: collectionData, error: collectionError } = await supabase
        .from("collections")
        .select("*")
        .eq("id", id)
        .single();

      if (collectionError || !collectionData) {
        router.push("/404");
        return;
      }

      setCollection(collectionData);

      const { data: photoData } = await supabase
        .from("photos")
        .select("*")
        .eq("collection_id", id)
        .order("created_at", { ascending: false });

      if (photoData) setPhotos(photoData);

      setLoading(false);
    };

    fetchData();
  }, [id, router, supabase]);

  if (loading) return <div className="min-h-screen bg-black" />;
  if (!collection) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      {collection.cover_image && (
        <div className="fixed inset-0 top-0 left-0 z-0 h-[80vh] w-full">
          <NextImage
            src={collection.cover_image}
            alt="Cover"
            fill
            className="object-cover opacity-60"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
        </div>
      )}

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 mix-blend-difference">
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-widest text-white transition-colors hover:text-yellow-400"
        >
          ← Return to Index
        </Link>
        <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">
          Series No. {collection.id}
        </div>
      </nav>

      <div className="relative z-10 flex flex-col">
        <header className="flex min-h-[80vh] flex-col justify-end px-6 pb-24 pt-48 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto w-full"
          >
            <div className="mb-4 flex gap-4 font-mono text-xs uppercase tracking-widest text-zinc-300">
              <span className="text-yellow-400">{collection.year}</span>
              <span>{collection.location}</span>
            </div>

            <h1 className="mb-8 text-6xl font-bold uppercase tracking-tighter text-white drop-shadow-2xl md:text-9xl md:leading-[0.85]">
              {collection.title}
            </h1>

            <div className="max-w-xl border-l-2 border-yellow-400 pl-6 backdrop-blur-sm">
              <p className="text-lg font-light leading-relaxed text-zinc-200 text-shadow-sm">
                {collection.description}
              </p>
            </div>
          </motion.div>
        </header>

        <main className="w-full bg-black px-6 pb-32 pt-24 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-[4/5] w-full overflow-hidden bg-zinc-900"
                >
                  <NextImage
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-3xl font-bold tracking-tight">
                      {photo.title}
                    </h3>
                    <div className="my-4 h-1 w-12 bg-yellow-400"></div>
                    <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                      <span>Camera: {photo.camera || "Unknown"}</span>
                      <span>Lens: {photo.lens || "Unknown"}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {photos.length === 0 && (
              <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 py-32 text-zinc-600">
                <span className="mb-4 font-mono text-xs uppercase tracking-widest">
                  Archive Empty
                </span>
                <p className="text-sm">
                  No images have been assigned to this series yet.
                </p>
              </div>
            )}

            <footer className="mt-32 flex justify-between border-t border-zinc-900 pt-12 text-xs uppercase tracking-widest text-zinc-600">
              <span>End of Series</span>
              <span>JL.PHOTO</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
