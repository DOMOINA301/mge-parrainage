import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    role: "RESPONSABLE"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("📤 Données envoyées:", form);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("✅ Réponse:", response.data);

      navigate("/login", { 
        state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." }
      });
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      console.error("📡 Réponse erreur:", err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>

        {error && (
          <div style={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom complet</label>
            <input
              name="nom"
              type="text"
              placeholder="Votre nom"
              value={form.nom}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rôle</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={styles.select}
              disabled={loading}
            >
              <option value="RESPONSABLE">Responsable</option>
              <option value="SPONSOR">Sponsor</option>
              <option value="ETUDIANT">Étudiant</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? "Inscription en cours..." : "Créer le compte"}
          </button>
        </form>

        <p style={styles.footer}>
          Déjà un compte ? <Link to="/login" style={styles.link}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "16px",
  },
  
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#333",
  },

  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  },

  input: {
    padding: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    color: "#000000",
    ':focus': {
      borderColor: "#4da6ff",
    },
  },

  select: {
    padding: "12px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#000000",
    cursor: "pointer",
  },

  button: {
    padding: "14px",
    backgroundColor: "#4da6ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },

  buttonDisabled: {
    backgroundColor: "#a0c4ff",
    cursor: "not-allowed",
  },

  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },

  link: {
    color: "#4da6ff",
    textDecoration: "none",
    fontWeight: "500",
  },
};