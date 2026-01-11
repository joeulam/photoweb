import React from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";

type Photo = {
  id: number;
  title: string;
  category: string;
  src: string;
  description?: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
  shutter_speed?: string;
};

export default function PhotoModal({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-xl bg-size-[20px_20px]" />

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-6xl overflow-hidden border border-zinc-800 bg-black shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center bg-black/50 text-white hover:text-yellow-400 hover:bg-black border border-white/10 hover:border-yellow-400 transition-all">✕</button>
        <div className="relative h-[50vh] w-full bg-zinc-900 md:h-auto md:w-3/4">
          <NextImage src={photo.src} alt={photo.title} fill className="object-contain" />
        </div>
        <div className="flex w-full flex-col justify-between bg-black p-8 md:w-1/4 border-l border-zinc-800">
          <div>
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-400 border border-yellow-400/20 px-2 py-1">{photo.category || "Standard"}</span>
            </div>
            <h3 className="mb-4 text-3xl font-bold text-white leading-tight">{photo.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400 font-light">{photo.description || "No description."}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-900 space-y-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-2">Technical Data</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500">CAMERA</span>
                  <span className="text-sm font-medium text-white">{photo.camera || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500">LENS</span>
                  <span className="text-sm font-medium text-white">{photo.lens || "—"}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-zinc-900 pt-4">
              <div className="text-center">
                <span className="block text-[9px] text-zinc-600 mb-1">ISO</span>
                <span className="block text-yellow-400 font-mono text-sm">{photo.iso || "—"}</span>
              </div>
              <div className="text-center border-l border-zinc-900">
                <span className="block text-[9px] text-zinc-600 mb-1">APERTURE</span>
                <span className="block text-yellow-400 font-mono text-sm">{photo.aperture ? `f/${photo.aperture}` : "—"}</span>
              </div>
              <div className="text-center border-l border-zinc-900">
                <span className="block text-[9px] text-zinc-600 mb-1">SHUTTER</span>
                <span className="block text-yellow-400 font-mono text-sm">{photo.shutter_speed || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
