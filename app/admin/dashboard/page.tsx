"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

import SeriesForm from "./components/SeriesForm";
import { Photo, Collection } from "./type";
import PhotoForm from "./components/UploadForm";
import { SeriesInventory } from "./components/SeriesInventory";
import { PhotoInventory } from "./components/PhotoInventory";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upload" | "collections">(
    "upload"
  );

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const fetchData = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (p.data) setPhotos(p.data);
    if (c.data) setCollections(c.data);
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
  const editSeriesClick = (collection: Collection) => {
    setEditingCollection(collection);
    setActiveTab("collections");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFormSuccess = () => {
    fetchData();
    setEditingPhoto(null);
  };

  const handleSetCover = async (collectionId: number, url: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, cover_image: url } : c))
    );

    const { error } = await supabase
      .from("collections")
      .update({ cover_image: url })
      .eq("id", collectionId);

    if (error) {
      alert("Failed to update cover");
      fetchData(); 
    }
  };
  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
        Loading Studio...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black font-sans">
      <nav className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <span className="font-bold tracking-tighter text-lg">
            JL<span className="text-yellow-400">.ADMIN</span>
          </span>
          <div className="flex gap-6">
            <a
              href="/"
              target="_blank"
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
            >
              [ Live Site ]
            </a>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/admin");
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors"
            >
              [ Log Out ]
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-28 pb-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
            <div className="mb-8 flex gap-8 border-b border-zinc-900 pb-4">
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setEditingPhoto(null);
                }}
                className={`text-xs uppercase font-mono tracking-wide transition-colors ${
                  activeTab === "upload"
                    ? "text-yellow-400"
                    : "text-zinc-600 hover:text-white"
                }`}
              >
                01 // {editingPhoto ? "Edit Mode" : "Upload"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("collections");
                  setEditingPhoto(null);
                }}
                className={`text-xs uppercase font-mono tracking-wide transition-colors ${
                  activeTab === "collections"
                    ? "text-yellow-400"
                    : "text-zinc-600 hover:text-white"
                }`}
              >
                02 // Series
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                  <SeriesForm
                    onSuccess={() => {
                      fetchData();
                      setEditingCollection(null);
                    }}
                    initialData={editingCollection}
                    onCancel={() => setEditingCollection(null)}
                  />
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
                onEdit={editSeriesClick}
                onSetCover={handleSetCover}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
