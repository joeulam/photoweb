import NextImage from "next/image";
import { Collection, Photo } from "../type";

export const SeriesInventory = ({
  collections,
  photoCount, 
  onDelete,
  onEdit,
  onSetCover, 
}: {
  collections: Collection[];
  photoCount: Photo[];
  onDelete: (id: number) => void;
  onEdit: (collection: Collection) => void;
  onSetCover: (collectionId: number, url: string) => void;
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        Archive
      </span>
      <span className="font-mono text-[10px] text-zinc-600">
        {collections.length} Sets
      </span>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {collections.map((col) => {
        const assets = photoCount.filter((p) => p.collection_id === col.id);

        return (
          <div
            key={col.id}
            className="group relative flex flex-col border border-zinc-900 bg-black transition-colors hover:border-zinc-800"
          >
            <div className="flex flex-col justify-between p-6 md:flex-row">
              <div className="flex-1">
                <div className="mb-2 flex items-baseline gap-3">
                  <h3 className="text-xl font-bold tracking-tighter text-white">
                    {col.title}
                  </h3>
                  <span className="font-mono text-[10px] text-yellow-400">
                    {col.year}
                  </span>
                </div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  {col.location}
                </p>
                <p className="max-w-md text-sm font-light leading-relaxed text-zinc-500">
                  {col.description}
                </p>
              </div>

              <div className="mt-4 flex flex-row items-end justify-between border-t border-zinc-900 pt-4 md:mt-0 md:flex-col md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 transition-colors group-hover:text-yellow-400">
                  {assets.length} Assets
                </span>
                <div className="flex gap-4 md:flex-col md:gap-2">
                  <button
                    onClick={() => onEdit(col)}
                    className="font-mono text-[10px] uppercase tracking-widest text-zinc-700 transition-colors hover:text-yellow-500 md:text-right"
                  >
                    [ Edit ]
                  </button>
                  <button
                    onClick={() => onDelete(col.id)}
                    className="font-mono text-[10px] uppercase tracking-widest text-zinc-700 transition-colors hover:text-red-500 md:text-right"
                  >
                    [ Delete ]
                  </button>
                </div>
              </div>
            </div>

            {assets.length > 0 && (
              <div className="flex w-full overflow-x-auto border-t border-zinc-900 bg-zinc-900/20 p-4 scrollbar-hide">
                <div className="flex gap-3">
                  {assets.map((photo) => {
                    const isCover = col.cover_image === photo.src;
                    return (
                      <button
                        key={photo.id}
                        onClick={() => onSetCover(col.id, photo.src)}
                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border transition-all ${
                          isCover
                            ? "border-yellow-400 opacity-100 ring-1 ring-yellow-400"
                            : "border-zinc-800 opacity-50 hover:border-zinc-600 hover:opacity-100"
                        }`}
                      >
                        <NextImage
                          src={photo.src}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                        {isCover && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                            <span className="bg-yellow-400 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-black">
                              Cover
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);