import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ tiles: 0, photos: 0, posts: 0 });

  useEffect(() => {
    Promise.all([api.get("/admin/tiles"), api.get("/admin/demo-photos"), api.get("/admin/blog")]).then(([t, p, b]) => {
      setStats({ tiles: t.data.length, photos: p.data.length, posts: b.data.length });
    });
  }, []);

  const cards = [
    { label: "Tiles", value: stats.tiles, to: "/admin/tiles" },
    { label: "Demo Photos", value: stats.photos, to: "/admin/demo-photos" },
    { label: "Blog Posts", value: stats.posts, to: "/admin/blog" },
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-serif text-3xl text-ink mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            data-testid={`dashboard-card-${c.label.toLowerCase().replace(/ /g, "-")}`}
            className="bg-white border border-stone rounded-md p-6 hover:-translate-y-1 transition-transform"
          >
            <p className="text-4xl font-serif text-gold">{c.value}</p>
            <p className="text-ink/60 text-sm mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
