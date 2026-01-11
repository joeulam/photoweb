import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { BrutalistInput, BrutalistButton } from "./BrutalistUI";

export default function SeriesForm({ onSuccess }: { onSuccess: () => void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    location: "", 
    year: new Date().getFullYear().toString(), 
    desc: "" 
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return alert("Series Title is required.");

    setLoading(true);
    try {
      const { error } = await supabase.from("collections").insert([{ 
        title: form.title, 
        location: form.location, 
        year: form.year, 
        description: form.desc 
      }]);
      
      if (error) throw error;
      
      setForm({ 
        title: "", 
        location: "", 
        year: new Date().getFullYear().toString(), 
        desc: "" 
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-6">
      <BrutalistInput 
        label="Series Title" 
        placeholder="e.g. Neon Tokyo" 
        value={form.title} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("title", e.target.value)} 
      />
      
      <div className="grid grid-cols-2 gap-4">
         <BrutalistInput 
           label="Location" 
           placeholder="City, Country"
           value={form.location} 
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("location", e.target.value)} 
         />
         <BrutalistInput 
           label="Year" 
           placeholder="YYYY"
           value={form.year} 
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("year", e.target.value)} 
         />
      </div>

      <div className="relative group pt-2">
        <label className="absolute top-0 left-3 bg-black px-1 text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-yellow-400 transition-colors z-10">
          Description
        </label>
        <textarea
          className="w-full border border-zinc-800 bg-transparent p-4 text-sm text-white focus:border-yellow-400 focus:outline-none transition-colors rounded-none placeholder:text-zinc-800 hover:border-zinc-600"
          rows={6}
          placeholder="Enter a brief description of this collection..."
          value={form.desc}
          onChange={(e) => updateField("desc", e.target.value)}
        />
      </div>

      <BrutalistButton type="submit" isLoading={loading}>
        Create Series
      </BrutalistButton>
    </form>
  );
}