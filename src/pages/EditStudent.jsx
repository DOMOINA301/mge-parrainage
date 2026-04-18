import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, saveStudent, deleteStudent } from "../services/localStorageService";
import ConfirmModal from "../components/ConfirmModal";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMotifModal, setShowMotifModal] = useState(false);
  const [motif, setMotif] = useState("");
  const [motifAutre, setMotifAutre] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      const student = await getStudentById(id);
      if (student) {
        setForm(student);
      } else {
        alert("Étudiant non trouvé");
        navigate("/students");
      }
    };
    loadStudent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const executeSave = async (formData) => {
    setLoading(true);
    try {
      await saveStudent(formData);
      setSuccessMessage("✅ Modifications enregistrées !");
      setShowSuccessModal(true);
    } catch (error) {
      alert("❌ Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = async () => {
    setShowModal(false);
    if (form.statut === "suspendu") {
      setShowMotifModal(true);
      return;
    }
    await executeSave(form);
  };

  const saveWithMotif = async () => {
    setShowMotifModal(false);
    let motifFinal = motif === "Autre" ? motifAutre : motif;
    const formWithMotif = { ...form, motifSuspension: motifFinal, dateSuspension: new Date().toISOString() };
    await executeSave(formWithMotif);
    setMotif("");
    setMotifAutre("");
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setLoading(true);
    await deleteStudent(id);
    setSuccessMessage("✅ Étudiant supprimé !");
    setShowSuccessModal(true);
    setLoading(false);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate("/students");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
        <h1 style={styles.title}>Modifier l'étudiant</h1>
        <button onClick={() => setShowDeleteModal(true)} style={styles.deleteButton}>🗑️ Supprimer</button>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}><label style={styles.label}>Nom</label><input name="nom" value={form.nom || ""} onChange={handleChange} style={styles.input} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Prénom</label><input name="prenom" value={form.prenom || ""} onChange={handleChange} style={styles.input} /></div>
          </div>
          <div style={styles.formGroup}><label style={styles.label}>Sexe</label><select name="sexe" value={form.sexe || ""} onChange={handleChange} style={styles.select}><option value="">Sélectionner</option><option value="Homme">Homme</option><option value="Femme">Femme</option></select></div>
          <div style={styles.formGroup}><label style={styles.label}>Université</label><input name="universite" value={form.universite || ""} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.row}><div style={styles.formGroup}><label style={styles.label}>Parcours</label><input name="parcours" value={form.parcours || ""} onChange={handleChange} style={styles.input} /></div><div style={styles.formGroup}><label style={styles.label}>Classe</label><input name="classe" value={form.classe || ""} onChange={handleChange} style={styles.input} /></div></div>
          <div style={styles.formGroup}><label style={styles.label}>Téléphone</label><input name="telephone" value={form.telephone || ""} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Adresse</label><input name="adresse" value={form.adresse || ""} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Statut</label><select name="statut" value={form.statut || ""} onChange={handleChange} style={styles.select}><option value="actif">Actif</option><option value="suspendu">Suspendu</option></select></div>
          
          <div style={styles.buttonGroup}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelButton}>Annuler</button>
            <button type="submit" disabled={loading} style={{...styles.submitButton, ...(loading ? styles.buttonDisabled : {})}}>{loading ? "Enregistrement..." : "Enregistrer"}</button>
          </div>
        </form>
      </div>

      <ConfirmModal open={showModal} title="Confirmation" message={<span>Modifier cet étudiant ?</span>} onConfirm={confirmSave} onCancel={() => setShowModal(false)} confirmText="Confirmer" cancelText="Annuler" />
      <ConfirmModal open={showMotifModal} title="Motif de suspension" message={<div><select value={motif} onChange={(e) => setMotif(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}><option value="">Sélectionner</option><option value="Fin d'études">Fin d'études</option><option value="Abandon">Abandon</option><option value="Autre">Autre</option></select>{motif === "Autre" && <textarea placeholder="Précisez..." value={motifAutre} onChange={(e) => setMotifAutre(e.target.value)} style={{ width: '100%', padding: '10px' }} />}</div>} onConfirm={saveWithMotif} onCancel={() => setShowMotifModal(false)} confirmText="Confirmer" cancelText="Annuler" />
      <ConfirmModal open={showDeleteModal} title="Suppression" message={<span>⚠️ Supprimer définitivement ?</span>} onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} confirmText="Supprimer" cancelText="Annuler" />
      <ConfirmModal open={showSuccessModal} title="Succès" message={<span>{successMessage}</span>} onConfirm={handleSuccessConfirm} onCancel={handleSuccessConfirm} confirmText="OK" hideCancel={true} />
    </div>
  );
}

const styles = {
  container: { padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  backButton: { padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer' },
  title: { fontSize: '22px', fontWeight: '500', color: '#333', margin: 0, flex: 1 },
  deleteButton: { padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', color: '#8b3d3d', cursor: 'pointer' },
  formCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '700px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#555' },
  input: { padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  select: { padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none', cursor: 'pointer' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '20px' },
  cancelButton: { flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' },
  submitButton: { flex: 2, padding: '12px', backgroundColor: '#4da6ff', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' },
  buttonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
};