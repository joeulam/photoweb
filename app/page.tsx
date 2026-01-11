"use client";

import React, { useState, useEffect } from "react";
import { Link as HeroLink } from "@heroui/react";
import FilmGrainOverlay from "./components/FilmGrainOverlay";
import PhotoCard from "./components/PhotoCard";
import PhotoModal from "./components/PhotoModal";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Navbar } from "./components/NavBar";
import { LensCursor } from "./components/LensCursor";

type Photo = {
  id: number;
  title: string;
  category: string;
  src: string;
  collection_id: number | null;
  description?: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
  shutter_speed?: string;
};

const getGridClass = (index: number) => {
  const pattern = [
    "col-span-12 md:col-span-8 row-span-2",
    "col-span-12 md:col-span-4 row-span-1",
    "col-span-12 md:col-span-4 row-span-1",
    "col-span-12 md:col-span-6 row-span-1",
    "col-span-12 md:col-span-6 row-span-1",
  ];
  return pattern[index % pattern.length];
};

export default function Home() {
  const supabase = createClient();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setPhotos(data);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black relative overflow-x-hidden cursor-none">
      <FilmGrainOverlay />

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[96px_96px]"></div>
        <div className="absolute inset-0 bg-black mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_70%,black_100%)]"></div>
        <motion.div
          initial={{ top: "-10%" }}
          animate={{ top: "120%" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          className="absolute left-0 w-full h-px bg-linear-to-r from-transparent via-yellow-400/20 to-transparent drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
        />
      </div>

      <Navbar currentPath={"/"} />
      <LensCursor />
      <main className="container mx-auto max-w-7xl px-6 pb-24 pt-32 relative z-10">
        <header className="mb-24 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-zinc-800/50 pb-12 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold leading-none tracking-tighter md:text-9xl relative">
              VISUAL <br />
              <span className="text-zinc-600">ARCHIVE.</span>
              <span className="absolute -top-4 -left-4 text-xs font-mono text-yellow-400 opacity-50">
                +
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex max-w-sm flex-col gap-6"
          >
            <p className="text-zinc-400 font-light leading-relaxed">
              &quot;Art washes away from the soul the dust of everyday
              life.&quot;
              <br />- Pablo Picasso
            </p>
          </motion.div>
        </header>

        <div className="mb-6 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 animate-pulse"></div>
            <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500">
              Live Feed
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-700">
            INDEX: {photos.length}
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center border border-zinc-800 border-dashed bg-zinc-900/20">
            <span className="font-mono text-xs uppercase tracking-widest animate-pulse text-zinc-500">
              [ Establishing Uplink... ]
            </span>
          </div>
        ) : (
          <section className="grid grid-cols-12 gap-1 md:gap-4 auto-rows-[300px] md:auto-rows-[400px]">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={getGridClass(index)}
              >
                <PhotoCard
                  // className="cursor-pointer"
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                />
              </motion.div>
            ))}
          </section>
        )}

        <AnimatePresence>
          {selectedPhoto && (
            <PhotoModal
              photo={selectedPhoto}
              onClose={() => setSelectedPhoto(null)}
            />
          )}
        </AnimatePresence>

        <footer className="mt-32 border-t border-zinc-800 py-12 flex justify-between items-end text-zinc-600">
          <div>
            <p className="font-bold text-white tracking-tighter">JL.PHOTO</p>
            <p className="text-xs mt-2">Visual database & portfolio.</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-mono">
            © {new Date().getFullYear()} / All rights reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
