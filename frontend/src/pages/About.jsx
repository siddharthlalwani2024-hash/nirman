import { MessageCircle } from "lucide-react";
import { SEO } from "../components/SEO";
import { resolveImageUrl } from "../lib/image";
import { useSettings } from "../context/SettingsContext";
import { buildWhatsAppLink, generalInquiryMessage } from "../lib/whatsapp";

export default function About() {
  const settings = useSettings();
  if (!settings) return null;
  const waLink = settings.whatsapp_number ? buildWhatsAppLink(settings.whatsapp_number, generalInquiryMessage()) : "#";

  return (
    <div data-testid="about-page">
      <SEO title="About Us" description={settings.about_story} />
      <section className="relative h-[42vh] min-h-[300px] overflow-hidden">
        {settings.showroom_photo && (
          <img src={resolveImageUrl(settings.showroom_photo)} alt="Nirman Udyog showroom" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-navy/50" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <h1 className="font-serif text-4xl sm:text-5xl text-ivory text-center">About {settings.business_name}</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <div>
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Our Story</p>
          <p className="text-ink leading-relaxed text-base sm:text-lg" data-testid="about-story">{settings.about_story}</p>
        </div>
        <div>
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Why Us</p>
          <p className="text-ink leading-relaxed text-base sm:text-lg" data-testid="about-why-us">{settings.about_why_us}</p>
        </div>
        {settings.kajaria_dealer_badge && (
          <div className="inline-flex items-center gap-2 bg-[#15508B] text-white rounded-md px-4 py-2.5">
            <span className="text-xs sm:text-sm font-semibold tracking-wide">AUTHORIZED KAJARIA DEALER</span>
          </div>
        )}
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          data-testid="about-whatsapp-cta"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle size={20} /> Say Hello on WhatsApp
        </a>
      </section>
    </div>
  );
}
