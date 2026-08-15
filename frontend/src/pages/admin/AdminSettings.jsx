import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ImageUploader } from "../../components/admin/ImageUploader";

export default function AdminSettings() {
  const [tab, setTab] = useState("site");
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    api.get("/site-settings").then((res) => setSettings(res.data));
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const set = (field, value) => setSettings((s) => ({ ...s, [field]: value }));
  const setSocial = (field, value) => setSettings((s) => ({ ...s, social_links: { ...s.social_links, [field]: value } }));

  const saveSettings = async (e) => {
    e.preventDefault();
    const payload = { ...settings };
    delete payload.id;
    await api.put("/admin/site-settings", payload);
    setSaved("Settings saved");
    setTimeout(() => setSaved(""), 2000);
  };

  const updateCategory = (slug, field, value) => setCategories((cats) => cats.map((c) => (c.slug === slug ? { ...c, [field]: value } : c)));

  const saveCategory = async (cat) => {
    await api.put(`/admin/categories/${cat.slug}`, {
      hero_image: cat.hero_image,
      description: cat.description,
      meta_title: cat.meta_title,
      meta_description: cat.meta_description,
    });
    setSaved(`${cat.name} category saved`);
    setTimeout(() => setSaved(""), 2000);
  };

  if (!settings) return null;

  return (
    <div data-testid="admin-settings-page">
      <h1 className="font-serif text-3xl text-ink mb-6">Settings</h1>
      <div className="flex gap-2 mb-8">
        <button onClick={() => setTab("site")} data-testid="settings-tab-site" className={`px-4 py-2 rounded-full text-sm ${tab === "site" ? "bg-clay text-canvas" : "bg-canvasAlt text-ink"}`}>
          Site Settings
        </button>
        <button onClick={() => setTab("categories")} data-testid="settings-tab-categories" className={`px-4 py-2 rounded-full text-sm ${tab === "categories" ? "bg-clay text-canvas" : "bg-canvasAlt text-ink"}`}>
          Categories
        </button>
      </div>
      {saved && (
        <p data-testid="settings-saved-message" className="text-green-700 text-sm mb-4">
          {saved}
        </p>
      )}

      {tab === "site" && (
        <form onSubmit={saveSettings} className="max-w-2xl space-y-5">
          <Field label="Business Name">
            <input data-testid="settings-business-name" className="input" value={settings.business_name || ""} onChange={(e) => set("business_name", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <input data-testid="settings-tagline" className="input" value={settings.tagline || ""} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Years in Business">
            <input type="number" data-testid="settings-years" className="input" value={settings.years_in_business || 0} onChange={(e) => set("years_in_business", Number(e.target.value))} />
          </Field>
          <Field label="Phone">
            <input data-testid="settings-phone" className="input" value={settings.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="WhatsApp Number (country code + digits, no plus or spaces)">
            <input data-testid="settings-whatsapp" className="input" value={settings.whatsapp_number || ""} onChange={(e) => set("whatsapp_number", e.target.value)} />
          </Field>
          <Field label="Address">
            <textarea data-testid="settings-address" className="input" rows={2} value={settings.address || ""} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <Field label="Hours">
            <input data-testid="settings-hours" className="input" value={settings.hours || ""} onChange={(e) => set("hours", e.target.value)} />
          </Field>
          <Field label="Map Embed URL">
            <input data-testid="settings-map-url" className="input" value={settings.map_embed_url || ""} onChange={(e) => set("map_embed_url", e.target.value)} />
          </Field>
          <Field label="Showroom Photo">
            <ImageUploader
              images={settings.showroom_photo ? [{ url: settings.showroom_photo, thumb_url: settings.showroom_photo }] : []}
              onChange={(imgs) => set("showroom_photo", imgs[0]?.url || "")}
              multiple={false}
              folder="settings"
            />
          </Field>
          <Field label="Home Hero Images">
            <ImageUploader
              images={(settings.hero_images || []).map((u) => ({ url: u, thumb_url: u }))}
              onChange={(imgs) => set("hero_images", imgs.map((i) => i.url))}
              multiple={true}
              folder="settings"
            />
          </Field>
          <Field label="Logo">
            <ImageUploader
              images={settings.logo_url ? [{ url: settings.logo_url, thumb_url: settings.logo_url }] : []}
              onChange={(imgs) => set("logo_url", imgs[0]?.url || "")}
              multiple={false}
              folder="settings"
            />
          </Field>
          <Field label="Exhibition Centre / Building Photo">
            <ImageUploader
              images={settings.showroom_building_photo ? [{ url: settings.showroom_building_photo, thumb_url: settings.showroom_building_photo }] : []}
              onChange={(imgs) => set("showroom_building_photo", imgs[0]?.url || "")}
              multiple={false}
              folder="settings"
            />
          </Field>
          <Field label="Trust Stats: SKUs Stocked">
            <input type="number" data-testid="settings-skus-stocked" className="input" value={settings.skus_stocked || 0} onChange={(e) => set("skus_stocked", Number(e.target.value))} />
          </Field>
          <Field label="Trust Stats: Projects Completed">
            <input type="number" data-testid="settings-projects-completed" className="input" value={settings.projects_completed || 0} onChange={(e) => set("projects_completed", Number(e.target.value))} />
          </Field>
          <Field label="Trust Stats: Warranty Years">
            <input type="number" data-testid="settings-warranty-years" className="input" value={settings.warranty_years || 0} onChange={(e) => set("warranty_years", Number(e.target.value))} />
          </Field>
          <Field label="Premium Kajaria Collections (name / tagline)">
            <div className="space-y-3">
              {(settings.premium_collections || []).map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input"
                    placeholder="Collection name"
                    value={c.name || ""}
                    data-testid={`settings-collection-name-${i}`}
                    onChange={(e) => {
                      const next = [...(settings.premium_collections || [])];
                      next[i] = { ...next[i], name: e.target.value };
                      set("premium_collections", next);
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Tagline"
                    value={c.tagline || ""}
                    data-testid={`settings-collection-tagline-${i}`}
                    onChange={(e) => {
                      const next = [...(settings.premium_collections || [])];
                      next[i] = { ...next[i], tagline: e.target.value };
                      set("premium_collections", next);
                    }}
                  />
                </div>
              ))}
            </div>
          </Field>
          <Field label="About: Our Story">
            <textarea data-testid="settings-about-story" className="input" rows={4} value={settings.about_story || ""} onChange={(e) => set("about_story", e.target.value)} />
          </Field>
          <Field label="About: Why Us">
            <textarea data-testid="settings-about-why-us" className="input" rows={4} value={settings.about_why_us || ""} onChange={(e) => set("about_why_us", e.target.value)} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" data-testid="settings-kajaria-badge" checked={!!settings.kajaria_dealer_badge} onChange={(e) => set("kajaria_dealer_badge", e.target.checked)} /> Show
            Authorized Kajaria Dealer badge
          </label>
          <Field label="Facebook URL">
            <input data-testid="settings-facebook" className="input" value={settings.social_links?.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} />
          </Field>
          <Field label="Instagram URL">
            <input data-testid="settings-instagram" className="input" value={settings.social_links?.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} />
          </Field>
          <button type="submit" data-testid="settings-save-button" className="bg-clay text-canvas px-7 py-3 rounded-full hover:bg-claydark transition-colors">
            Save Settings
          </button>
        </form>
      )}

      {tab === "categories" && (
        <div className="space-y-8 max-w-2xl">
          {categories.map((cat) => (
            <div key={cat.slug} data-testid={`category-edit-${cat.slug}`} className="border border-grout rounded-md p-5 bg-white">
              <h3 className="font-serif text-lg text-ink mb-4">{cat.name}</h3>
              <Field label="Hero Image">
                <ImageUploader
                  images={cat.hero_image ? [{ url: cat.hero_image, thumb_url: cat.hero_image }] : []}
                  onChange={(imgs) => updateCategory(cat.slug, "hero_image", imgs[0]?.url || "")}
                  multiple={false}
                  folder="categories"
                />
              </Field>
              <Field label="Description">
                <textarea
                  data-testid={`category-description-${cat.slug}`}
                  className="input"
                  rows={2}
                  value={cat.description || ""}
                  onChange={(e) => updateCategory(cat.slug, "description", e.target.value)}
                />
              </Field>
              <button onClick={() => saveCategory(cat)} data-testid={`category-save-${cat.slug}`} className="bg-clay text-canvas px-5 py-2 rounded-full text-sm hover:bg-claydark transition-colors">
                Save {cat.name}
              </button>
            </div>
          ))}
        </div>
      )}
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
