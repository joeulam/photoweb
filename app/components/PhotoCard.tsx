import React from "react";
import { Card } from "@heroui/react";
import NextImage from "next/image";

type Photo = {
  id: number;
  title: string;
  category: string;
  src: string;
};

export default function PhotoCard({ photo, onClick, className = "" }: { photo: Photo; onClick?: () => void; className?: string }) {
  return (
    <Card onClick={onClick} className={`group relative h-full w-full border border-zinc-800 bg-black rounded-none overflow-hidden hover:border-yellow-400/50 transition-colors ${className}`}>
      <div className="absolute inset-0 h-full w-full">
        <NextImage src={photo.src} alt={photo.title} fill className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-60" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-yellow-400 mb-1">[{photo.category}]</p>
        <h3 className="text-xl font-bold text-white tracking-tight">{photo.title}</h3>
      </div>
    </Card>
  );
}
