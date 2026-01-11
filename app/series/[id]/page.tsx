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
};

type Collection = {
  id: number;
  title: string;
  location: string;
  year: string;
  description: string;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <span className="font-mono text-xs uppercase tracking-widest animate-pulse text-zinc-500">
          Loading Series Data...
        </span>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay">
        <svg className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 mix-blend-difference">
        <Link 
          href="/" 
          className="text-sm font-mono uppercase tracking-widest text-white hover:text-yellow-400 transition-colors"
        >
          ← Return to Index
        </Link>
        <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
           Series No. {collection.id}
        </div>
      </nav>

      <main className="container mx-auto max-w-7xl px-6 pt-32 pb-24 relative z-10">
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-2 border-yellow-400 pl-6 mb-24"
        >
          <div className="flex gap-4 mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <span className="text-yellow-400">{collection.year}</span>
            <span>{collection.location}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white mb-6">
            {collection.title}
          </h1>
          <p className="max-w-2xl text-zinc-400 text-lg font-light leading-relaxed">
            {collection.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-4/5 w-full bg-zinc-900 overflow-hidden">
               <NextImage
                 src={photo.src}
                 alt={photo.title}
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />

               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                 <h3 className="text-3xl font-bold tracking-tight">{photo.title}</h3>
                 <div className="w-12 h-1 bg-yellow-400 my-4"></div>
                 <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                    <span>Camera: {photo.camera || "Unknown"}</span>
                    <span>Lens: {photo.lens || "Unknown"}</span>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>

        {photos.length === 0 && (
            <div className="py-32 border border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-600">
                <span className="font-mono text-xs uppercase tracking-widest mb-4">Archive Empty</span>
                <p className="text-sm">No images have been assigned to this series yet.</p>
            </div>
        )}

        <footer className="mt-32 pt-12 border-t border-zinc-900 flex justify-between text-zinc-600 text-xs uppercase tracking-widest">
            <span>End of Series</span>
            <span>JL.PHOTO</span>
        </footer>

      </main>
    </div>
  );
}