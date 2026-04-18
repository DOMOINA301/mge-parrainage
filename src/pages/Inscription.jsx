import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveStudent } from "../services/localStorageService";
import ConfirmModal from "../components/ConfirmModal";

export default function Inscription() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    universite: "",
    parcours: "",
    classe: "",
    telephone: "",
    adresse: "",
    statut: "actif"
  });
  const [photo, setPhoto] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "statut") {
      setForm({ ...form, [name]: value.toLowerCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError("");

    try {
      // Préparer les données de l'étudiant
      const studentData = {
        ...form,
        statut: String(form.statut).toLowerCase().trim(),
        photo: photo ? URL.createObjectURL(photo) : null,
        createdAt: new Date().toISOString()
      };

      console.log("📝 Données à sauvegarder:", studentData);

      // Sauvegarde dans le stockage local
      await saveStudent(studentData);
      
      console.log("✅ Inscription réussie");
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError("Erreur lors de l'inscription");
      alert("❌ Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate("/students");
  };

  return (
    <div style={styles.container}>
      {/* En-tête avec retour */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>Inscription étudiant</h1>
      </div>

      {/* Formulaire */}
      <div style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Ligne 1: Nom et Prénom */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nom *</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Nom"
                required
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prénom *</label>
              <input
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Prénom"
                required
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {/* Ligne 2: Sexe */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Sexe</label>
            <select
              name="sexe"
              value={form.sexe}
              onChange={handleChange}
              style={styles.select}
              disabled={loading}
            >
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>

          {/* Ligne 3: Université */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Université</label>
            <input
              name="universite"
              value={form.universite}
              onChange={handleChange}
              placeholder="Université"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Ligne 4: Parcours et Classe */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Parcours</label>
              <input
                name="parcours"
                value={form.parcours}
                onChange={handleChange}
                placeholder="Parcours"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Classe</label>
              <input
                name="classe"
                value={form.classe}
                onChange={handleChange}
                placeholder="Classe"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {/* Ligne 5: Téléphone */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone *</label>
            <input
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="Téléphone"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Ligne 6: Adresse */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Adresse</label>
            <input
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              placeholder="Adresse"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Ligne 7: Statut */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Statut initial</label>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              style={styles.select}
              disabled={loading}
            >
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>

          {/* Upload photo */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
              disabled={loading}
            />
            <span style={styles.fileHint}>Format accepté : jpg, png</span>
          </div>

          {/* Boutons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
              disabled={loading}
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
              {loading ? "Inscription..." : "Inscrire"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmation */}
      <ConfirmModal
        open={showConfirmModal}
        title="Confirmation"
        message={<span style={{ color: "#000000" }}>Voulez-vous vraiment inscrire cet étudiant ?</span>}
        onConfirm={confirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Confirmer"
        cancelText="Annuler"
      />

      {/* Modal de succès */}
      <ConfirmModal
        open={showSuccessModal}
        title="Succès"
        message={<span style={{ color: "#000000" }}>✅ Inscription réussie !</span>}
        onConfirm={handleSuccessConfirm}
        onCancel={handleSuccessConfirm}
        confirmText="OK"
        hideCancel={true}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },

  backButton: {
    padding: '8px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333333',
    cursor: 'pointer',
  },

  title: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#333333',
    margin: 0,
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    border: '1px solid #f0f0f0',
    maxWidth: '700px',
    margin: '0 auto',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#555555',
  },

  input: {
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#ffffff',
    outline: 'none',
  },

  select: {
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
  },

  fileInput: {
    padding: '8px',
    border: '1px dashed #e0e0e0',
    borderRadius: '6px',
    fontSize: '13px',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
  },

  fileHint: {
    fontSize: '11px',
    color: '#999999',
    marginTop: '2px',
  },

  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },

  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#555555',
    cursor: 'pointer',
  },

  submitButton: {
    flex: 2,
    padding: '12px',
    backgroundColor: '#4da6ff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#ffffff',
    cursor: 'pointer',
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};