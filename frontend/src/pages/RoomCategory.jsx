import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
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
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-taupe">Room not found.</div>;
  }

  return (
    <div data-testid={`room-page-${room}`}>
      <SEO title={`${roomInfo.name} Tiles`} description={category?.description} image={category?.hero_image ? resolveImageUrl(category.hero_image) : undefined} />

      <section className="relative h-[38vh] min-h-[280px] flex items-end overflow-hidden">
        {category?.hero_image && (
          <img src={resolveImageUrl(category.hero_image)} alt={`${roomInfo.name} tiles`} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-8 w-full">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-bone">{roomInfo.name} Tiles</h1>
          {category?.description && <p className="text-bone/80 mt-2 max-w-xl text-sm sm:text-base">{category.description}</p>}
        </div>
      </section>

      {photos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-6">See the look</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {photos.map((photo) => (
              <div key={photo.id} data-testid={`room-look-card-${photo.id}`} className="bg-white/60 border border-greige rounded-md overflow-hidden flex flex-col sm:flex-row">
                <button onClick={() => setLightboxPhoto(photo)} className="sm:w-1/2 aspect-[4/3] sm:aspect-auto shrink-0 overflow-hidden bg-greige">
                  <img src={resolveImageUrl(photo.image.medium_url)} alt={photo.caption} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </button>
                <div className="p-4 flex-1">
                  <p className="text-sm text-charcoal mb-3">{photo.caption}</p>
                  <p className="text-xs text-taupe uppercase tracking-wide mb-2">Tiles used</p>
                  <div className="flex flex-wrap gap-2">
                    {tiles.filter((t) => photo.tile_ids?.includes(t.id)).slice(0, 3).map((t) => (
                      <Link key={t.id} to={`/tile/${t.slug}`} className="text-xs bg-clay/10 text-clay px-2.5 py-1 rounded-full hover:bg-clay hover:text-bone transition-colors">
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">Browse {roomInfo.name.toLowerCase()} tiles</h2>
          <div className="flex gap-2 flex-wrap">
            {["All", ...TILE_TYPES].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                data-testid={`filter-chip-${t.toLowerCase()}`}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full transition-colors ${
                  typeFilter === t ? "bg-clay text-bone" : "bg-greige text-charcoal hover:bg-greige/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {filteredTiles.length === 0 ? (
          <p className="text-taupe text-sm py-10" data-testid="no-tiles-message">No tiles found in this range yet. Check back soon or ask us on WhatsApp.</p>
        ) : (
          <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
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
