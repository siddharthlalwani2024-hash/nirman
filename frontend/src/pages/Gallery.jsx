import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { SEO } from "../components/SEO";
import { DemoPhotoCard } from "../components/DemoPhotoCard";
import { Lightbox } from "../components/Lightbox";
import { ROOMS } from "../constants/rooms";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [roomFilter, setRoomFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState(null);
  const [lightboxDetail, setLightboxDetail] = useState(null);

  useEffect(() => {
    api.get("/demo-photos").then((res) => setPhotos(res.data));
  }, []);

  const filtered = roomFilter === "All" ? photos : photos.filter((p) => p.room === roomFilter);

  const openLightbox = (index) => {
    setActiveIndex(index);
    api.get(`/demo-photos/${filtered[index].id}`).then((res) => setLightboxDetail(res.data));
  };

  const move = (delta) => {
    const next = (activeIndex + delta + filtered.length) % filtered.length;
    setActiveIndex(next);
    api.get(`/demo-photos/${filtered[next].id}`).then((res) => setLightboxDetail(res.data));
  };

  return (
    <div data-testid="gallery-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <SEO title="Gallery" description="Real finished rooms — bathroom, kitchen, living, outdoor, wall and floor — using our tile range." />
      <div className="mb-8">
        <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Look book</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink">Finished Room Gallery</h1>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {["All", ...ROOMS.map((r) => r.slug)].map((r) => (
          <button
            key={r}
            onClick={() => setRoomFilter(r)}
            data-testid={`gallery-filter-${r.toLowerCase()}`}
            className={`text-xs sm:text-sm px-4 py-2 rounded-full capitalize transition-colors ${
              roomFilter === r ? "bg-navy text-white" : "bg-white text-ink hover:bg-white/70"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((photo, i) => (
          <DemoPhotoCard key={photo.id} photo={photo} onClick={() => openLightbox(i)} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-ink/60 text-sm py-10">No photos in this room yet.</p>}

      <Lightbox
        photo={lightboxDetail}
        onClose={() => setActiveIndex(null)}
        onPrev={filtered.length > 1 ? () => move(-1) : null}
        onNext={filtered.length > 1 ? () => move(1) : null}
      />
    </div>
  );
}
