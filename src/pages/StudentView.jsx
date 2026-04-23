import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById } from "../services/localStorageService";
import { useAuth } from "../context/AuthContext";

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canCreateSituation } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const data = await getStudentById(id);
      if (data) {
        setStudent(data);
      } else {
        alert("Étudiant non trouvé");
        navigate(-1);
      }
    } catch (err) {
      alert("Erreur de chargement");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loadingContainer}><div style={styles.spinner}></div><p>Chargement...</p></div>;
  }

  if (!student) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
        <h1 style={styles.title}>Profil étudiant</h1>
      </div>

      <div style={styles.mainCard}>
        <div style={styles.profileHeader}>
          <div style={styles.photoContainer}>
            <div style={styles.photoPlaceholder}>{student.nom?.[0]}{student.prenom?.[0]}</div>
          </div>
          <div style={styles.nameContainer}>
            <h2 style={styles.fullName}>{student.nom} {student.prenom}</h2>
            <span style={{...styles.statusBadge, ...(student.statut === "actif" ? styles.statusActif : styles.statusSuspendu)}}>{student.statut}</span>
          </div>
        </div>

        <div style={styles.actionButtons}>
          {/* Nouvelle situation - visible seulement pour RESPONSABLE */}
          {canCreateSituation() && (
            <button onClick={() => navigate(`/students/${id}/situations/new`)} style={{...styles.actionButton, backgroundColor: '#4da6ff'}}>
              ➕ Nouvelle situation
            </button>
          )}
          <button onClick={() => navigate(`/students/${id}/situations`)} style={{...styles.actionButton, backgroundColor: '#27ae60'}}>
            📋 Situations
          </button>
          <button onClick={() => navigate(`/students/${id}/history`)} style={{...styles.actionButton, backgroundColor: '#f39c12'}}>
            📜 Historique
          </button>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}><span style={styles.infoIcon}>📧</span><div><p style={styles.infoLabel}>Email</p><p style={styles.infoValue}>{student.email || "-"}</p></div></div>
          <div style={styles.infoCard}><span style={styles.infoIcon}>📞</span><div><p style={styles.infoLabel}>Téléphone</p><p style={styles.infoValue}>{student.telephone || "-"}</p></div></div>
          <div style={styles.infoCard}><span style={styles.infoIcon}>🏫</span><div><p style={styles.infoLabel}>Université</p><p style={styles.infoValue}>{student.universite || "-"}</p></div></div>
          <div style={styles.infoCard}><span style={styles.infoIcon}>📚</span><div><p style={styles.infoLabel}>Parcours / Classe</p><p style={styles.infoValue}>{student.parcours || "-"} / {student.classe || "-"}</p></div></div>
          <div style={styles.infoCard}><span style={styles.infoIcon}>⚥</span><div><p style={styles.infoLabel}>Sexe</p><p style={styles.infoValue}>{student.sexe || "-"}</p></div></div>
          <div style={styles.infoCard}><span style={styles.infoIcon}>📍</span><div><p style={styles.infoLabel}>Adresse</p><p style={styles.infoValue}>{student.adresse || "-"}</p></div></div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '16px', backgroundColor: '#f5f7fb', minHeight: '100vh' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #4da6ff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: { padding: '10px 16px', backgroundColor: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '500', color: '#4da6ff', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '600', color: '#333', margin: 0 },
  mainCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' },
  photoContainer: { width: '100px', height: '100px', borderRadius: '50px', overflow: 'hidden' },
  photoPlaceholder: { width: '100%', height: '100%', backgroundColor: '#4da6ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '600', textTransform: 'uppercase' },
  nameContainer: { flex: 1 },
  fullName: { fontSize: '24px', fontWeight: '600', color: '#333', margin: '0 0 8px 0' },
  statusBadge: { display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' },
  statusActif: { backgroundColor: '#e6f7e6', color: '#27ae60' },
  statusSuspendu: { backgroundColor: '#ffe6e6', color: '#e74c3c' },
  actionButtons: { display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' },
  actionButton: { padding: '12px 20px', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: '500', cursor: 'pointer', flex: '1', minWidth: '140px' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' },
  infoCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px' },
  infoIcon: { fontSize: '24px' },
  infoLabel: { fontSize: '12px', color: '#666', margin: '0 0 4px 0' },
  infoValue: { fontSize: '15px', fontWeight: '500', color: '#333', margin: 0 },
};

const globalStyles = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;