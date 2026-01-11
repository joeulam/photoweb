import { useState, useEffect, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { BrutalistInput, BrutalistButton } from "./BrutalistUI"; 
import { Collection } from "../type";

interface SeriesFormProps {
  onSuccess: () => void;
  initialData?: Collection | null;
  onCancel?: () => void;
}

export default function SeriesForm({ onSuccess, initialData, onCancel }: SeriesFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    year: new Date().getFullYear().toString(),
    location: "" 
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || "",
        year: initialData.year || "",
        location: initialData.location || ""
      });
    } else {
      setForm({ title: "", description: "", year: new Date().getFullYear().toString(), location: "" });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return alert("Title is required");

    setLoading(true);
    
    const payload = {
        title: form.title,
        description: form.description,
        year: form.year,
        location: form.location
    };

    try {
      if (initialData?.id) {
        // UPDATE
        const { error } = await supabase.from("collections").update(payload).eq("id", initialData.id);
        if (error) throw error;
      } else {
        // CREATE
        const { error } = await supabase.from("collections").insert([payload]);
        if (error) throw error;
      }
      
      onSuccess();
      if (!initialData) setForm({ title: "", description: "", year: "", location: "" });
      
    } catch (err) {
      alert("Error saving series");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
       <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
        <h2 className="text-l font-bold tracking-tighter text-white">
            {initialData ? `EDIT SERIES: ${initialData.title}` : "NEW SERIES"}
        </h2>
        {initialData && onCancel && (
            <button type="button" onClick={onCancel} className="text-[10px] text-red-500 hover:text-white uppercase tracking-widest">
              [ Cancel ]
            </button>
        )}
      </div>

      <BrutalistInput 
        label="Title" 
        value={form.title} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })} 
      />
      
      <div className="group relative">
        <label className="absolute -top-2 left-3 bg-black px-1 text-[10px] uppercase tracking-widest text-zinc-600">Description</label>
        <textarea 
            className="w-full border border-zinc-800 bg-transparent p-3 text-sm text-white focus:border-yellow-400 focus:outline-none min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <BrutalistInput 
            label="Year" 
            value={form.year} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, year: e.target.value })} 
        />
        <BrutalistInput 
            label="Location" 
            value={form.location} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, location: e.target.value })} 
        />
      </div>

      <BrutalistButton type="submit" isLoading={loading}>
        {initialData ? "Save Changes" : "Create Series"}
      </BrutalistButton>
    </form>
  );
}