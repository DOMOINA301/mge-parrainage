import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateSituation() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    typeSituation: "",
    description: "",
    montantDemande: "",
    urgence: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // DÉBUG
      const token = localStorage.getItem("token");
      console.log("=== REQUÊTE VERS BACKEND ===");
      console.log("URL:", "http://localhost:5000/api/situations");
      console.log("Student ID:", studentId);
      console.log("Token:", token ? "OK" : "MANQUANT");
      console.log("Données envoyées:", {
        student: studentId,
        typeSituation: form.typeSituation,
        description: form.description || "Aucune description",
        montantDemande: form.montantDemande,
        urgence: form.urgence
      });
  
      const response = await axios.post(
        "http://localhost:5000/api/situations",
        {
          student: studentId,
          typeSituation: form.typeSituation,
          description: form.description || "Aucune description",
          montantDemande: form.montantDemande,
          urgence: form.urgence
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("SUCCÈS! Réponse:", response.data);
      navigate(`/students/${studentId}/situations`);
  
    } catch (err) {
      console.error("ERREUR COMPLÈTE:", err);
      
      if (err.response) {
        // Le serveur a répondu avec une erreur
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
        console.log("Headers:", err.response.headers);
        
        alert(`Erreur ${err.response.status}: ${err.response.data?.message || "Erreur inconnue"}`);
      } else if (err.request) {
        // La requête a été faite mais pas de réponse
        console.log("Pas de réponse du serveur");
        alert("Le serveur ne répond pas");
      } else {
        // Erreur de configuration
        console.log("Erreur:", err.message);
        alert(`Erreur: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={styles.container}>
      {/* En-tête avec retour */}
      <div style={styles.header}>
        <button
          onClick={() => navigate(`/students/${studentId}`)}
          style={styles.backButton}
        >
          ← Retour
        </button>
        <h1 style={styles.title}>Nouvelle situation</h1>
      </div>

      {/* Formulaire */}
      <div style={styles.formCard}>
        <form onSubmit={submit} style={styles.form}>
          {/* Type de situation */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Type de situation</label>
            <select
              name="typeSituation"
              value={form.typeSituation}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">-- Sélectionnez un type --</option>
              <option value="Difficulté financière">💰 Difficulté financière</option>
              <option value="Problème de santé">🏥 Problème de santé</option>
              <option value="Problème académique">📚 Problème académique</option>
              <option value="Situation familiale">👪 Situation familiale</option>
              <option value="Demande d’aide exceptionnelle">⭐ Demande d'aide exceptionnelle</option>
              <option value="Retard de paiement">⏰ Retard de paiement</option>
              <option value="Autre situation particulière">🔄 Autre situation</option>
            </select>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description détaillée</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Décrivez la situation en détail..."
              style={styles.textarea}
            />
          </div>

          {/* Montant demandé */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Montant demandé (Ar)</label>
            <input
              type="number"
              name="montantDemande"
              value={form.montantDemande}
              onChange={handleChange}
              placeholder="0"
              style={styles.input}
            />
          </div>

          {/* Urgence */}
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="urgence"
                checked={form.urgence}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>
                ⚠️ Marquer comme urgent
              </span>
            </label>
          </div>

          {/* Boutons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate(`/students/${studentId}`)}
              style={styles.cancelButton}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.buttonDisabled : {})
              }}
            >
              {loading ? "Enregistrement..." : "Enregistrer la situation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#f5f7fb',
    minHeight: '100vh',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },

  backButton: {
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#4da6ff',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },

  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    maxWidth: '600px',
    margin: '0 auto',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },

  input: {
    padding: '14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#4da6ff',
    },
  },

  select: {
    padding: '14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
  },

  textarea: {
    padding: '14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
  },

  checkboxGroup: {
    padding: '8px 0',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },

  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },

  checkboxText: {
    fontSize: '16px',
    color: '#333',
  },

  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },

  cancelButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },

  submitButton: {
    flex: 2,
    padding: '14px',
    backgroundColor: '#4da6ff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  },

  buttonDisabled: {
    backgroundColor: '#a0c4ff',
    cursor: 'not-allowed',
  },
};

const globalStyles = `
  input:hover, select:hover, textarea:hover {
    border-color: #4da6ff !important;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  .cancelButton:hover {
    background-color: #e0e0e0 !important;
  }
`;