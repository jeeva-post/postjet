"use client";
import { useState, useEffect } from "react";

export default function MediaGallery({ onSelect, selectedUrl }: { onSelect: (url: string) => void, selectedUrl: string }) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media").then(res => res.json()).then(data => {
      setImages(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm animate-pulse text-blue-500">Loading Gallery...</p>;

  return (
    <div className="grid grid-cols-4 gap-2 p-2 border rounded-lg bg-gray-50 max-h-60 overflow-y-auto shadow-inner">
      {images.map((img) => (
        <div 
          key={img.public_id} 
          onClick={() => onSelect(img.url)}
          className={`relative aspect-square cursor-pointer rounded overflow-hidden border-2 ${selectedUrl === img.url ? "border-blue-600 shadow-md" : "border-transparent"}`}
        >
          <img src={img.url} className="w-full h-full object-cover" alt="gallery" />
          {selectedUrl === img.url && <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center text-[10px] text-white font-bold bg-blue-600/40">SELECTED</div>}
        </div>
      ))}
    </div>
  );
}