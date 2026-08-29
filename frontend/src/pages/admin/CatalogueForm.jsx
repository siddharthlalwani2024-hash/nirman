import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { CATALOGUE_CATEGORIES } from "../../constants/catalogues";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { PdfUploader } from "../../components/admin/PdfUploader";

const empty = {
  title: "",
  category: "Ceramic",
  year: new Date().getFullYear(),
  cover_image: "",
  pdf_url: "",
  file_size_mb: null,
  page_count: "",
  description: "",
  featured: false,
  published: true,
};

export default function CatalogueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) api.get(`/admin/catalogues/${id}`).then((res) => setForm({ ...empty, ...res.data }));
  }, [id, isEdit]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pdf_url) {
      alert("Please upload a PDF file");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        year: form.year ? Number(form.year) : null,
        cover_image: form.cover_image,
        pdf_url: form.pdf_url,
        file_size_mb: form.file_size_mb,
        page_count: form.page_count ? Number(form.page_count) : null,
        description: form.description,
        featured: form.featured,
        published: form.published,
      };
      if (isEdit) await api.put(`/admin/catalogues/${id}`, payload);
      else await api.post("/admin/catalogues", payload);
      navigate("/admin/catalogues");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-catalogue-form">
      <h1 className="font-serif text-3xl text-ink mb-8">{isEdit ? "Edit Catalogue" : "New Catalogue"}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Field label="Title">
          <input data-testid="catalogue-form-title" required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select data-testid="catalogue-form-category" value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
              {CATALOGUE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Year">
            <input type="number" data-testid="catalogue-form-year" value={form.year || ""} onChange={(e) => set("year", e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="PDF File">
          <PdfUploader
            value={form.pdf_url}
            onChange={(result) => {
              set("pdf_url", result ? result.url : "");
              if (result) set("file_size_mb", result.file_size_mb);
            }}
          />
        </Field>
        <Field label="Cover Image (optional)">
          <ImageUploader images={form.cover_image ? [{ url: form.cover_image, thumb_url: form.cover_image, medium_url: form.cover_image }] : []} onChange={(imgs) => set("cover_image", imgs[0]?.url || "")} multiple={false} folder="catalogues" />
        </Field>
        <Field label="Page Count (optional)">
          <input type="number" data-testid="catalogue-form-page-count" value={form.page_count || ""} onChange={(e) => set("page_count", e.target.value)} className="input" />
        </Field>
        <Field label="Description">
          <textarea data-testid="catalogue-form-description" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="input" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" data-testid="catalogue-form-featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" data-testid="catalogue-form-published" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published
        </label>
        <button type="submit" disabled={saving} data-testid="catalogue-form-submit" className="bg-navy text-white px-7 py-3 rounded-full hover:bg-gold transition-colors disabled:opacity-60">
          {saving ? "Saving…" : "Save Catalogue"}
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
