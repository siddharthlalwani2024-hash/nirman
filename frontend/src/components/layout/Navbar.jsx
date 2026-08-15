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
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-grout">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2.5 font-serif text-xl lg:text-2xl text-ink tracking-tight">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Nirman Udyog logo" className="h-10 lg:h-12 w-auto object-contain" />
          ) : (
            <span>
              Nirman <span className="text-clay">Udyog</span>
            </span>
          )}
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `group relative text-sm font-medium tracking-wide py-1 transition-colors ${
                  isActive ? "text-clay" : "text-ink hover:text-clay"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[2px] bg-clay transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <button data-testid="mobile-menu-toggle" className="lg:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-canvas border-t border-grout px-4 pb-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) => `block py-3 text-base border-b border-grout/60 ${isActive ? "text-clay" : "text-ink"}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
