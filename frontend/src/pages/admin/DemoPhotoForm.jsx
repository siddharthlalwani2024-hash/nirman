import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { ROOMS } from "../../constants/rooms";
import { ImageUploader } from "../../components/admin/ImageUploader";

const empty = { image: null, room: "bathroom", caption: "", tile_ids: [], published: true };

export default function DemoPhotoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [tiles, setTiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/tiles").then((res) => setTiles(res.data));
    if (isEdit)
      api.get("/admin/demo-photos").then((res) => {
        const found = res.data.find((p) => p.id === id);
        if (found) setForm(found);
      });
  }, [id, isEdit]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleTile = (tileId) => set("tile_ids", form.tile_ids.includes(tileId) ? form.tile_ids.filter((t) => t !== tileId) : [...form.tile_ids, tileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload a photo");
      return;
    }
    setSaving(true);
    try {
      const payload = { image: form.image, room: form.room, caption: form.caption, tile_ids: form.tile_ids, published: form.published };
      if (isEdit) await api.put(`/admin/demo-photos/${id}`, payload);
      else await api.post("/admin/demo-photos", payload);
      navigate("/admin/demo-photos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-demo-photo-form">
      <h1 className="font-serif text-3xl text-ink mb-8">{isEdit ? "Edit Demo Photo" : "New Demo Photo"}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Field label="Photo">
          <ImageUploader images={form.image ? [form.image] : []} onChange={(imgs) => set("image", imgs[0] || null)} multiple={false} folder="demo-photos" editableAlt />
        </Field>
        <Field label="Room">
          <select data-testid="demo-photo-form-room" value={form.room} onChange={(e) => set("room", e.target.value)} className="input">
            {ROOMS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Caption">
          <input data-testid="demo-photo-form-caption" value={form.caption} onChange={(e) => set("caption", e.target.value)} className="input" />
        </Field>
        <Field label="Tiles used in this look">
          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto border border-stone rounded-md p-3">
            {tiles.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleTile(t.id)}
                data-testid={`demo-photo-tile-option-${t.slug}`}
                className={`text-xs px-3 py-1.5 rounded-full ${form.tile_ids.includes(t.id) ? "bg-navy text-white" : "bg-white text-ink"}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" data-testid="demo-photo-form-published" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published
        </label>
        <button type="submit" disabled={saving} data-testid="demo-photo-form-submit" className="bg-navy text-white px-7 py-3 rounded-full hover:bg-gold transition-colors disabled:opacity-60">
          {saving ? "Saving…" : "Save Photo"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-ink/60 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  );
}
