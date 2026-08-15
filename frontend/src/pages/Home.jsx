import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
import { SEO } from "../components/SEO";
import { TrustStrip } from "../components/TrustStrip";
import { TileCard } from "../components/TileCard";
import { useSettings } from "../context/SettingsContext";
import { ROOMS } from "../constants/rooms";

export default function Home() {
  const settings = useSettings();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/tiles", { params: { featured: true } }).then((res) => setFeatured(res.data));
  }, []);

  const heroImage = settings?.hero_images?.[0] || settings?.showroom_photo;

  return (
    <div data-testid="home-page">
      <SEO title="Home" description={settings?.tagline} />

      <section className="relative h-[78vh] min-h-[480px] max-h-[720px] flex items-end overflow-hidden">
        {heroImage && (
          <img src={resolveImageUrl(heroImage)} alt="Nirman Udyog showroom finished room" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-charcoal/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 w-full">
          <p className="text-bone/80 text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">Authorized Kajaria Dealer · Cooch Behar</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-bone leading-none max-w-2xl">
            {settings?.tagline || "Tiles that finish the room, not just cover the floor."}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/gallery" data-testid="hero-cta-gallery" className="bg-clay text-bone font-medium px-7 py-3.5 rounded-full hover:bg-claydark transition-colors">
              See Finished Rooms
            </Link>
            <Link to="/tiles/bathroom" data-testid="hero-cta-bathroom" className="bg-bone/10 border border-bone/40 text-bone font-medium px-7 py-3.5 rounded-full hover:bg-bone/20 transition-colors backdrop-blur-sm">
              Browse Bathroom Tiles
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-clay text-sm font-semibold tracking-widest uppercase mb-2">Shop by room</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">Find tiles for every space</h2>
        </div>
        <div className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
          {(categories.length ? categories : ROOMS.map((r) => ({ slug: r.slug, name: r.name, hero_image: null }))).map((cat) => (
            <Link
              key={cat.slug}
              to={`/tiles/${cat.slug}`}
              data-testid={`room-category-card-${cat.slug}`}
              className="group relative aspect-[3/4] rounded-md overflow-hidden bg-greige block"
            >
              {cat.hero_image && (
                <img src={resolveImageUrl(cat.hero_image)} alt={`${cat.name} tiles`} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="font-serif text-xl sm:text-2xl text-bone">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-10">
            <p className="text-clay text-sm font-semibold tracking-widest uppercase mb-2">Handpicked</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">Featured tiles</h2>
          </div>
          <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {featured.map((tile) => (
              <TileCard key={tile.id} tile={tile} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
