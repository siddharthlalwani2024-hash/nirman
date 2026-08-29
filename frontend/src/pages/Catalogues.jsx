import { useEffect, useState } from "react";
import { SEO } from "../components/SEO";
import { CatalogueCard } from "../components/CatalogueCard";
import { api } from "../lib/api";
import { CATALOGUE_CATEGORIES } from "../constants/catalogues";

export default function Catalogues() {
  const [catalogues, setCatalogues] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    api.get("/catalogues").then((res) => setCatalogues(res.data));
  }, []);

  const filtered = categoryFilter === "All" ? catalogues : catalogues.filter((c) => c.category === categoryFilter);

  return (
    <div data-testid="catalogues-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <SEO title="Catalogues" description="Download official Kajaria tile catalogues — Ceramic, GVT, PVT and Gres ranges — from Nirman Udyog." />
      <div className="mb-8">
        <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Product literature</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink">Catalogues</h1>
        <p className="text-ink/60 mt-2 max-w-xl">Browse and download our official range catalogues, organized by tile category.</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {["All", ...CATALOGUE_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            data-testid={`catalogue-filter-${c.toLowerCase()}`}
            className={`text-xs sm:text-sm px-4 py-2 rounded-full transition-colors ${
              categoryFilter === c ? "bg-navy text-white" : "bg-white border border-stone text-ink hover:border-navy"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {filtered.map((c) => (
          <CatalogueCard key={c.id} catalogue={c} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p data-testid="catalogues-empty-state" className="text-ink/60 text-sm py-10">
          No catalogues in this category yet. Ask us on WhatsApp and we'll send it directly.
        </p>
      )}
    </div>
  );
}
