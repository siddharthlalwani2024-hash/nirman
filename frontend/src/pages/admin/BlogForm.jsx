import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { ImageUploader } from "../../components/admin/ImageUploader";

const empty = { title: "", excerpt: "", content: "", cover_image: "", published: true };

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit)
      api.get("/admin/blog").then((res) => {
        const found = res.data.find((p) => p.id === id);
        if (found) setForm(found);
      });
  }, [id, isEdit]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: form.title, excerpt: form.excerpt, content: form.content, cover_image: form.cover_image, published: form.published };
      if (isEdit) await api.put(`/admin/blog/${id}`, payload);
      else await api.post("/admin/blog", payload);
      navigate("/admin/blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-blog-form">
      <h1 className="font-serif text-3xl text-charcoal mb-8">{isEdit ? "Edit Post" : "New Post"}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Field label="Title">
          <input data-testid="blog-form-title" required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" />
        </Field>
        <Field label="Excerpt">
          <textarea data-testid="blog-form-excerpt" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="input" />
        </Field>
        <Field label="Cover Image">
          <ImageUploader
            images={form.cover_image ? [{ url: form.cover_image, thumb_url: form.cover_image }] : []}
            onChange={(imgs) => set("cover_image", imgs[0]?.url || "")}
            multiple={false}
            folder="blog"
          />
        </Field>
        <Field label="Content">
          <textarea data-testid="blog-form-content" required rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} className="input" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" data-testid="blog-form-published" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published
        </label>
        <button type="submit" disabled={saving} data-testid="blog-form-submit" className="bg-clay text-bone px-7 py-3 rounded-full hover:bg-claydark transition-colors disabled:opacity-60">
          {saving ? "Saving…" : "Save Post"}
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
