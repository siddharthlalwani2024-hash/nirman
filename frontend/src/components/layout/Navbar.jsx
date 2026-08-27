import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ROOMS } from "../../constants/rooms";
import { useSettings } from "../../context/SettingsContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = useSettings();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    ...ROOMS.map((r) => ({ to: `/tiles/${r.slug}`, label: r.name })),
    { to: "/gallery", label: "Gallery" },
    { to: "/catalogues", label: "Catalogues" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        transparent ? "bg-transparent border-b border-transparent" : "bg-ivory/95 backdrop-blur-md border-b border-stone"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2.5 font-serif text-xl lg:text-2xl tracking-tight">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Nirman Udyog logo" className="h-14 lg:h-16 w-auto object-contain" />
          ) : (
            <span className={transparent ? "text-white" : "text-ink"}>
              Nirman <span className="text-gold">Udyog</span>
            </span>
          )}
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `group relative text-sm font-medium tracking-wide py-1 transition-colors ${
                  isActive ? "text-gold" : transparent ? "text-white hover:text-gold" : "text-ink hover:text-gold"
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
        <button
          data-testid="mobile-menu-toggle"
          className={transparent ? "lg:hidden text-white" : "lg:hidden text-ink"}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
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
        </div>
      )}
    </header>
  );
}
