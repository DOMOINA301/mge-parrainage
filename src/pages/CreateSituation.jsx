import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveSituation } from "../services/localStorageService";
import { useAuth } from "../context/AuthContext";

export default function CreateSituation() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    typeSituation: "",
    description: "",
    montantDemande: "",
    urgence: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const situation = {
      studentId: studentId,
      typeSituation: form.typeSituation,
      description: form.description || "Aucune description",
      montantDemande: form.montantDemande,
      urgence: form.urgence,
      statut: "EN_ATTENTE_RESPONSABLE",
      dateSituation: new Date().toISOString(),
      createdBy: user?.id,
      createdByName: user?.nom
    };

    await saveSituation(situation);
    navigate(`/students/${studentId}/situations`);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(`/students/${studentId}`)} style={styles.backButton}>← Retour</button>
        <h1 style={styles.title}>Nouvelle situation</h1>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={submit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type de situation</label>
            <select name="typeSituation" value={form.typeSituation} onChange={handleChange} required style={styles.select}>
              <option value="">-- Sélectionnez --</option>
              <option value="Difficulté financière">💰 Difficulté financière</option>
              <option value="Problème de santé">🏥 Problème de santé</option>
              <option value="Problème académique">📚 Problème académique</option>
              <option value="Situation familiale">👪 Situation familiale</option>
              <option value="Demande d'aide exceptionnelle">⭐ Demande d'aide exceptionnelle</option>
              <option value="Autre">🔄 Autre</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="5" placeholder="Décrivez la situation..." style={styles.textarea} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Montant demandé (Ar)</label>
            <input type="number" name="montantDemande" value={form.montantDemande} onChange={handleChange} placeholder="0" style={styles.input} />
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="urgence" checked={form.urgence} onChange={handleChange} style={styles.checkbox} />
              <span>⚠️ Marquer comme urgent</span>
            </label>
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={() => navigate(`/students/${studentId}`)} style={styles.cancelButton}>Annuler</button>
            <button type="submit" disabled={loading} style={{...styles.submitButton, ...(loading ? styles.buttonDisabled : {})}}>{loading ? "Enregistrement..." : "Enregistrer"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '16px', backgroundColor: '#f5f7fb', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: { padding: '10px 16px', backgroundColor: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '500', color: '#4da6ff', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '600', color: '#333', margin: 0 },
  formCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '24px', maxWidth: '600px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#333' },
  input: { padding: '14px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', outline: 'none' },
  select: { padding: '14px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', backgroundColor: '#fff' },
  textarea: { padding: '14px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', outline: 'none', resize: 'vertical', minHeight: '120px', fontFamily: 'inherit' },
  checkboxGroup: { padding: '8px 0' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '16px' },
  cancelButton: { flex: 1, padding: '14px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '500', color: '#666', cursor: 'pointer' },
  submitButton: { flex: 2, padding: '14px', backgroundColor: '#4da6ff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '500', color: '#fff', cursor: 'pointer' },
  buttonDisabled: { backgroundColor: '#a0c4ff', cursor: 'not-allowed' },
};