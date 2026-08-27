import { useState } from "react";
import { resolveImageUrl } from "../lib/image";

export function DemoPhotoCard({ photo, onClick }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      onClick={onClick}
      data-testid={`demo-photo-${photo.id}`}
      className="group relative block w-full aspect-[4/5] overflow-hidden rounded-md bg-white border border-stone text-left"
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white via-ivory/60 to-white" />}
      <img
        src={resolveImageUrl(photo.image.medium_url)}
        alt={photo.image.alt_text || photo.caption || "Finished room look"}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
      />
      {photo.caption && (
        <span className="absolute bottom-0 left-0 right-0 bg-navy/70 text-ivory text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {photo.caption}
        </span>
      )}
    </button>
  );
}
