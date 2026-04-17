import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/students";

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      alert("Étudiant introuvable ou accès refusé");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div style={styles.container}>
      {/* En-tête avec retour */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>Profil étudiant</h1>
      </div>

      {/* Carte principale */}
      <div style={styles.mainCard}>
        {/* Photo et nom */}
        <div style={styles.profileHeader}>
          <div style={styles.photoContainer}>
            {student.photo ? (
             <img
             src={`http://localhost:5000${student.photo}`}  // ← Utilise le chemin tel quel
             alt={`${student.nom} ${student.prenom}`}
             style={styles.photo}
             onError={(e) => {
               console.log("❌ Erreur chargement:", e.target.src);
               e.target.style.display = 'none';
               // Affiche le placeholder en cas d'erreur
               e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#888;font-size:18px;">${student.nom?.[0]}${student.prenom?.[0]}</div>`;
             }}
           />
            ) : (
              <div style={styles.photoPlaceholder}>
                {student.nom?.[0]}{student.prenom?.[0]}
              </div>
            )}
          </div>
          <div style={styles.nameContainer}>
            <h2 style={styles.fullName}>
              {student.nom} {student.prenom}
            </h2>
            <span style={{
              ...styles.statusBadge,
              ...(student.statut === "actif" ? styles.statusActif : styles.statusSuspendu)
            }}>
              {student.statut}
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={styles.actionButtons}>
          <button
            onClick={() => navigate(`/students/${id}/situations/new`)}
            style={{...styles.actionButton, backgroundColor: '#4da6ff'}}
          >
            ➕ Nouvelle situation
          </button>
          <button
            onClick={() => navigate(`/students/${id}/situations`)}
            style={{...styles.actionButton, backgroundColor: '#27ae60'}}
          >
            📋 Situations
          </button>
          <button
            onClick={() => navigate(`/students/${id}/history`)}
            style={{...styles.actionButton, backgroundColor: '#f39c12'}}
          >
            📜 Historique
          </button>
        </div>

        {/* Informations détaillées */}
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📧</span>
            <div>
              <p style={styles.infoLabel}>Email</p>
              <p style={styles.infoValue}>{student.email || "Non renseigné"}</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📞</span>
            <div>
              <p style={styles.infoLabel}>Téléphone</p>
              <p style={styles.infoValue}>
                {student.telephone ? (
                  <a href={`tel:${student.telephone}`} style={styles.phoneLink}>
                    {student.telephone}
                  </a>
                ) : "Non renseigné"}
              </p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>🏫</span>
            <div>
              <p style={styles.infoLabel}>Université</p>
              <p style={styles.infoValue}>{student.universite || "Non renseigné"}</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📚</span>
            <div>
              <p style={styles.infoLabel}>Parcours / Classe</p>
              <p style={styles.infoValue}>
                {student.parcours || "-"} / {student.classe || "-"}
              </p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>⚥</span>
            <div>
              <p style={styles.infoLabel}>Sexe</p>
              <p style={styles.infoValue}>{student.sexe || "Non renseigné"}</p>
            </div>
          </div>

          <div style={styles.infoCard}>
            <span style={styles.infoIcon}>📍</span>
            <div>
              <p style={styles.infoLabel}>Adresse</p>
              <p style={styles.infoValue}>{student.adresse || "Non renseignée"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#f5f7fb',
    minHeight: '100vh',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f7fb',
  },

  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4da6ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },

  backButton: {
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#4da6ff',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },

  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },

  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },

  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },

  photoContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4da6ff',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  nameContainer: {
    flex: 1,
  },

  fullName: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },

  statusBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },

  statusActif: {
    backgroundColor: '#e6f7e6',
    color: '#27ae60',
  },

  statusSuspendu: {
    backgroundColor: '#ffe6e6',
    color: '#e74c3c',
  },

  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },

  actionButton: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    flex: '1 1 auto',
    minWidth: '140px',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },

  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.2s ease',
  },

  infoIcon: {
    fontSize: '24px',
  },

  infoLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  infoValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    margin: 0,
  },

  phoneLink: {
    color: '#4da6ff',
    textDecoration: 'none',
  },
};

const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  .infoCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;