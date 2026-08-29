import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { ROOMS } from "../../constants/rooms";
import { useSettings } from "../../context/SettingsContext";
import { buildWhatsAppLink, generalInquiryMessage } from "../../lib/whatsapp";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  const links = [
    { to: "/", label: "Home" },
    ...ROOMS.map((r) => ({ to: `/tiles/${r.slug}`, label: r.name })),
    { to: "/gallery", label: "Gallery" },
    { to: "/catalogues", label: "Catalogues" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const enquireLink = settings?.whatsapp_number ? buildWhatsAppLink(settings.whatsapp_number, generalInquiryMessage()) : null;

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-stone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2.5 ml-1 sm:ml-3 shrink-0">
          {settings?.logo_url && <img src={settings.logo_url} alt="Nirman Udyog logo" className="h-11 lg:h-12 w-auto object-contain" />}
          <span className="font-serif text-xl lg:text-2xl tracking-tight text-ink whitespace-nowrap">
            Nirman <span className="italic text-gold">Udyog</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `group relative text-sm font-medium tracking-wide py-1 whitespace-nowrap transition-colors ${
                  isActive ? "text-gold" : "text-ink hover:text-gold"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[1px] bg-gold transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center shrink-0">
          {enquireLink && (
            <a
              href={enquireLink}
              target="_blank"
              rel="noreferrer"
              data-testid="navbar-enquire-button"
              className="flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-gold transition-colors duration-200"
            >
              <MessageCircle size={16} /> Enquire
            </a>
          )}
        </div>
        <button data-testid="mobile-menu-toggle" className="lg:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-ivory border-t border-stone px-4 pb-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) => `block py-3 text-base border-b border-stone/60 ${isActive ? "text-gold" : "text-ink"}`}
            >
              {l.label}
            </NavLink>
          ))}
          {enquireLink && (
            <a
              href={enquireLink}
              target="_blank"
              rel="noreferrer"
              data-testid="mobile-navbar-enquire-button"
              className="flex items-center justify-center gap-2 bg-navy text-white text-sm font-medium px-5 py-3 rounded-sm mt-4"
            >
              <MessageCircle size={16} /> Enquire
            </a>
          )}
        </div>
      )}
    </header>
  );
}
