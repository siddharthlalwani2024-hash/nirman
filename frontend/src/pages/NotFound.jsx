import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div data-testid="not-found-page" className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-5xl text-ink mb-4">404</h1>
      <p className="text-ink/60 mb-6">That page doesn't exist.</p>
      <Link to="/" data-testid="not-found-home-link" className="bg-navy text-white px-6 py-3 rounded-full hover:bg-gold transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
