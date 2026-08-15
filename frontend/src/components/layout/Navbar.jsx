import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ROOMS } from "../../constants/rooms";
import { useSettings } from "../../context/SettingsContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const links = [
    { to: "/", label: "Home" },
    ...ROOMS.map((r) => ({ to: `/tiles/${r.slug}`, label: r.name })),
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bone/95 backdrop-blur-md border-b border-greige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2.5 font-serif text-xl lg:text-2xl text-charcoal tracking-tight">
          {settings?.logo_url && <img src={settings.logo_url} alt="Nirman Udyog logo" className="h-9 w-9 object-contain" />}
          Nirman <span className="text-cobalt">Udyog</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide pb-1 border-b-2 transition-colors ${
                  isActive ? "text-cobalt border-cobalt" : "text-charcoal border-transparent hover:text-cobalt hover:border-cobalt"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button data-testid="mobile-menu-toggle" className="lg:hidden text-charcoal" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-bone border-t border-greige px-4 pb-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) => `block py-3 text-base border-b border-greige/60 ${isActive ? "text-cobalt" : "text-charcoal"}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
