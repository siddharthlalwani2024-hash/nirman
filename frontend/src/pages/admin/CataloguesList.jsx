import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, Download } from "lucide-react";
import { api } from "../../lib/api";
import { resolveImageUrl } from "../../lib/image";

export default function CataloguesList() {
  const [catalogues, setCatalogues] = useState([]);
  const load = () => api.get("/admin/catalogues").then((res) => setCatalogues(res.data));
  useEffect(() => {
    load();
  }, []);

  const remove = async (c) => {
    if (!window.confirm("Delete this catalogue?")) return;
    await api.delete(`/admin/catalogues/${c.id}`);
    load();
  };

  const togglePublish = async (c) => {
    await api.put(`/admin/catalogues/${c.id}`, { published: !c.published });
    load();
  };

  return (
    <div data-testid="admin-catalogues-list">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-ink">Catalogues</h1>
        <Link to="/admin/catalogues/new" data-testid="new-catalogue-button" className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-full hover:bg-gold transition-colors">
          <Plus size={16} /> New Catalogue
        </Link>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {catalogues.map((c) => (
          <div key={c.id} data-testid={`admin-catalogue-${c.id}`} className="bg-white border border-stone rounded-md overflow-hidden">
            <div className="w-full h-40 bg-ivory flex items-center justify-center overflow-hidden">
              {c.cover_image ? (
                <img src={resolveImageUrl(c.cover_image)} alt="" className="w-full h-full object-cover" />
              ) : (
                <FileText size={36} className="text-navy/30" />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs uppercase text-gold font-semibold mb-1">{c.category}</p>
              <p className="text-sm text-ink truncate mb-1">{c.title}</p>
              <p className="text-xs text-ink/60 mb-3 flex items-center gap-1">
                <Download size={12} /> {c.download_count || 0} downloads
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublish(c)} data-testid={`toggle-publish-catalogue-${c.id}`} className={c.published ? "text-green-600" : "text-ink/40"}>
                  {c.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <Link to={`/admin/catalogues/${c.id}/edit`} data-testid={`edit-catalogue-${c.id}`} className="text-ink/60 hover:text-gold">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => remove(c)} data-testid={`delete-catalogue-${c.id}`} className="text-ink/60 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {catalogues.length === 0 && <p className="text-ink/60 text-sm">No catalogues yet. Add your first Kajaria PDF catalogue.</p>}
    </div>
  );
}
