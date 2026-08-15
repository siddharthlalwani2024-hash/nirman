import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { SEO } from "../components/SEO";
import { useSettings } from "../context/SettingsContext";
import { buildWhatsAppLink, generalInquiryMessage } from "../lib/whatsapp";

export default function Contact() {
  const settings = useSettings();
  if (!settings) return null;
  const waLink = settings.whatsapp_number ? buildWhatsAppLink(settings.whatsapp_number, generalInquiryMessage()) : "#";

  return (
    <div data-testid="contact-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <SEO title="Contact Us" description="Visit our showroom or reach us on WhatsApp and phone." />
      <div className="mb-10">
        <p className="text-clay text-sm font-semibold tracking-widest uppercase mb-2">Get In Touch</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink">Visit the Showroom</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <MapPin className="text-clay shrink-0 mt-1" size={22} />
            <div>
              <p className="text-sm text-ink/60 uppercase tracking-wide mb-1">Address</p>
              <p className="text-ink" data-testid="contact-address">{settings.address}</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Clock className="text-clay shrink-0 mt-1" size={22} />
            <div>
              <p className="text-sm text-ink/60 uppercase tracking-wide mb-1">Hours</p>
              <p className="text-ink" data-testid="contact-hours">{settings.hours}</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Phone className="text-clay shrink-0 mt-1" size={22} />
            <div>
              <p className="text-sm text-ink/60 uppercase tracking-wide mb-1">Phone</p>
              <a href={`tel:${settings.phone}`} data-testid="contact-call-link" className="text-ink hover:text-clay transition-colors">
                {settings.phone}
              </a>
            </div>
          </div>
          <div className="bg-canvasAlt border border-grout rounded-lg p-6 mt-2">
            <p className="text-xs text-ink/60 uppercase tracking-wide mb-4">Prefer to just message us?</p>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              data-testid="contact-whatsapp-cta"
              className="group flex items-center gap-3 bg-[#25D366] text-white font-semibold px-5 py-4 rounded-full shadow-lift hover:brightness-105 hover:scale-[1.01] active:scale-95 transition-all duration-200"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 shrink-0">
                <MessageCircle size={18} />
              </span>
              Message on WhatsApp
            </a>
            <a
              href={`tel:${settings.phone}`}
              data-testid="contact-call-cta"
              className="flex items-center justify-center gap-2 text-sm text-ink/70 hover:text-clay transition-colors mt-4"
            >
              <Phone size={15} /> or call {settings.phone}
            </a>
          </div>
        </div>

        {settings.map_embed_url && (
          <div className="rounded-md overflow-hidden border border-grout aspect-square lg:aspect-auto lg:h-full min-h-[320px]">
            <iframe
              title="Showroom location"
              src={settings.map_embed_url}
              data-testid="contact-map-embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  );
}
