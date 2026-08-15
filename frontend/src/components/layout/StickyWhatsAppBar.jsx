import { MessageCircle, Phone } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useStickyBar } from "../../context/StickyBarContext";
import { buildWhatsAppLink, generalInquiryMessage } from "../../lib/whatsapp";

export function StickyWhatsAppBar() {
  const settings = useSettings();
  const stickyBar = useStickyBar();
  if (!settings || !settings.whatsapp_number) return null;

  const message = stickyBar?.override?.message || generalInquiryMessage();
  const label = stickyBar?.override?.label || "Chat on WhatsApp";
  const waLink = buildWhatsAppLink(settings.whatsapp_number, message);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sticky-wa-safe">
      <div className="bg-bone/95 backdrop-blur-md border-t border-greige shadow-[0_-6px_20px_-6px_rgba(0,0,0,0.15)] px-4 py-3 flex items-center gap-3 max-w-3xl mx-auto">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          data-testid="sticky-whatsapp-button"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-full shadow-md border-2 border-cobalt hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle size={20} /> {label}
        </a>
        <a
          href={`tel:${settings.phone}`}
          data-testid="sticky-call-button"
          aria-label="Call now"
          className="flex items-center justify-center w-12 h-12 rounded-full border border-clay text-clay hover:bg-clay hover:text-bone transition-colors shrink-0"
        >
          <Phone size={18} />
        </a>
      </div>
    </div>
  );
}
