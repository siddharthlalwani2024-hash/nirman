import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
import { SEO } from "../components/SEO";
import { Lightbox } from "../components/Lightbox";
import { useSettings } from "../context/SettingsContext";
import { useStickyBar } from "../context/StickyBarContext";
import { buildWhatsAppLink, tileInquiryMessage } from "../lib/whatsapp";

export default function TileDetail() {
  const { slug } = useParams();
  const settings = useSettings();
  const stickyBar = useStickyBar();
  const [tile, setTile] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    api
      .get(`/tiles/${slug}`)
      .then((res) => setTile(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!tile || !stickyBar) return;
    const { setOverride } = stickyBar;
    setOverride({ message: tileInquiryMessage(tile), label: "Ask About This Tile" });
    return () => setOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tile]);

  if (notFound) return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-ink/60">Tile not found.</div>;
  if (!tile) return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-ink/60">Loading…</div>;

  const waLink = settings?.whatsapp_number ? buildWhatsAppLink(settings.whatsapp_number, tileInquiryMessage(tile)) : "#";

  return (
    <div data-testid="tile-detail-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SEO title={tile.name} description={tile.description} image={tile.images?.[0] ? resolveImageUrl(tile.images[0].url) : undefined} />

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-white rounded-md overflow-hidden mb-3">
            {tile.images?.[activeIndex] && (
              <img
                src={resolveImageUrl(tile.images[activeIndex].url)}
                alt={tile.images[activeIndex].alt_text || `${tile.name} tile closeup`}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() =>
                  setLightboxPhoto({ url: tile.images[activeIndex].url, alt_text: tile.images[activeIndex].alt_text || `${tile.name} tile closeup` })
                }
                data-testid="tile-main-image"
              />
            )}
          </div>
          {tile.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {tile.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(i)}
                  data-testid={`tile-thumbnail-${i}`}
                  className={`w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 ${i === activeIndex ? "border-kajaria" : "border-transparent"}`}
                >
                  <img src={resolveImageUrl(img.thumb_url)} alt={img.alt_text || `${tile.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-kajaria bg-kajaria/10 rounded-full px-3 py-1">{tile.type}</span>
            {tile.is_kajaria && <span className="inline-block text-[11px] font-semibold text-white bg-kajaria rounded-full px-3 py-1">Kajaria</span>}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-2" data-testid="tile-name">{tile.name}</h1>
          <p className="text-sm text-ink/60 mb-6" data-testid="tile-sku">SKU: {tile.sku}</p>

          <dl className="grid grid-cols-2 gap-4 mb-6 border-y border-stone py-5">
            <div>
              <dt className="text-xs text-ink/60 uppercase tracking-wide">Size</dt>
              <dd className="text-ink font-medium">{tile.size}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink/60 uppercase tracking-wide">Finish</dt>
              <dd className="text-ink font-medium">{tile.finish || "—"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink/60 uppercase tracking-wide mb-1">Suited for</dt>
              <dd className="flex gap-2 flex-wrap">
                {tile.rooms?.map((r) => (
                  <Link key={r} to={`/tiles/${r}`} className="text-xs bg-white text-ink px-2.5 py-1 rounded-full capitalize hover:bg-gold hover:text-white transition-colors">
                    {r}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>

          {tile.description && <p className="text-ink/90 leading-relaxed mb-8">{tile.description}</p>}

          <div className="bg-white border border-stone rounded-lg p-5">
            <p className="text-xs text-ink/60 uppercase tracking-wide mb-3">Interested in this tile?</p>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              data-testid="tile-whatsapp-cta"
              className="group flex items-center gap-3 bg-[#25D366] text-white font-semibold px-5 py-3.5 rounded-full shadow-lift hover:brightness-105 hover:scale-[1.01] active:scale-95 transition-all duration-200"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 shrink-0">
                <MessageCircle size={18} />
              </span>
              Enquire on WhatsApp
            </a>
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                data-testid="tile-call-cta"
                className="flex items-center justify-center gap-2 text-sm text-ink/70 hover:text-gold transition-colors mt-3"
              >
                <Phone size={15} /> or call {settings.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {tile.demo_photos?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-6">Seen in these rooms</h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {tile.demo_photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setLightboxPhoto(photo)}
                data-testid={`tile-demo-photo-${photo.id}`}
                className="aspect-[4/5] rounded-md overflow-hidden bg-white"
              >
                <img
                  src={resolveImageUrl(photo.image.medium_url)}
                  alt={photo.image.alt_text || photo.caption}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
    </div>
  );
}
