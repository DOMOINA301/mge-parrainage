import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSituationsByStudent } from "../services/localStorageService";
import { useAuth } from "../context/AuthContext";

export default function SituationsList() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { canCreateSituation } = useAuth();
  const [situations, setSituations] = useState([]);

  useEffect(() => {
    loadSituations();
  }, []);

  const loadSituations = async () => {
    const data = await getSituationsByStudent(studentId);
    setSituations(data);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(`/students/${studentId}`)} style={styles.backButton}>← Retour</button>
        {/* Bouton Nouvelle situation - visible seulement pour RESPONSABLE */}
        {canCreateSituation() && (
          <button onClick={() => navigate(`/students/${studentId}/situations/new`)} style={styles.addButton}>
            + Nouvelle situation
          </button>
        )}
      </div>

      <h1 style={styles.title}>Situations de l'étudiant</h1>

      {situations.length === 0 && <p style={styles.emptyText}>Aucune situation enregistrée.</p>}

      {situations.map((s) => (
        <div key={s.id} style={styles.card}>
          <h4 style={styles.cardTitle}>{s.typeSituation}</h4>
          <p style={styles.cardDate}>{new Date(s.createdAt).toLocaleDateString()}</p>
          <p><span style={{...styles.badge, ...(s.urgence ? styles.urgent : styles.normal)}}>{s.urgence ? "Urgent" : "Non urgent"}</span></p>
          <p>Statut : <strong>{s.statut}</strong></p>
          <p>{s.description}</p>
          <button onClick={() => navigate(`/situations/${s.id}`)} style={styles.detailButton}>Voir détail</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: 20, backgroundColor: '#f5f7fb', minHeight: '100vh' },
  header: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  backButton: { padding: '10px 16px', backgroundColor: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#4da6ff' },
  addButton: { padding: '10px 16px', backgroundColor: '#4da6ff', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: 20 },
  emptyText: { textAlign: 'center', padding: 40, color: '#999' },
  card: { border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16, backgroundColor: '#fff' },
  cardTitle: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#333' },
  cardDate: { color: '#666', fontSize: '12px', marginBottom: 8 },
  badge: { display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
  urgent: { backgroundColor: '#ffe6e6', color: '#e74c3c' },
  normal: { backgroundColor: '#e6f7e6', color: '#27ae60' },
  detailButton: { marginTop: 10, padding: '8px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};