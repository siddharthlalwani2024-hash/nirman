import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { ROOMS, TILE_TYPES } from "../../constants/rooms";
import { ImageUploader } from "../../components/admin/ImageUploader";

const empty = { name: "", sku: "", type: "GVT", size: "", finish: "", rooms: [], description: "", images: [], featured: false, published: true };

export default function TileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) api.get(`/admin/tiles/${id}`).then((res) => setForm(res.data));
  }, [id, isEdit]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleRoom = (slug) => set("rooms", form.rooms.includes(slug) ? form.rooms.filter((r) => r !== slug) : [...form.rooms, slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id;
      delete payload.slug;
      delete payload.created_at;
      delete payload.updated_at;
      if (isEdit) await api.put(`/admin/tiles/${id}`, payload);
      else await api.post("/admin/tiles", payload);
      navigate("/admin/tiles");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-tile-form">
      <h1 className="font-serif text-3xl text-charcoal mb-8">{isEdit ? "Edit Tile" : "New Tile"}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name">
            <input data-testid="tile-form-name" required value={form.name} onChange={(e) => set("name", e.target.value)} className="input" />
          </Field>
          <Field label="SKU">
            <input data-testid="tile-form-sku" required value={form.sku} onChange={(e) => set("sku", e.target.value)} className="input" />
          </Field>
          <Field label="Type">
            <select data-testid="tile-form-type" value={form.type} onChange={(e) => set("type", e.target.value)} className="input">
              {TILE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <input data-testid="tile-form-size" placeholder="600x600mm" required value={form.size} onChange={(e) => set("size", e.target.value)} className="input" />
          </Field>
          <Field label="Finish">
            <input data-testid="tile-form-finish" value={form.finish} onChange={(e) => set("finish", e.target.value)} className="input" />
          </Field>
        </div>

        <Field label="Rooms">
          <div className="flex gap-2 flex-wrap">
            {ROOMS.map((r) => (
              <button
                type="button"
                key={r.slug}
                onClick={() => toggleRoom(r.slug)}
                data-testid={`tile-form-room-${r.slug}`}
                className={`text-sm px-4 py-2 rounded-full ${form.rooms.includes(r.slug) ? "bg-clay text-bone" : "bg-greige text-charcoal"}`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Description">
          <textarea data-testid="tile-form-description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="input" />
        </Field>

        <Field label="Images">
          <ImageUploader images={form.images} onChange={(imgs) => set("images", imgs)} folder="tiles" />
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" data-testid="tile-form-featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" data-testid="tile-form-published" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published
          </label>
        </div>

        <button type="submit" disabled={saving} data-testid="tile-form-submit" className="bg-clay text-bone px-7 py-3 rounded-full hover:bg-claydark transition-colors disabled:opacity-60">
          {saving ? "Saving…" : "Save Tile"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-taupe uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  );
}
