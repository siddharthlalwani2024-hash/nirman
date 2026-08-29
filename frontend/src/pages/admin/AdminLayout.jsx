import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Grid3x3, Image, Newspaper, Settings, LogOut, Star, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/tiles", label: "Tiles", icon: Grid3x3 },
  { to: "/admin/featured-picks", label: "Featured Picks", icon: Star },
  { to: "/admin/demo-photos", label: "Demo Photos", icon: Image },
  { to: "/admin/catalogues", label: "Catalogues", icon: FileText },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-56 bg-navy text-ivory flex flex-col shrink-0">
        <div className="px-6 py-6 font-serif text-xl border-b border-ivory/10">Nirman Udyog</div>
        <nav className="flex-1 py-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={`admin-nav-${label.toLowerCase().replace(/ /g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${isActive ? "bg-ivory/10 text-gold" : "text-ivory/70 hover:text-ivory hover:bg-ivory/5"}`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} data-testid="admin-logout-button" className="flex items-center gap-3 px-6 py-4 text-sm text-ivory/70 hover:text-ivory border-t border-ivory/10">
          <LogOut size={17} /> Logout
        </button>
      </aside>
      <main className="flex-1 p-6 sm:p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
