import { MessageCircle, Phone } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useStickyBar } from "../../context/StickyBarContext";
import { buildWhatsAppLink, generalInquiryMessage } from "../../lib/whatsapp";

export function StickyWhatsAppBar() {
  const settings = useSettings();
  const stickyBar = useStickyBar();
  if (!settings || !settings.whatsapp_number) return null;

  const message = stickyBar?.override?.message || generalInquiryMessage();
  const label = stickyBar?.override?.label || "Chat with us";
  const waLink = buildWhatsAppLink(settings.whatsapp_number, message);

  return (
    <div
      className="fixed z-50 flex flex-col items-end gap-2.5"
      style={{ bottom: "max(1.1rem, env(safe-area-inset-bottom))", right: "1.1rem" }}
    >
      <a
        href={`tel:${settings.phone}`}
        data-testid="sticky-call-button"
        aria-label="Call now"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-canvas border border-grout text-ink shadow-soft hover:border-clay hover:text-clay transition-colors duration-200"
      >
        <Phone size={16} />
      </a>

      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        data-testid="sticky-whatsapp-button"
        className="group relative flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-14 h-14 sm:w-auto sm:h-auto sm:px-5 sm:py-3.5 rounded-full bg-[#25D366] text-white shadow-lift hover:brightness-105 hover:scale-[1.03] active:scale-95 transition-all duration-200"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping [animation-duration:2.6s] motion-reduce:hidden" />
        <MessageCircle size={22} className="relative shrink-0" />
        <span className="relative hidden sm:inline text-sm font-semibold whitespace-nowrap">{label}</span>
      </a>
    </div>
  );
}
