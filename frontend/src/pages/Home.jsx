import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
import { SEO } from "../components/SEO";
import { TrustStrip } from "../components/TrustStrip";
import { TileCard } from "../components/TileCard";
import { Reveal } from "../components/Reveal";
import { StatCounters } from "../components/StatCounters";
import { ComparisonBlock } from "../components/ComparisonBlock";
import { FaqSection } from "../components/FaqSection";
import { useSettings } from "../context/SettingsContext";
import { ROOMS } from "../constants/rooms";

export default function Home() {
  const settings = useSettings();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    api.get("/tiles", { params: { featured: true } }).then((res) => setFeatured(res.data));
  }, []);

  const heroImages = settings?.hero_images?.length ? settings.hero_images : settings?.showroom_photo ? [settings.showroom_photo] : [];

  useEffect(() => {
    if (heroImages.length < 2) return;
    const timer = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const heroImage = heroImages[heroIndex % heroImages.length];
  const roomCards = categories.length ? categories : ROOMS.map((r) => ({ slug: r.slug, name: r.name, hero_image: null }));
  const ribbonIndex = roomCards.length ? new Date().getDate() % roomCards.length : -1;

  return (
    <div data-testid="home-page">
      <SEO title="Home" description={settings?.tagline} />

      <section className="relative h-[78vh] min-h-[480px] max-h-[720px] flex items-end overflow-hidden">
        <AnimatePresence>
          {heroImage && (
            <motion.img
              key={heroImage}
              src={resolveImageUrl(heroImage)}
              alt="Nirman Udyog showroom finished room"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/10" />
        <span className="corner-tick tl hidden sm:block" />
        <span className="corner-tick tr hidden sm:block" />
        <span className="corner-tick bl hidden sm:block" />
        <span className="corner-tick br hidden sm:block" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 w-full">
          <p className="text-brass text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3">Authorized Kajaria Dealer · Cooch Behar</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-canvas leading-none max-w-2xl">
            {settings?.tagline || "Tiles that finish the room, not just cover the floor."}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/gallery"
              data-testid="hero-cta-gallery"
              className="bg-clay text-canvas font-medium px-7 py-3.5 rounded-full hover:bg-claydark transition-colors duration-200"
            >
              See Finished Rooms
            </Link>
            <Link
              to="/tiles/bathroom"
              data-testid="hero-cta-bathroom"
              className="border border-canvas/50 text-canvas font-medium px-7 py-3.5 rounded-full hover:bg-canvas/10 hover:border-canvas transition-colors duration-200 backdrop-blur-sm"
            >
              Browse Bathroom Tiles
            </Link>
          </div>
          {heroImages.length > 1 && (
            <div className="flex gap-2 mt-10" data-testid="hero-slideshow-dots">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show hero image ${i + 1}`}
                  data-testid={`hero-dot-${i}`}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "w-8 bg-brass" : "w-4 bg-canvas/40 hover:bg-canvas/60"}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <TrustStrip />

      <Reveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="mb-10">
            <p className="text-clay text-sm font-bold tracking-widest uppercase mb-2">Shop by room</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">Find tiles for every space</h2>
          </div>
          <div className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
            {roomCards.map((cat, idx) => (
              <Link
                key={cat.slug}
                to={`/tiles/${cat.slug}`}
                data-testid={`room-category-card-${cat.slug}`}
                className="group relative aspect-[4/5] rounded-md overflow-hidden bg-canvasAlt block shadow-soft hover:shadow-lift transition-shadow duration-300"
              >
                {cat.hero_image && (
                  <img
                    src={resolveImageUrl(cat.hero_image)}
                    alt={`${cat.name} tiles`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                {idx === ribbonIndex && (
                  <span className="absolute top-3 right-0 bg-brass text-ink text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-l-full shadow-md">
                    Kajaria Featured
                  </span>
                )}
                <div className="absolute bottom-0 left-0 p-4 flex items-center gap-1.5">
                  <span className="relative font-serif text-xl sm:text-2xl text-canvas">
                    {cat.name}
                    <span className="absolute left-0 -bottom-1 h-[2px] bg-grout w-full">
                      <span className="absolute inset-0 bg-clay origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </span>
                  <Check size={16} className="text-brass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <StatCounters settings={settings} />

      {settings?.premium_collections?.length > 0 && (
        <Reveal>
          <section className="bg-ink py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <p className="text-brass text-xs font-bold tracking-widest uppercase mb-6 text-center sm:text-left">Premium Kajaria Collections</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {settings.premium_collections.map((c, i) => (
                  <div key={c.name} className={`pt-4 sm:pt-0 text-center sm:text-left ${i > 0 ? "sm:pl-10" : ""}`}>
                    <p className="font-serif text-xl sm:text-2xl text-canvas">{c.name}</p>
                    <p className="text-xs text-white/50 mt-1">{c.tagline}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {settings?.showroom_building_photo && (
        <Reveal>
          <section className="relative">
            <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
              <img
                src={resolveImageUrl(settings.showroom_building_photo)}
                alt="Kajaria Galaxy — Nirman Udyog exhibition centre exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 bg-ink text-canvas px-5 py-3 sm:px-8 sm:py-4">
              <p className="font-serif text-lg sm:text-xl">Kajaria Galaxy — Our Exhibition Centre</p>
              {settings.years_in_business && <p className="text-xs text-canvas/70 mt-0.5">{settings.years_in_business} years in the industry</p>}
            </div>
          </section>
        </Reveal>
      )}

      {featured.length > 0 && (
        <Reveal>
          <section className="bg-canvas py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-10">
                <p className="text-clay text-sm font-bold tracking-widest uppercase mb-2">Handpicked</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-ink">Featured tiles</h2>
              </div>
              <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                {featured.map((tile) => (
                  <TileCard key={tile.id} tile={tile} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      <ComparisonBlock />
      <FaqSection />
    </div>
  );
}

