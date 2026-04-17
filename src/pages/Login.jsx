import { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // ✅ CORRECTION : Utiliser /login au lieu de /register
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",  // ← CHANGÉ ICI
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("✅ Login réussi, redirection vers /accueil...");
      setIsAuth(true);
      navigate("/accueil", { replace: true });

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logoContainer}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#4da6ff"/>
            </svg>
          </div>

          <h2 style={styles.title}>Bienvenue</h2>
          <p style={styles.subtitle}>Connectez-vous à votre compte</p>

          {successMessage && (
            <div style={styles.successMessage}>
              {successMessage}
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.text}>
              Pas encore de compte ?{" "}
              <Link to="/register" style={styles.link}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Styles (inchangés)
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "16px",
    boxSizing: "border-box",
  },
  
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px 24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    animation: "slideUp 0.5s ease",
  },

  logoContainer: {
    textAlign: "center",
    marginBottom: "24px",
  },

  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  subtitle: {
    margin: "0 0 32px 0",
    fontSize: "16px",
    color: "#666",
    textAlign: "center",
  },

  successMessage: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #c3e6cb",
  },

  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #f5c6cb",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  },

  input: {
    padding: "14px 16px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    outline: "none",
    transition: "border-color 0.3s ease",
    backgroundColor: "#fafafa",
    width: "100%",
    boxSizing: "border-box",
    color: "#000000",
  },

  button: {
    padding: "14px 16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#4da6ff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.1s ease",
    marginTop: "12px",
    width: "100%",
  },

  buttonDisabled: {
    backgroundColor: "#a0c4ff",
    cursor: "not-allowed",
  },

  footer: {
    marginTop: "32px",
    textAlign: "center",
  },

  text: {
    fontSize: "14px",
    color: "#666",
  },

  link: {
    color: "#4da6ff",
    textDecoration: "none",
    fontWeight: "500",
  },
};

const globalStyles = `
  input:hover {
    border-color: #4da6ff !important;
  }
  
  input:focus {
    border-color: #4da6ff !important;
    box-shadow: 0 0 0 3px rgba(77, 166, 255, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    background-color: #3a8ae0 !important;
  }
  
  button:active:not(:disabled) {
    transform: scale(0.98) !important;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 480px) {
    input, button {
      font-size: 16px !important;
    }
  }
`;