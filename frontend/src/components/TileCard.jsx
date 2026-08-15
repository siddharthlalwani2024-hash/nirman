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
      className="group block bg-white/70 border border-greige rounded-md overflow-hidden hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-greige">
        {cover && (
          <>
            {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-greige via-bone/60 to-greige" />}
            <img
              src={resolveImageUrl(cover.medium_url)}
              alt={cover.alt_text || `${tile.name} tile`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
            />
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-cobalt bg-cobalt/10 rounded-full px-2.5 py-1">{tile.type}</span>
          {tile.is_kajaria && <span className="inline-block text-[11px] font-semibold text-white bg-cobalt rounded-full px-2.5 py-1">Kajaria</span>}
        </div>
        <h3 className="font-serif text-lg text-charcoal leading-snug">{tile.name}</h3>
        <p className="text-xs text-taupe mt-1">
          {tile.size} · SKU {tile.sku}
        </p>
      </div>
    </Link>
  );
}
