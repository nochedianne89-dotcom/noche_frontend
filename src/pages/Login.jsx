import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { username, password });
      const d = res.data;
      const token = d.access_token || d.token || d.data?.access_token || d.data?.token;
      const refresh = d.refresh_token || d.data?.refresh_token;

      if (!token) {
        setError("Login succeeded but no token was returned by the API.");
        return;
      }
      localStorage.setItem("access_token", token);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      navigate("/products");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid username or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        No account yet? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}