import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";
import { resolveImageUrl } from "../../lib/image";

export default function DemoPhotosList() {
  const [photos, setPhotos] = useState([]);
  const load = () => api.get("/admin/demo-photos").then((res) => setPhotos(res.data));
  useEffect(() => {
    load();
  }, []);

  const remove = async (photo) => {
    if (!window.confirm("Delete this photo?")) return;
    await api.delete(`/admin/demo-photos/${photo.id}`);
    load();
  };

  const togglePublish = async (photo) => {
    await api.put(`/admin/demo-photos/${photo.id}`, { ...photo, published: !photo.published });
    load();
  };

  return (
    <div data-testid="admin-demo-photos-list">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-ink">Demo Photos</h1>
        <Link to="/admin/demo-photos/new" data-testid="new-demo-photo-button" className="flex items-center gap-2 bg-clay text-canvas px-5 py-2.5 rounded-full hover:bg-claydark transition-colors">
          <Plus size={16} /> New Photo
        </Link>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {photos.map((photo) => (
          <div key={photo.id} data-testid={`admin-demo-photo-${photo.id}`} className="bg-white border border-grout rounded-md overflow-hidden">
            <img src={resolveImageUrl(photo.image.thumb_url)} alt="" className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="text-xs uppercase text-clay font-semibold mb-1">{photo.room}</p>
              <p className="text-sm text-ink truncate mb-2">{photo.caption}</p>
              <p className="text-xs text-ink/60 mb-3">{photo.tile_ids?.length || 0} tile(s) linked</p>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublish(photo)} data-testid={`toggle-publish-demo-${photo.id}`} className={photo.published ? "text-green-600" : "text-ink/40"}>
                  {photo.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <Link to={`/admin/demo-photos/${photo.id}/edit`} data-testid={`edit-demo-photo-${photo.id}`} className="text-ink/60 hover:text-clay">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => remove(photo)} data-testid={`delete-demo-photo-${photo.id}`} className="text-ink/60 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {photos.length === 0 && <p className="text-ink/60 text-sm">No demo photos yet.</p>}
    </div>
  );
}
