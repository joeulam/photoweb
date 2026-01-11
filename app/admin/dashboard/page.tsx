"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";

import SeriesForm from "./components/SeriesForm";
import { Photo, Collection } from "./type";
import PhotoForm from "./components/UploadForm";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upload" | "collections">("upload");
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const fetchData = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from("photos").select("*").order("created_at", { ascending: false }),
      supabase.from("collections").select("*").order("created_at", { ascending: false })
    ]);
    if (p.data) setPhotos(p.data);
    if (c.data) setCollections(c.data);
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/admin");
      await fetchData();
      setLoading(false);
    };
    init();
  }, [router, fetchData, supabase.auth]);

  const handleDelete = async (table: "photos" | "collections", id: number) => {
    if (!confirm("This action is permanent. Confirm deletion?")) return;
    await supabase.from(table).delete().eq("id", id);
    if (table === "photos" && editingPhoto?.id === id) {
        setEditingPhoto(null);
    }
    fetchData();
  };

  const handleEditClick = (photo: Photo) => {
    setEditingPhoto(photo);
    setActiveTab("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = () => {
    fetchData();
    setEditingPhoto(null);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">Loading Studio...</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black font-sans">
      
      <nav className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <span className="font-bold tracking-tighter text-lg">STUDIO<span className="text-yellow-400">.ADMIN</span></span>
          <div className="flex gap-6">
             <a href="/" target="_blank" className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">[ Live Site ]</a>
             <button onClick={async () => { await supabase.auth.signOut(); router.push("/admin"); }} className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors">[ Log Out ]</button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-28 pb-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
            
            <div className="mb-8 flex gap-8 border-b border-zinc-900 pb-4">
              <button 
                onClick={() => { setActiveTab("upload"); setEditingPhoto(null); }}
                className={`text-xs uppercase font-mono tracking-wide transition-colors ${activeTab === "upload" ? "text-yellow-400" : "text-zinc-600 hover:text-white"}`}
              >
                01 // {editingPhoto ? "Edit Mode" : "Upload"}
              </button>
              <button 
                onClick={() => { setActiveTab("collections"); setEditingPhoto(null); }}
                className={`text-xs uppercase font-mono tracking-wide transition-colors ${activeTab === "collections" ? "text-yellow-400" : "text-zinc-600 hover:text-white"}`}
              >
                02 // Series
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "upload" ? (
                  <PhotoForm 
                    collections={collections} 
                    onSuccess={handleFormSuccess}
                    initialData={editingPhoto}
                    onCancel={() => setEditingPhoto(null)}
                  />
                ) : (
                  <SeriesForm onSuccess={fetchData} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-8 pt-14 lg:pt-0">
            {activeTab === "upload" ? (
              <PhotoInventory 
                photos={photos} 
                collections={collections} 
                editingId={editingPhoto?.id}
                onDelete={(id) => handleDelete("photos", id)} 
                onEdit={handleEditClick}
              />
            ) : (
              <SeriesInventory 
                collections={collections} 
                photoCount={photos} 
                onDelete={(id) => handleDelete("collections", id)} 
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}


const PhotoInventory = ({ 
    photos, 
    collections, 
    editingId, 
    onDelete, 
    onEdit 
}: { 
    photos: Photo[], 
    collections: Collection[], 
    editingId?: number, 
    onDelete: (id: number) => void, 
    onEdit: (photo: Photo) => void 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Inventory</span>
      <span className="font-mono text-[10px] text-zinc-600">{photos.length} Units</span>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5 bg-zinc-900 border border-zinc-900">
      {photos.map((photo) => {
        const isEditing = editingId === photo.id;
        return (
            <div key={photo.id} className={`group relative aspect-3/4 w-full overflow-hidden bg-black ${isEditing ? 'ring-2 ring-yellow-400 z-10' : ''}`}>
            
            <NextImage 
                src={photo.src} 
                alt={photo.title} 
                fill 
                className={`object-cover transition-all duration-500 ${isEditing ? 'opacity-40 scale-105' : 'group-hover:scale-105 group-hover:opacity-40'}`} 
            />
            
            <div className={`absolute inset-0 p-4 transition-opacity duration-200 flex flex-col justify-between ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                
                <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-1 bg-black/50 backdrop-blur-sm">
                        {collections.find(c => c.id === photo.collection_id)?.title || "RAW"}
                    </span>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => onEdit(photo)} 
                            className="bg-zinc-800 p-1 hover:bg-yellow-400 hover:text-black transition-colors"
                            title="Edit"
                         >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                         </button>
                         <button 
                            onClick={() => onDelete(photo.id)} 
                            className="bg-zinc-800 p-1 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete"
                         >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                         </button>
                    </div>
                </div>

                <div>
                <p className="font-bold text-sm text-white tracking-tight mb-2 line-clamp-1">{photo.title}</p>
                <div className="flex flex-col gap-0.5 border-l-2 border-yellow-400 pl-2">
                    <p className="font-mono text-[10px] text-zinc-400 uppercase">{photo.camera}</p>
                    <div className="flex gap-3 font-mono text-[10px] uppercase text-yellow-400">
                    {photo.iso && <span>ISO {photo.iso}</span>}
                    {photo.aperture && <span>f/{photo.aperture}</span>}
                    </div>
                </div>
                </div>
            </div>

            {isEditing && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="bg-yellow-400 text-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        EDITING
                    </span>
                </div>
            )}
            </div>
        );
      })}
    </div>
  </div>
);

const SeriesInventory = ({ collections, photoCount, onDelete }: { collections: Collection[], photoCount: Photo[], onDelete: (id: number) => void }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Archive</span>
      <span className="font-mono text-[10px] text-zinc-600">{collections.length} Sets</span>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {collections.map((col) => (
        <div key={col.id} className="group relative flex flex-col md:flex-row justify-between border border-zinc-900 p-6 hover:border-yellow-400/50 transition-colors bg-black">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="text-xl font-bold tracking-tighter text-white">{col.title}</h3>
              <span className="font-mono text-[10px] text-yellow-400">{col.year}</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-3">{col.location}</p>
            <p className="text-sm text-zinc-500 max-w-md font-light leading-relaxed">{col.description}</p>
          </div>
          <div className="mt-4 md:mt-0 md:pl-6 flex flex-row md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 group-hover:text-yellow-400 transition-colors">
              {photoCount.filter(p => p.collection_id === col.id).length} Assets
            </span>
            <button onClick={() => onDelete(col.id)} className="font-mono text-[10px] uppercase tracking-widest text-zinc-700 hover:text-red-500 transition-colors">[ Delete ]</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);