import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import NextImage from "next/image";
import { BrutalistInput, BrutalistButton } from "./BrutalistUI";
import { Collection } from "../type";

type PhotoData = {
  id?: number;
  title: string;
  category: string;
  collection_id: number | null;
  src?: string;
  description?: string;
  camera?: string;
  lens?: string;
  iso?: string;
  aperture?: string;
  shutter_speed?: string;
};

interface PhotoFormProps {
  collections: Collection[];
  onSuccess: () => void;
  initialData?: PhotoData | null;
  onCancel?: () => void;
}

export default function PhotoForm({ collections, onSuccess, initialData, onCancel }: PhotoFormProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    title: "", 
    category: "", 
    collectionId: "", 
    description: "",
    camera: "", 
    lens: "", 
    iso: "", 
    aperture: "", 
    shutter: "" 
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "",
        collectionId: initialData.collection_id?.toString() || "",
        description: initialData.description || "",
        camera: initialData.camera || "",
        lens: initialData.lens || "",
        iso: initialData.iso || "",
        aperture: initialData.aperture || "",
        shutter: initialData.shutter_speed || ""
      });
      setPreviewUrl(initialData.src || null);
    } else {
      setForm({ 
        title: "", category: "", collectionId: "", description: "",
        camera: "", lens: "", iso: "", aperture: "", shutter: "" 
      });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return alert("Title is required.");
    if (!initialData && !file) return alert("Please select an image.");

    setUploading(true);
    try {
      let publicUrl = initialData?.src; 

      if (file) {
        const fileName = `${Date.now()}.${file.name.split(".").pop()}`;
        const { error: upErr } = await supabase.storage.from("gallery").upload(fileName, file);
        if (upErr) throw upErr;
        
        const { data } = supabase.storage.from("gallery").getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        src: publicUrl,
        collection_id: form.collectionId ? parseInt(form.collectionId) : null,
        camera: form.camera, 
        lens: form.lens, 
        iso: form.iso, 
        aperture: form.aperture, 
        shutter_speed: form.shutter
      };

      if (initialData?.id) {
        const { error: dbErr } = await supabase.from("photos").update(payload).eq("id", initialData.id);
        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase.from("photos").insert([payload]);
        if (dbErr) throw dbErr;
      }

      setFile(null); 
      if (!initialData) {
          setPreviewUrl(null);
          setForm({ 
            title: "", category: "", collectionId: "", description: "",
            camera: "", lens: "", iso: "", aperture: "", shutter: "" 
          });
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSuccess(); 

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
        <h2 className="text-xl font-bold tracking-tighter text-white">
            {initialData ? `EDIT ASSET: #${initialData.id}` : "NEW UPLOAD"}
        </h2>
        {initialData && onCancel && (
            <button 
                type="button" 
                onClick={onCancel}
                className="text-[10px] uppercase tracking-widest text-red-500 hover:text-white transition-colors"
            >
                [ Cancel Edit ]
            </button>
        )}
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center border transition-all overflow-hidden ${previewUrl ? "border-zinc-800" : "border-zinc-800 hover:border-yellow-400 bg-zinc-900/20"}`}
      >
        {previewUrl ? (
          <>
             <NextImage src={previewUrl} alt="Preview" fill className="object-contain opacity-60 group-hover:opacity-40 transition-opacity" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span className="bg-black border border-yellow-400 text-yellow-400 px-3 py-1 text-[10px] uppercase tracking-widest">
                    Replace Image
                </span>
             </div>
          </>
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-700 group-hover:text-yellow-400 transition-colors">[ Select Image ]</span>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="space-y-6">
        <BrutalistInput 
          label="Title" 
          placeholder="e.g. Midnight Rain"
          value={form.title} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("title", e.target.value)} 
        />
        
        <div className="group relative">
             <label className="absolute -top-2 left-3 bg-black px-1 text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-yellow-400 group-focus-within:text-yellow-400 transition-colors z-10">
                Description
             </label>
             <textarea 
                className="w-full border border-zinc-800 bg-transparent p-3 text-sm text-white focus:border-yellow-400 focus:outline-none transition-colors rounded-none hover:border-zinc-600 min-h-25 resize-none leading-relaxed"
                placeholder="Write the story behind the image..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
             />
        </div>

        <div className="flex w-full gap-4">
          <div className="flex-1 min-w-0">
             <BrutalistInput 
                label="Category" 
                placeholder="e.g. Street"
                value={form.category} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("category", e.target.value)} 
            />
          </div>
          
          <div className="flex-1 min-w-0 relative group mt-6">
              <label className="absolute -top-2 left-3 bg-black px-1 text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-yellow-400 group-focus-within:text-yellow-400 transition-colors z-10">
                Collection
              </label>
              
              <div className="relative w-full">
                <select 
                    className="h-12 w-full border border-zinc-800 bg-transparent pl-3 pr-8 text-sm text-white focus:border-yellow-400 focus:outline-none transition-colors appearance-none rounded-none hover:border-zinc-600 cursor-pointer"
                    value={form.collectionId}
                    onChange={(e) => updateField("collectionId", e.target.value)}
                >
                    <option value="" className="bg-black text-zinc-500">None</option>
                    {collections.map(c => <option key={c.id} value={c.id} className="bg-black text-white">{c.title}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 group-hover:text-yellow-400">
                    ▼
                </div>
              </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 gap-4">
           <BrutalistInput 
             label="Camera" 
             placeholder="e.g. Leica Q2"
             value={form.camera} 
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("camera", e.target.value)} 
           />
           <BrutalistInput 
             label="Lens" 
             placeholder="e.g. 28mm Summilux"
             value={form.lens} 
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("lens", e.target.value)} 
           />
        </div>
        <div className="grid grid-cols-3 gap-4">
           <BrutalistInput 
             label="ISO" 
             placeholder="e.g. 400"
             value={form.iso} 
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("iso", e.target.value)} 
           />
           <BrutalistInput 
             label="Aperture" 
             placeholder="e.g. f/1.7"
             value={form.aperture} 
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("aperture", e.target.value)} 
           />
           <BrutalistInput 
             label="Shutter" 
             placeholder="e.g. 1/125"
             value={form.shutter} 
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("shutter", e.target.value)} 
           />
        </div>
      </div>

      <BrutalistButton type="submit" isLoading={uploading}>
        {uploading ? (initialData ? "Updating..." : "Uploading...") : (initialData ? "Save Changes" : "Publish Asset")}
      </BrutalistButton>
    </form>
  );
}