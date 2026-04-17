import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(
      `http://localhost:5000/api/situations/student/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((res) => setHistory(res.data))
    .catch(() => {
      alert("Erreur de chargement de l'historique");
    });
  }, [id]);

  return (
    <div style={styles.container}>

      {/* BOUTON RETOUR */}
      <button
        onClick={() => navigate(`/students/${id}`)}
        style={styles.backButton}
      >
        ← Retour 
      </button>

      <h3 style={styles.title}>Historique de l'étudiant</h3>

      <ul style={styles.list}>
        {history.map((h) => (
          <li key={h._id} style={styles.listItem}>
            <span style={styles.date}>{new Date(h.createdAt).toLocaleDateString()}</span>
            {" — "}
            <strong style={styles.type}>{h.typeSituation}</strong>
            {" "}
            <span style={styles.status}>({h.statut})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    color: "#000000",
    backgroundColor: "#ffffff",
    minHeight: "100vh"
  },
  backButton: {
    marginBottom: 20,
    color: "#000000",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  title: {
    color: "#000000",
    marginBottom: "20px"
  },
  list: {
    color: "#000000",
    listStyleType: "none",
    padding: 0
  },
  listItem: {
    color: "#000000",
    marginBottom: "10px",
    padding: "8px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px"
  },
  date: {
    color: "#000000",
    fontWeight: "500"
  },
  type: {
    color: "#000000"
  },
  status: {
    color: "#000000",
    fontStyle: "italic"
  }
};