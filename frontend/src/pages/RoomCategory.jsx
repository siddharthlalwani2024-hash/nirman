import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
import { displayCaption } from "../lib/caption";
import { SEO } from "../components/SEO";
import { TileCard } from "../components/TileCard";
import { Lightbox } from "../components/Lightbox";
import { ROOMS, TILE_TYPES } from "../constants/rooms";

export default function RoomCategory() {
  const { room } = useParams();
  const [category, setCategory] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    setTypeFilter("All");
    api.get(`/categories/${room}`).then((res) => setCategory(res.data)).catch(() => setCategory(null));
    api.get("/tiles", { params: { room } }).then((res) => setTiles(res.data));
    api.get("/demo-photos", { params: { room } }).then((res) => setPhotos(res.data));
  }, [room]);

  const roomInfo = ROOMS.find((r) => r.slug === room);
  const filteredTiles = typeFilter === "All" ? tiles : tiles.filter((t) => t.type === typeFilter);

  if (roomInfo === undefined) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-ink/60">Room not found.</div>;
  }

  return (
    <div data-testid={`room-page-${room}`}>
      <SEO title={`${roomInfo.name} Tiles`} description={category?.description} image={category?.hero_image ? resolveImageUrl(category.hero_image) : undefined} />

      <section className="relative h-[38vh] min-h-[280px] flex items-end overflow-hidden">
        {category?.hero_image && (
          <img src={resolveImageUrl(category.hero_image)} alt={`${roomInfo.name} tiles`} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory">{roomInfo.name} Tiles</h1>
          {category?.description && <p className="text-ivory/80 mt-2 max-w-xl text-sm sm:text-base">{category.description}</p>}
        </div>
      </section>

      {photos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-6">See the look</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((photo) => {
              const caption = displayCaption(photo.caption);
              const linkedTiles = tiles.filter((t) => photo.tile_ids?.includes(t.id)).slice(0, 3);
              return (
                <div
                  key={photo.id}
                  data-testid={`room-look-card-${photo.id}`}
                  className="group bg-white border border-stone rounded-md overflow-hidden shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
                >
                  <button onClick={() => setLightboxPhoto(photo)} className="relative block w-full aspect-[4/3] overflow-hidden bg-white">
                    <img
                      src={resolveImageUrl(photo.image.medium_url)}
                      alt={photo.image.alt_text || caption || `${roomInfo.name} showroom display`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {caption && (
                      <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent text-ivory text-xs sm:text-sm px-3 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {caption}
                      </span>
                    )}
                  </button>
                  {linkedTiles.length > 0 && (
                    <div className="p-3 flex flex-wrap gap-2">
                      {linkedTiles.map((t) => (
                        <Link
                          key={t.id}
                          to={`/tile/${t.slug}`}
                          data-testid={`room-look-tile-chip-${t.slug}`}
                          className="text-xs bg-gold/10 text-gold px-2.5 py-1 rounded-full hover:bg-gold hover:text-white transition-colors"
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink">Browse {roomInfo.name.toLowerCase()} tiles</h2>
          <div className="flex gap-2 flex-wrap">
            {["All", ...TILE_TYPES].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                data-testid={`filter-chip-${t.toLowerCase()}`}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full transition-colors ${
                  typeFilter === t ? "bg-navy text-white" : "bg-white text-ink hover:bg-white/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {filteredTiles.length === 0 ? (
          <p className="text-ink/60 text-sm py-10" data-testid="no-tiles-message">No tiles found in this range yet. Check back soon or ask us on WhatsApp.</p>
        ) : (
          <div className="grid gap-6 sm:gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {filteredTiles.map((tile) => (
              <TileCard key={tile.id} tile={tile} />
            ))}
          </div>
        )}
      </section>

      <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
  );
}
