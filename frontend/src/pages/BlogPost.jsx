import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { resolveImageUrl } from "../lib/image";
import { SEO } from "../components/SEO";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/blog/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-ink/60">Post not found.</div>;
  if (!post) return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-ink/60">Loading…</div>;

  return (
    <div data-testid="blog-post-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <SEO title={post.title} description={post.excerpt} image={post.cover_image ? resolveImageUrl(post.cover_image) : undefined} />
      <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-6" data-testid="blog-post-title">{post.title}</h1>
      {post.cover_image && (
        <div className="aspect-[16/9] rounded-md overflow-hidden bg-white mb-8">
          <img src={resolveImageUrl(post.cover_image)} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="text-ink leading-relaxed whitespace-pre-wrap text-base sm:text-lg" data-testid="blog-post-content">
        {post.content}
      </div>
    </div>
  );
}
