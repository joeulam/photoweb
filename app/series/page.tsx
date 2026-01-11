"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Link as HeroLink } from "@heroui/react";
import { Navbar } from "../components/NavBar";

type Collection = {
  id: number;
  title: string;
  location: string;
  year: string;
  description: string;
};

export default function WorkPage() {
  const supabase = createClient();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("collections")
            .select("*")
            .order("year", { ascending: false });
        
        if (data) setCollections(data);
        setLoading(false);
    };
    fetchCollections();
  }, [supabase]);

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

      <Navbar currentPath={"/series"}/>

      <main className="container mx-auto max-w-7xl px-6 pt-32 pb-24 relative z-10">
        
        <header className="mb-24 border-b border-zinc-900 pb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold leading-none tracking-tighter"
          >
            PROJECT <br />
            <span className="text-zinc-600">INDEX.</span>
          </motion.h1>
        </header>

        {loading ? (
           <div className="py-20 text-center font-mono text-xs uppercase tracking-widest animate-pulse text-zinc-500">
             Loading Archives...
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/series/${c.id}`}
                  className="group h-75 border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col justify-between hover:border-yellow-400 hover:bg-zinc-900 transition-all duration-300"
                >
                   <div className="flex justify-between items-start font-mono text-xs uppercase tracking-widest text-zinc-500">
                      <span>{c.year}</span>
                      <span>{c.location}</span>
                   </div>

                   <div>
                      <h2 className="text-3xl font-bold text-white uppercase mb-2 group-hover:text-yellow-400 transition-colors">
                        {c.title}
                      </h2>
                      <p className="text-zinc-500 text-sm line-clamp-2 font-light">
                        {c.description}
                      </p>
                   </div>

                   <div className="flex justify-end">
                      <span className="text-xs uppercase tracking-widest text-yellow-400 opacity-0 -translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View Series →
                      </span>
                   </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}