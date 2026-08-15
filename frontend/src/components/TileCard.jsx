import { Link } from "react-router-dom";
import { resolveImageUrl } from "../lib/image";

export function TileCard({ tile }) {
  const cover = tile.images?.[0];
  return (
    <Link
      to={`/tile/${tile.slug}`}
      data-testid={`tile-card-${tile.slug}`}
      className="group block bg-white/70 border border-greige rounded-md overflow-hidden hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="aspect-[4/5] overflow-hidden bg-greige">
        {cover && (
          <img
            src={resolveImageUrl(cover.medium_url)}
            alt={`${tile.name} tile`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-clay bg-clay/10 rounded-full px-2.5 py-1 mb-2">
          {tile.type}
        </span>
        <h3 className="font-serif text-lg text-charcoal leading-snug">{tile.name}</h3>
        <p className="text-xs text-taupe mt-1">
          {tile.size} · SKU {tile.sku}
        </p>
      </div>
    </Link>
  );
}
