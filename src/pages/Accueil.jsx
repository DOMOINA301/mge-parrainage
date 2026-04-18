import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStats, getStudents } from "../services/localStorageService";
import { useAuth } from "../context/AuthContext";

export default function Accueil() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, totalSituations: 0, actifs: 0, suspendus: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const statsData = await getStats();
    const students = await getStudents();
    setStats(statsData);
    setRecentStudents(students.slice(0, 5));
    setLoading(false);
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tableau de bord</h1>
        <p style={styles.subtitle}>Bienvenue, {user?.nom || 'Administrateur'}</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}><div style={styles.statValue}>{stats.totalStudents}</div><div style={styles.statLabel}>Élèves</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{stats.actifs}</div><div style={styles.statLabel}>Actifs</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{stats.suspendus}</div><div style={styles.statLabel}>Suspendus</div></div>
        <div style={styles.statCard}><div style={styles.statValue}>{stats.totalSituations}</div><div style={styles.statLabel}>Situations</div></div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Derniers inscrits</h2>
          <button style={styles.viewAllButton} onClick={() => navigate('/students')}>Voir tout</button>
        </div>
        {recentStudents.length === 0 ? (
          <p style={styles.emptyText}>Aucun élève pour le moment</p>
        ) : (
          recentStudents.map(student => (
            <div key={student.id} style={styles.studentCard} onClick={() => navigate(`/students/${student.id}`)}>
              <div><div style={styles.studentName}>{student.nom} {student.prenom}</div><div style={styles.studentInfo}>{student.ecole || 'École non renseignée'}</div></div>
              <div style={styles.studentArrow}>→</div>
            </div>
          ))
        )}
      </div>

      <div style={styles.actions}>
        <button style={styles.actionButton} onClick={() => navigate('/inscription')}>➕ Nouvel élève</button>
        <button style={styles.actionButton} onClick={() => navigate('/students')}>📋 Voir tous</button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f5f7fb", padding: "20px" },
  header: { marginBottom: "24px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1a1a2e", marginBottom: "8px" },
  subtitle: { fontSize: "16px", color: "#666" },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "18px", color: "#666" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "32px" },
  statCard: { background: "white", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  statValue: { fontSize: "32px", fontWeight: "700", color: "#4da6ff", marginBottom: "8px" },
  statLabel: { fontSize: "14px", color: "#666" },
  section: { background: "white", borderRadius: "16px", padding: "20px", marginBottom: "24px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", color: "#333" },
  viewAllButton: { color: "#4da6ff", background: "none", border: "none", cursor: "pointer" },
  emptyText: { textAlign: "center", padding: "40px", color: "#999" },
  studentCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8f9fa", borderRadius: "12px", cursor: "pointer", marginBottom: "8px" },
  studentName: { fontSize: "16px", fontWeight: "500", color: "#333", marginBottom: "4px" },
  studentInfo: { fontSize: "14px", color: "#666" },
  studentArrow: { fontSize: "20px", color: "#ccc" },
  actions: { display: "flex", gap: "12px", flexWrap: "wrap" },
  actionButton: { flex: 1, padding: "14px", fontSize: "16px", fontWeight: "500", color: "#fff", background: "#4da6ff", border: "none", borderRadius: "12px", cursor: "pointer", textAlign: "center" },
};