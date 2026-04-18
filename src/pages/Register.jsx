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
    role: "RESPONSABLE"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const result = await register(form);
    
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
          <input name="nom" placeholder="Nom complet" value={form.nom} onChange={handleChange} required style={styles.input} disabled={loading} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} disabled={loading} />
          <input name="password" type="password" placeholder="Mot de passe (min 6 caractères)" value={form.password} onChange={handleChange} required style={styles.input} disabled={loading} />
          
          <select name="role" value={form.role} onChange={handleChange} style={styles.select} disabled={loading}>
            <option value="RESPONSABLE">Responsable</option>
            <option value="SPONSOR">Sponsor</option>
            <option value="ETUDIANT">Étudiant</option>
          </select>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Inscription..." : "Créer mon compte"}
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
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "16px" },
  card: { width: "100%", maxWidth: "400px", backgroundColor: "#fff", borderRadius: "20px", padding: "32px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", marginBottom: "24px", color: "#333", fontSize: "24px" },
  successMessage: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" },
  errorMessage: { backgroundColor: "#f8d7da", color: "#721c24", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  input: { padding: "14px", border: "2px solid #e0e0e0", borderRadius: "12px", fontSize: "16px", outline: "none" },
  select: { padding: "14px", border: "2px solid #e0e0e0", borderRadius: "12px", fontSize: "16px", backgroundColor: "#fff" },
  button: { padding: "14px", backgroundColor: "#4da6ff", color: "#fff", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
  footer: { marginTop: "20px", textAlign: "center", color: "#666" },
  link: { color: "#4da6ff", textDecoration: "none" },
};