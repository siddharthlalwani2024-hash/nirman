import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { resolveImageUrl } from "../../lib/image";

const MAX = 6;

export default function FeaturedPicks() {
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/admin/tiles").then((res) => {
      setTiles(res.data);
      setSelected(res.data.filter((t) => t.featured).map((t) => t.id));
    });
  }, []);

  const toggle = (id) => {
    setSelected((sel) => {
      if (sel.includes(id)) return sel.filter((s) => s !== id);
      if (sel.length >= MAX) return sel;
      return [...sel, id];
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/tiles-featured", { tile_ids: selected });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-featured-picks">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h1 className="font-serif text-3xl text-ink">Featured Picks</h1>
        <span data-testid="featured-count" className={`text-sm font-semibold ${selected.length >= MAX ? "text-gold" : "text-ink/60"}`}>
          {selected.length} / {MAX} selected
        </span>
      </div>
      <p className="text-ink/60 text-sm mb-6 max-w-xl">
        Pick up to {MAX} tiles to show in the "Featured" section on the homepage. Swap them out anytime — a quick way to refresh the look each week.
      </p>
      {saved && (
        <p data-testid="featured-saved-message" className="text-green-700 text-sm mb-4">
          Featured picks updated
        </p>
      )}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {tiles.map((tile) => {
          const isSelected = selected.includes(tile.id);
          const disabled = !isSelected && selected.length >= MAX;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => toggle(tile.id)}
              disabled={disabled}
              data-testid={`featured-pick-${tile.slug}`}
              className={`relative text-left border rounded-md overflow-hidden transition-all bg-white ${
                isSelected ? "border-gold ring-2 ring-gold" : "border-stone"
              } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:-translate-y-1"}`}
            >
              <div className="aspect-[4/3] bg-white">
                <img src={resolveImageUrl(tile.images?.[0]?.thumb_url)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink truncate">{tile.name}</p>
                <p className="text-xs text-ink/60">{tile.sku}</p>
              </div>
              {isSelected && <span className="absolute top-2 right-2 bg-navy text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Featured</span>}
            </button>
          );
        })}
      </div>
      {tiles.length === 0 && <p className="text-ink/60 text-sm">No tiles yet.</p>}
      <button
        onClick={save}
        disabled={saving}
        data-testid="featured-save-button"
        className="mt-8 bg-navy text-white px-7 py-3 rounded-full hover:bg-gold transition-colors disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Featured Picks"}
      </button>
    </div>
  );
}
