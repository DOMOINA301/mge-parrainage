import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSituationsByStudent } from "../services/localStorageService";

export default function StudentHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [id]);

  const loadHistory = async () => {
    const data = await getSituationsByStudent(id);
    setHistory(data);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(`/students/${id}`)} style={styles.backButton}>← Retour</button>
      <h3 style={styles.title}>Historique de l'étudiant</h3>
      <ul style={styles.list}>
        {history.map((h) => (
          <li key={h.id} style={styles.listItem}>
            <span style={styles.date}>{new Date(h.createdAt).toLocaleDateString()}</span> — <strong>{h.typeSituation}</strong> <span>({h.statut})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { padding: 20, backgroundColor: '#fff', minHeight: '100vh' },
  backButton: { marginBottom: 20, padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' },
  title: { color: '#333', marginBottom: 20 },
  list: { listStyle: 'none', padding: 0 },
  listItem: { marginBottom: 10, padding: 8, backgroundColor: '#f8f9fa', borderRadius: 4 },
  date: { fontWeight: '500', color: '#333' },
};