"use client";

import React, { useState } from "react";
import { Button, Card, CardFooter, Link, Chip } from "@heroui/react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return { isOpen, onOpen, onClose };
}

const photos = [
  {
    id: 1,
    title: "Neon Nights",
    category: "Street",
    src: "https://images.unsplash.com/photo-1555685812-4b943f3db9f0?q=80&w=2670&auto=format&fit=crop",
    size: "col-span-12 md:col-span-8 row-span-2",
    description: "Cyberpunk aesthetics in downtown Tokyo.",
    meta: { iso: "800", lens: "35mm", aperture: "f/1.8" },
  },
  {
    id: 2,
    title: "Silent Geometric",
    category: "Architecture",
    src: "https://images.unsplash.com/photo-1486718448742-1666229e2a37?q=80&w=2670&auto=format&fit=crop",
    size: "col-span-12 md:col-span-4 row-span-1",
    description: "Minimalist concrete structures.",
    meta: { iso: "100", lens: "50mm", aperture: "f/8.0" },
  },
  {
    id: 3,
    title: "Velvet Portrait",
    category: "Portrait",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
    size: "col-span-12 md:col-span-4 row-span-1",
    description: "Study of shadows and soft light.",
    meta: { iso: "200", lens: "85mm", aperture: "f/2.8" },
  },
  {
    id: 4,
    title: "The Void",
    category: "Abstract",
    src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2668&auto=format&fit=crop",
    size: "col-span-12 md:col-span-6 row-span-1",
    description: "Textures found in nature.",
    meta: { iso: "400", lens: "24mm", aperture: "f/4.0" },
  },
  {
    id: 5,
    title: "Urban Decay",
    category: "Editorial",
    src: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2670&auto=format&fit=crop",
    size: "col-span-12 md:col-span-6 row-span-1",
    description: "The beauty in forgotten places.",
    meta: { iso: "1600", lens: "35mm", aperture: "f/5.6" },
  },
];

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);

  const handleCardClick = (photo: (typeof photos)[0]) => {
    setSelectedPhoto(photo);
    onOpen();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-60 opacity-[0.05] mix-blend-overlay">
        <svg className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 mix-blend-difference">
        <div className="text-xl font-bold tracking-tighter">JL.PHOTO</div>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="#" className="text-white hover:opacity-70">
            Work
          </Link>
          <Link href="#" className="text-white hover:opacity-70">
            Info
          </Link>
        </div>
      </nav>

      <main className="container mx-auto max-w-7xl px-6 pb-24 pt-32">
        <header className="mb-24 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-semibold leading-none tracking-tight md:text-8xl">
              CAPTURING <br />
              <span className="text-zinc-500">THE UNSEEN.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex max-w-sm flex-col gap-4"
          >
            <p className="text-zinc-400">
              A visual diary exploring the interaction between light, shadow,
              and the human condition.
            </p>
            <Button className="w-fit bg-white text-black font-semibold rounded-full">
              Latest Exhibition <span className="ml-2">→</span>
            </Button>
          </motion.div>
        </header>

        <section className="grid grid-cols-12 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={photo.size}
            >
              <Card
                onClick={() => handleCardClick(photo)}
                className="group relative h-full w-full border-none data-[focus-visible=true]:outline-white overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 h-full w-full">
                  <NextImage
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%-8px)] justify-between overflow-hidden rounded-large border border-white/20 py-1 shadow-small before:rounded-xl before:bg-black/10 before:backdrop-blur-md">
                  <p className="px-2 text-tiny text-white/80 uppercase tracking-widest font-bold">
                    {photo.title}
                  </p>
                  <Chip
                    size="sm"
                    variant="soft"
                    className="bg-black/50 text-white/90 text-[10px]"
                  >
                    {photo.category}
                  </Chip>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </section>

        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-white/20 backdrop-blur-md transition-colors"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.1929 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                <div className="relative h-[50vh] w-full bg-zinc-900 md:h-auto md:w-2/3">
                  <NextImage
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex w-full flex-col justify-center bg-zinc-950 p-8 md:w-1/3">
                  <h3 className="mb-2 text-3xl font-bold text-white">
                    {selectedPhoto.title}
                  </h3>
                  <div className="mb-6 flex gap-2">
                    <Chip
                      variant="tertiary"
                      className="border border-zinc-700 text-zinc-400"
                    >
                      {selectedPhoto.category}
                    </Chip>
                  </div>
                  <p className="leading-relaxed text-zinc-400">
                    {selectedPhoto.description}
                  </p>

                  <div className="mt-8 flex justify-between border-t border-zinc-800 pt-8 text-sm font-mono text-zinc-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-600">ISO</span>
                      <span>{selectedPhoto.meta.iso}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-600">LENS</span>
                      <span>{selectedPhoto.meta.lens}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-600">APERTURE</span>
                      <span>{selectedPhoto.meta.aperture}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="mt-32 border-t border-zinc-900 py-12 text-center text-zinc-600">
          <p className="text-xs uppercase tracking-widest">
            © 2026 JL.PHOTO / All rights reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
