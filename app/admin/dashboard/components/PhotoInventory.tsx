import { Collection, Photo } from "../type";
import NextImage from "next/image";

export const PhotoInventory = ({ 
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
