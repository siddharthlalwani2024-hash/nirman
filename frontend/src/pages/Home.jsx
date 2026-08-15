import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
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
  const roomCards = categories.length ? categories : ROOMS.map((r) => ({ slug: r.slug, name: r.name, hero_image: null }));
  const ribbonIndex = roomCards.length ? new Date().getDate() % roomCards.length : -1;

  return (
    <div data-testid="home-page">
      <SEO title="Home" description={settings?.tagline} />

      <section className="relative h-[78vh] min-h-[480px] max-h-[720px] flex items-end overflow-hidden">
        {heroImage && (
          <img src={resolveImageUrl(heroImage)} alt="Nirman Udyog showroom finished room" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-charcoal/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 w-full">
          <p className="text-[#9DC0EA] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3">Authorized Kajaria Dealer · Cooch Behar</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-bone leading-none max-w-2xl">
            {settings?.tagline || "Tiles that finish the room, not just cover the floor."}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/gallery" data-testid="hero-cta-gallery" className="bg-cobalt text-white font-medium px-7 py-3.5 rounded-full hover:bg-cobaltdark transition-colors">
              See Finished Rooms
            </Link>
            <Link
              to="/tiles/bathroom"
              data-testid="hero-cta-bathroom"
              className="bg-clay/10 border border-clay text-white font-medium px-7 py-3.5 rounded-full hover:bg-clay/20 transition-colors backdrop-blur-sm"
            >
              Browse Bathroom Tiles
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-cobalt text-sm font-bold tracking-widest uppercase mb-2">Shop by room</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">Find tiles for every space</h2>
        </div>
        <div className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
          {roomCards.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/tiles/${cat.slug}`}
              data-testid={`room-category-card-${cat.slug}`}
              className="group relative aspect-[3/4] rounded-md overflow-hidden bg-greige block"
            >
              {cat.hero_image && (
                <img
                  src={resolveImageUrl(cat.hero_image)}
                  alt={`${cat.name} tiles`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              {idx === ribbonIndex && (
                <span className="absolute top-3 right-0 bg-cobalt text-white text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-l-full shadow-md">
                  Kajaria Featured
                </span>
              )}
              <div className="absolute bottom-0 left-0 p-4 flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl text-bone border-b-2 border-transparent group-hover:border-cobalt transition-colors">
                  {cat.name}
                </span>
                <Check size={16} className="text-[#9DC0EA] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {settings?.premium_collections?.length > 0 && (
        <section className="bg-ink py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-[#9DC0EA] text-xs font-bold tracking-widest uppercase mb-6 text-center sm:text-left">Premium Kajaria Collections</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {settings.premium_collections.map((c, i) => (
                <div key={c.name} className={`pt-4 sm:pt-0 text-center sm:text-left ${i > 0 ? "sm:pl-10" : ""}`}>
                  <p className="font-serif text-xl sm:text-2xl text-bone">{c.name}</p>
                  <p className="text-xs text-white/50 mt-1">{c.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.showroom_building_photo && (
        <section className="relative">
          <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src={resolveImageUrl(settings.showroom_building_photo)}
              alt="Kajaria Galaxy — Nirman Udyog exhibition centre exterior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-cobalt text-white px-5 py-3 sm:px-8 sm:py-4">
            <p className="font-serif text-lg sm:text-xl">Kajaria Galaxy — Our Exhibition Centre</p>
            {settings.years_in_business && <p className="text-xs text-white/70 mt-0.5">{settings.years_in_business} years in the industry</p>}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="bg-skymist py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10">
              <p className="text-cobalt text-sm font-bold tracking-widest uppercase mb-2">Handpicked</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">Featured tiles</h2>
            </div>
            <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {featured.map((tile) => (
                <TileCard key={tile.id} tile={tile} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
