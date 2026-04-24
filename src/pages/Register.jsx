import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "RESPONSABLE"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation du mot de passe fort
  const validatePassword = (password) => {
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir une majuscule';
    if (!/[a-z]/.test(password)) return 'Le mot de passe doit contenir une minuscule';
    if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir un chiffre';
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.nom.trim()) {
      setError("Le nom est requis");
      setLoading(false);
      return;
    }

    if (!form.email.trim()) {
      setError("L'email est requis");
      setLoading(false);
      return;
    }

    // Validation mot de passe fort
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    const result = await register({
      nom: form.nom,
      email: form.email,
      password: form.password,
      role: form.role
    });
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." }
        });
      }, 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>

        {success && <div style={styles.successMessage}>✅ {success}</div>}
        {error && <div style={styles.errorMessage}>❌ {error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom complet *</label>
            <input 
              name="nom" 
              type="text"
              placeholder="Jean Dupont" 
              value={form.nom} 
              onChange={handleChange} 
              required 
              style={styles.input} 
              disabled={loading} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input 
              name="email" 
              type="email" 
              placeholder="jean@example.com" 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={styles.input} 
              disabled={loading} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe *</label>
            <input 
              name="password" 
              type="password" 
              placeholder="8 caractères, 1 majuscule, 1 chiffre" 
              value={form.password} 
              onChange={handleChange} 
              required 
              style={styles.input} 
              disabled={loading} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmer le mot de passe *</label>
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirmer" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              required 
              style={styles.input} 
              disabled={loading} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rôle</label>
            <select name="role" value={form.role} onChange={handleChange} style={styles.select} disabled={loading}>
              <option value="RESPONSABLE">Responsable</option>
              <option value="SPONSOR">Sponsor</option>
            </select>
            <p style={styles.hint}>Le rôle ADMIN est réservé</p>
          </div>

          <button type="submit" disabled={loading} style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}>
            {loading ? "Inscription en cours..." : "Créer mon compte"}
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
    boxSizing: "border-box"
  },
  card: { 
    width: "100%", 
    maxWidth: "450px", 
    backgroundColor: "#fff", 
    borderRadius: "20px", 
    padding: "32px 24px", 
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)" 
  },
  title: { 
    textAlign: "center", 
    marginBottom: "24px", 
    color: "#333", 
    fontSize: "24px", 
    fontWeight: "600" 
  },
  successMessage: { 
    backgroundColor: "#d4edda", 
    color: "#155724", 
    padding: "12px", 
    borderRadius: "8px", 
    marginBottom: "20px", 
    textAlign: "center" 
  },
  errorMessage: { 
    backgroundColor: "#f8d7da", 
    color: "#721c24", 
    padding: "12px", 
    borderRadius: "8px", 
    marginBottom: "20px", 
    textAlign: "center" 
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", fontWeight: "500", color: "#555" },
  input: { 
    padding: "14px", 
    border: "2px solid #e0e0e0", 
    borderRadius: "12px", 
    fontSize: "16px", 
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.3s"
  },
  select: { 
    padding: "14px", 
    border: "2px solid #e0e0e0", 
    borderRadius: "12px", 
    fontSize: "16px", 
    backgroundColor: "#fff",
    outline: "none",
    cursor: "pointer"
  },
  hint: { fontSize: "11px", color: "#999", marginTop: "4px" },
  button: { 
    padding: "14px", 
    backgroundColor: "#4da6ff", 
    color: "#fff", 
    border: "none", 
    borderRadius: "12px", 
    fontSize: "16px", 
    fontWeight: "600", 
    cursor: "pointer",
    marginTop: "8px"
  },
  buttonDisabled: { backgroundColor: "#a0c4ff", cursor: "not-allowed" },
  footer: { marginTop: "24px", textAlign: "center", color: "#666" },
  link: { color: "#4da6ff", textDecoration: "none", fontWeight: "500" }
};