import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const load = () => api.get("/admin/blog").then((res) => setPosts(res.data));
  useEffect(() => {
    load();
  }, []);

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    await api.delete(`/admin/blog/${post.id}`);
    load();
  };
  const togglePublish = async (post) => {
    await api.put(`/admin/blog/${post.id}`, { published: !post.published });
    load();
  };

  return (
    <div data-testid="admin-blog-list">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-ink">Blog</h1>
        <Link to="/admin/blog/new" data-testid="new-blog-post-button" className="flex items-center gap-2 bg-clay text-canvas px-5 py-2.5 rounded-full hover:bg-claydark transition-colors">
          <Plus size={16} /> New Post
        </Link>
      </div>
      <div className="bg-white border border-grout rounded-md divide-y divide-grout">
        {posts.map((post) => (
          <div key={post.id} data-testid={`admin-blog-row-${post.slug}`} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="text-ink font-medium truncate">{post.title}</p>
              <p className="text-xs text-ink/60 truncate">{post.excerpt}</p>
            </div>
            <button onClick={() => togglePublish(post)} data-testid={`toggle-publish-blog-${post.slug}`} className={post.published ? "text-green-600" : "text-ink/40"}>
              {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <Link to={`/admin/blog/${post.id}/edit`} data-testid={`edit-blog-${post.slug}`} className="text-ink/60 hover:text-clay">
              <Pencil size={18} />
            </Link>
            <button onClick={() => remove(post)} data-testid={`delete-blog-${post.slug}`} className="text-ink/60 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="p-6 text-ink/60 text-sm">No posts yet.</p>}
      </div>
    </div>
  );
}
