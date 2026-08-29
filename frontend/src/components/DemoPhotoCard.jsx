import { useState } from "react";
import { resolveImageUrl } from "../lib/image";
import { displayCaption } from "../lib/caption";

export function DemoPhotoCard({ photo, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const caption = displayCaption(photo.caption);
  return (
    <button
      onClick={onClick}
      data-testid={`demo-photo-${photo.id}`}
      className="group relative block w-full aspect-[4/5] overflow-hidden rounded-md bg-white border border-stone text-left shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white via-ivory/60 to-white" />}
      <img
        src={resolveImageUrl(photo.image.medium_url)}
        alt={photo.image.alt_text || caption || `${photo.room} showroom display`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
      />
      {photo.room && (
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide text-ink bg-gold rounded-full px-2.5 py-1 shadow-soft capitalize">
          {photo.room}
        </span>
      )}
      {caption && (
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent text-ivory text-xs sm:text-sm px-3 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {caption}
        </span>
      )}
    </button>
  );
}
