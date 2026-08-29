import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { Reveal } from "./Reveal";
import { CatalogueCard } from "./CatalogueCard";

export function CataloguePreview() {
  const [catalogues, setCatalogues] = useState([]);

  useEffect(() => {
    api.get("/catalogues").then((res) => setCatalogues(res.data.slice(0, 3)));
  }, []);

  if (catalogues.length === 0) return null;

  return (
    <Reveal>
      <section className="bg-white py-16 sm:py-20" data-testid="catalogue-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
            <div>
              <p className="text-gold text-sm font-bold tracking-widest uppercase mb-2">Product literature</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink">Browse our catalogues</h2>
            </div>
            <Link to="/catalogues" data-testid="catalogue-preview-view-all" className="flex items-center gap-1.5 text-sm font-medium text-navy hover:text-gold transition-colors">
              View all catalogues <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {catalogues.map((c) => (
              <CatalogueCard key={c.id} catalogue={c} />
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
