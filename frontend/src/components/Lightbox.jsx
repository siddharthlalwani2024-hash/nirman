import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../lib/image";

export function Lightbox({ photo, onClose, onPrev, onNext }) {
  if (!photo) return null;
  const imageUrl = photo.image?.url || photo.url;

  return (
    <div
      className="fixed inset-0 z-[60] bg-navy/95 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="lightbox-overlay"
    >
      <button onClick={onClose} data-testid="lightbox-close" className="absolute top-5 right-5 text-ivory/80 hover:text-ivory" aria-label="Close">
        <X size={28} />
      </button>
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          data-testid="lightbox-prev"
          className="absolute left-3 sm:left-6 text-ivory/80 hover:text-ivory"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          data-testid="lightbox-next"
          className="absolute right-3 sm:right-6 text-ivory/80 hover:text-ivory"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>
      )}
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={resolveImageUrl(imageUrl)}
          alt={photo.alt_text || photo.caption || photo.image?.alt_text || "Photo"}
          className="w-full max-h-[70vh] object-contain rounded-md"
        />
        {(photo.caption || photo.tiles?.length > 0) && (
          <div className="mt-4 bg-ivory rounded-md p-4">
            {photo.caption && <p className="text-ink text-sm mb-2">{photo.caption}</p>}
            {photo.tiles?.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-ink/60 mr-1">Tiles used:</span>
                {photo.tiles.map((t) => (
                  <Link
                    key={t.id}
                    to={`/tile/${t.slug}`}
                    data-testid={`lightbox-tile-chip-${t.slug}`}
                    className="text-xs bg-gold/10 text-gold px-2.5 py-1 rounded-full hover:bg-gold hover:text-white transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
