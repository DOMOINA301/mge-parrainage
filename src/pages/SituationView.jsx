import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSituationById, updateSituationStatus } from "../services/localStorageService";

export default function SituationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [situation, setSituation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSituation();
  }, [id]);

  const loadSituation = async () => {
    const data = await getSituationById(id);
    if (data) {
      setSituation(data);
    } else {
      alert("Situation introuvable");
      navigate(-1);
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    await updateSituationStatus(id, newStatus);
    await loadSituation();
  };

  const getStatusStyle = (statut) => {
    if (statut?.includes("VALIDEE")) return { bg: "#e6f7e6", color: "#27ae60" };
    if (statut?.includes("REFUSEE")) return { bg: "#ffe6e6", color: "#e74c3c" };
    return { bg: "#fff3e0", color: "#f39c12" };
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (!situation) return null;

  const statusStyle = getStatusStyle(situation.statut);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
        <h1 style={styles.title}>Détail de la situation</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.badgeContainer}>
          {situation.urgence && <span style={styles.urgentBadge}>⚠️ URGENT</span>}
          <span style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>{situation.statut}</span>
        </div>

        <div style={styles.infoGrid}>
          <div><span style={styles.infoLabel}>Date</span><span>{new Date(situation.createdAt).toLocaleDateString()}</span></div>
          <div><span style={styles.infoLabel}>Type</span><span>{situation.typeSituation}</span></div>
          {situation.montantDemande > 0 && <div><span style={styles.infoLabel}>Montant</span><span>{parseInt(situation.montantDemande).toLocaleString()} Ar</span></div>}
        </div>

        <div style={styles.descriptionSection}>
          <h3>Description</h3>
          <p>{situation.description || "Aucune description"}</p>
        </div>

        <div style={styles.actionsSection}>
          <h3>Mettre à jour le statut</h3>
          <div style={styles.statusButtons}>
            {situation.statut === "EN_ATTENTE_RESPONSABLE" && (
              <>
                <button onClick={() => updateStatus("VALIDEE_RESPONSABLE")} style={{...styles.button, backgroundColor: "#27ae60"}}>✅ Valider (Responsable)</button>
                <button onClick={() => updateStatus("REFUSEE_RESPONSABLE")} style={{...styles.button, backgroundColor: "#e74c3c"}}>❌ Refuser (Responsable)</button>
              </>
            )}
            {situation.statut === "VALIDEE_RESPONSABLE" && (
              <button onClick={() => updateStatus("VALIDEE_SPONSOR")} style={{...styles.button, backgroundColor: "#27ae60"}}>✅ Valider (Sponsor)</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '16px', backgroundColor: '#f5f7fb', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: { padding: '10px 16px', backgroundColor: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#4da6ff' },
  title: { fontSize: '24px', fontWeight: '600', color: '#333', margin: 0 },
  loading: { textAlign: 'center', padding: '50px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px' },
  badgeContainer: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  urgentBadge: { backgroundColor: '#ffe6e6', color: '#e74c3c', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' },
  statusBadge: { padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px', marginBottom: '24px' },
  infoLabel: { display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' },
  descriptionSection: { marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px' },
  actionsSection: { borderTop: '1px solid #e0e0e0', paddingTop: '24px' },
  statusButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' },
  button: { padding: '12px 24px', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer' },
};