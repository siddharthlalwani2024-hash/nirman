import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
import { SEO } from "../components/SEO";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/blog").then((res) => setPosts(res.data));
  }, []);

  return (
    <div data-testid="blog-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <SEO title="Blog" description="Tile guides and ideas from Nirman Udyog." />
      <div className="mb-10">
        <p className="text-clay text-sm font-semibold tracking-widest uppercase mb-2">Journal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">From the Showroom</h1>
      </div>
      <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} data-testid={`blog-card-${post.slug}`} className="group block">
            <div className="aspect-[16/10] rounded-md overflow-hidden bg-greige mb-4">
              {post.cover_image && (
                <img src={resolveImageUrl(post.cover_image)} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
            <h2 className="font-serif text-xl text-charcoal group-hover:text-clay transition-colors">{post.title}</h2>
            <p className="text-sm text-taupe mt-2 leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <p className="text-taupe text-sm">No posts yet.</p>}
    </div>
  );
}
