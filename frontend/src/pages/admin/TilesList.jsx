import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";
import { resolveImageUrl } from "../../lib/image";

export default function TilesList() {
  const [tiles, setTiles] = useState([]);

  const load = () => api.get("/admin/tiles").then((res) => setTiles(res.data));
  useEffect(() => {
    load();
  }, []);

  const toggle = async (tile, field) => {
    await api.put(`/admin/tiles/${tile.id}`, { [field]: !tile[field] });
    load();
  };

  const remove = async (tile) => {
    if (!window.confirm(`Delete "${tile.name}"?`)) return;
    await api.delete(`/admin/tiles/${tile.id}`);
    load();
  };

  return (
    <div data-testid="admin-tiles-list">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-ink">Tiles</h1>
        <Link to="/admin/tiles/new" data-testid="new-tile-button" className="flex items-center gap-2 bg-clay text-canvas px-5 py-2.5 rounded-full hover:bg-claydark transition-colors">
          <Plus size={16} /> New Tile
        </Link>
      </div>
      <div className="bg-white border border-grout rounded-md divide-y divide-grout">
        {tiles.map((tile) => (
          <div key={tile.id} data-testid={`admin-tile-row-${tile.slug}`} className="flex items-center gap-4 p-4">
            <img src={resolveImageUrl(tile.images?.[0]?.thumb_url)} alt="" className="w-14 h-14 rounded-md object-cover bg-canvasAlt shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-ink font-medium truncate">{tile.name}</p>
              <p className="text-xs text-ink/60">
                {tile.sku} · {tile.type} · {tile.rooms?.join(", ")}
              </p>
            </div>
            <button onClick={() => toggle(tile, "featured")} data-testid={`toggle-featured-${tile.slug}`} title="Toggle featured" className={tile.featured ? "text-clay" : "text-ink/40"}>
              <Star size={18} fill={tile.featured ? "currentColor" : "none"} />
            </button>
            <button onClick={() => toggle(tile, "published")} data-testid={`toggle-published-${tile.slug}`} title="Toggle published" className={tile.published ? "text-green-600" : "text-ink/40"}>
              {tile.published ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <Link to={`/admin/tiles/${tile.id}/edit`} data-testid={`edit-tile-${tile.slug}`} className="text-ink/60 hover:text-clay">
              <Pencil size={18} />
            </Link>
            <button onClick={() => remove(tile)} data-testid={`delete-tile-${tile.slug}`} className="text-ink/60 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tiles.length === 0 && <p className="p-6 text-ink/60 text-sm">No tiles yet.</p>}
      </div>
    </div>
  );
}
