import { useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../lib/image";

export function TileCard({ tile }) {
  const cover = tile.images?.[0];
  const [loaded, setLoaded] = useState(false);
  return (
    <Link
      to={`/tile/${tile.slug}`}
      data-testid={`tile-card-${tile.slug}`}
      className="group block bg-white border border-stone rounded-md overflow-hidden shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        {cover && (
          <>
            {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white via-ivory/60 to-white" />}
            <img
              src={resolveImageUrl(cover.medium_url)}
              alt={cover.alt_text || `${tile.name} tile`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
            />
          </>
        )}
        {tile.is_kajaria && (
          <span className="absolute top-3 right-3 inline-block text-[10px] font-semibold uppercase tracking-wide text-ink bg-gold rounded-full px-2.5 py-1 shadow-soft">
            Kajaria
          </span>
        )}
        <span className="absolute bottom-0 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-500 ease-out" />
      </div>
      <div className="p-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-gold bg-gold/10 rounded-full px-2.5 py-1 mb-2">{tile.type}</span>
        <h3 className="font-serif text-lg text-ink leading-snug">{tile.name}</h3>
        <p className="text-xs text-ink/60 mt-1 tracking-wide">
          {tile.size} · SKU {tile.sku}
        </p>
      </div>
    </Link>
  );
}
