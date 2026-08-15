import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { ROOMS } from "../../constants/rooms";

export function Footer() {
  const settings = useSettings();
  if (!settings) return null;

  return (
    <footer className="bg-ink text-canvas mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          {settings.logo_url ? (
            <div className="inline-block bg-canvas rounded-md p-2 mb-3">
              <img src={settings.logo_url} alt="Nirman Udyog logo" className="h-14 w-auto object-contain" />
            </div>
          ) : (
            <div className="font-serif text-2xl mb-3">{settings.business_name || "Nirman Udyog"}</div>
          )}
          <p className="text-sm text-canvas/70 leading-relaxed">{settings.tagline}</p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-canvas/50 mb-3">Explore</div>
          <ul className="space-y-2 text-sm">
            {ROOMS.map((r) => (
              <li key={r.slug}>
                <Link to={`/tiles/${r.slug}`} className="hover:text-sky-300 transition-colors" data-testid={`footer-room-${r.slug}`}>
                  {r.name} Tiles
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-canvas/50 mb-3">Visit</div>
          <ul className="space-y-3 text-sm text-canvas/80">
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span data-testid="footer-address">{settings.address}</span>
            </li>
            <li className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0" />
              <span data-testid="footer-phone">{settings.phone}</span>
            </li>
            <li className="flex gap-2">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span data-testid="footer-hours">{settings.hours}</span>
            </li>
          </ul>
        </div>
        <div>
          {settings.kajaria_dealer_badge && (
            <div data-testid="footer-kajaria-badge" className="inline-flex items-center gap-2 bg-kajaria border border-white/15 rounded-md px-3 py-2 mb-5">
              <span className="text-xs font-semibold tracking-wide">AUTHORIZED KAJARIA DEALER</span>
            </div>
          )}
          <div className="flex gap-4">
            {settings.social_links?.facebook && (
              <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" data-testid="footer-facebook" className="text-canvas/70 hover:text-sky-300 transition-colors">
                <Facebook size={18} />
              </a>
            )}
            {settings.social_links?.instagram && (
              <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram" className="text-canvas/70 hover:text-sky-300 transition-colors">
                <Instagram size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-canvas/10 py-5 text-center text-xs text-canvas/50">
        © {new Date().getFullYear()} {settings.business_name || "Nirman Udyog"}. All rights reserved.
      </div>
    </footer>
  );
}
