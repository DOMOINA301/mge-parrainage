import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMotifModal, setShowMotifModal] = useState(false);
  const [motif, setMotif] = useState("");
  const [motifAutre, setMotifAutre] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => alert("❌ Impossible de charger l’étudiant"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const executeSave = async (formData) => {
    setLoading(true);
    try {
      await api.put(`/students/${id}`, formData);

      if (photo) {
        const data = new FormData();
        data.append("photo", photo);
        await api.put(`/students/${id}/photo`, data);
      }

      setSuccessMessage("✅ Les informations ont été modifiées avec succès !");
      setShowSuccessModal(true);
      
    } catch {
      alert("❌ Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = async () => {
    setShowModal(false);
    
    // CORRIGÉ: utilise "suspendu" en minuscules
    if (form.statut === "suspendu") {
      setShowMotifModal(true);
      return;
    }

    await executeSave(form);
  };

  const saveWithMotif = async () => {
    setShowMotifModal(false);
    
    // Détermine le motif final
    let motifFinal = motif;
    if (motif === "Autre") {
      motifFinal = motifAutre;
    }

    // Ajoute le motif au formulaire
    const formWithMotif = {
      ...form,
      motifSuspension: motifFinal,
      dateSuspension: new Date().toISOString()
    };
    
    await executeSave(formWithMotif);
    setMotif("");
    setMotifAutre("");
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate("/students", { replace: true });
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);

    try {
      await api.delete(`/students/${id}`);
      setSuccessMessage("✅ L'étudiant a été supprimé avec succès !");
      setShowSuccessModal(true);
    } catch {
      alert("❌ Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* En-tête avec retour et bouton supprimer */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>Modifier l'étudiant</h1>
        <button 
          onClick={() => setShowDeleteModal(true)}
          style={styles.deleteButton}
          disabled={loading}
        >
          🗑️ Supprimer
        </button>
      </div>

      {/* Formulaire */}
      <div style={styles.formCard}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
          style={styles.form}
        >
          {/* Ligne 1: Nom et Prénom */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nom</label>
              <input 
                name="nom" 
                value={form.nom || ""} 
                onChange={handleChange}
                placeholder="Nom"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prénom</label>
              <input 
                name="prenom" 
                value={form.prenom || ""} 
                onChange={handleChange}
                placeholder="Prénom"
                style={styles.input}
              />
            </div>
          </div>

          {/* Ligne 2: Sexe */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Sexe</label>
            <select 
              name="sexe" 
              value={form.sexe || ""} 
              onChange={handleChange}
              style={styles.select}
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
              value={form.universite || ""} 
              onChange={handleChange}
              placeholder="Université"
              style={styles.input}
            />
          </div>

          {/* Ligne 4: Parcours et Classe */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Parcours</label>
              <input 
                name="parcours" 
                value={form.parcours || ""} 
                onChange={handleChange}
                placeholder="Parcours"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Classe</label>
              <input 
                name="classe" 
                value={form.classe || ""} 
                onChange={handleChange}
                placeholder="Classe"
                style={styles.input}
              />
            </div>
          </div>

          {/* Ligne 5: Téléphone */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone</label>
            <input 
              name="telephone" 
              value={form.telephone || ""} 
              onChange={handleChange}
              placeholder="Téléphone"
              style={styles.input}
            />
          </div>

          {/* Ligne 6: Adresse */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Adresse</label>
            <input 
              name="adresse" 
              value={form.adresse || ""} 
              onChange={handleChange}
              placeholder="Adresse"
              style={styles.input}
            />
          </div>

          {/* Ligne 7: Statut - CORRIGÉ avec minuscules */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Statut</label>
            <select 
              name="statut" 
              value={form.statut || ""} 
              onChange={handleChange}
              style={styles.select}
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
              onChange={(e) => setPhoto(e.target.files[0])}
              style={styles.fileInput}
              accept="image/*"
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
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmation (avant modification) */}
      <ConfirmModal
        open={showModal}
        title="Confirmation"
        message={<span style={{ color: "#000000" }}>Voulez-vous vraiment modifier cet étudiant ?</span>}
        onConfirm={confirmSave}
        onCancel={() => setShowModal(false)}
        confirmText="Confirmer"
        cancelText="Annuler"
      />

      {/* Modal pour motif de suspension */}
      <ConfirmModal
        open={showMotifModal}
        title="Motif de suspension"
        message={
          <div style={{ color: "#000000" }}>
            <p style={{ marginBottom: "15px", fontWeight: "500" }}>
              Veuillez indiquer le motif de la suspension :
            </p>
            <select
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                marginBottom: "10px",
                color: "#000000",
                backgroundColor: "#ffffff"
              }}
            >
              <option value="">Sélectionner un motif</option>
              <option value="Fin d'études">🎓 Fin d'études</option>
              <option value="Congé maternité">🤰 Congé maternité</option>
              <option value="Abandon">📝 Abandon</option>
              <option value="Exclusion">⛔ Exclusion</option>
              <option value="Transfert">🔄 Transfert</option>
              <option value="Raison médicale">🏥 Raison médicale</option>
              <option value="Autre">Autre</option>
            </select>
            
            {motif === "Autre" && (
              <textarea
                placeholder="Précisez le motif..."
                value={motifAutre}
                onChange={(e) => setMotifAutre(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  marginTop: "10px",
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  minHeight: "80px",
                  fontFamily: "inherit"
                }}
              />
            )}
          </div>
        }
        onConfirm={saveWithMotif}
        onCancel={() => {
          setShowMotifModal(false);
          setMotif("");
          setMotifAutre("");
          setLoading(false);
        }}
        confirmText="Confirmer la suspension"
        cancelText="Annuler"
        disableConfirm={!motif || (motif === "Autre" && !motifAutre)}
      />

      {/* Modal de confirmation suppression */}
      <ConfirmModal
        open={showDeleteModal}
        title="Confirmation de suppression"
        message={
          <span style={{ color: "#000000" }}>
            ⚠️ Êtes-vous sûr de vouloir supprimer cet étudiant ?<br />
            Cette action est irréversible.
          </span>
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      {/* Modal de succès (après modification ou suppression) */}
      <ConfirmModal
        open={showSuccessModal}
        title="Succès"
        message={<span style={{ color: "#000000" }}>{successMessage}</span>}
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
    flexWrap: 'wrap',
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
    flex: 1,
  },

  deleteButton: {
    padding: '8px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#8b3d3d',
    cursor: 'pointer',
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
    backgroundColor: '#f0f0f0',
    border: '1px solid #d0d0d0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333333',
    cursor: 'pointer',
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};