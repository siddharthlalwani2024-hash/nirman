import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatApiErrorDetail } from "../../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} data-testid="admin-login-form" className="bg-canvas rounded-md p-8 w-full max-w-sm">
        <h1 className="font-serif text-2xl text-ink mb-1">Nirman Udyog</h1>
        <p className="text-ink/60 text-sm mb-6">Admin sign in</p>
        {error && (
          <p data-testid="login-error" className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}
        <label className="block text-xs text-ink/60 uppercase tracking-wide mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="login-email-input"
          required
          className="w-full border border-grout rounded-md px-3 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-clay"
        />
        <label className="block text-xs text-ink/60 uppercase tracking-wide mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="login-password-input"
          required
          className="w-full border border-grout rounded-md px-3 py-2.5 mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-clay"
        />
        <button
          type="submit"
          disabled={loading}
          data-testid="login-submit-button"
          className="w-full bg-clay text-canvas font-medium py-3 rounded-full hover:bg-claydark transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
