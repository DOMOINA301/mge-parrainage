import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CommentSection from "../components/CommentSection";
import DocumentUpload from "../components/DocumentUpload";

export default function SituationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [situation, setSituation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments");

  useEffect(() => {
    loadSituation();
  }, [id]);

  const loadSituation = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/situations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSituation(res.data);
    } catch (err) {
      alert("Situation introuvable");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `http://localhost:5000/api/situations/${id}/status`,  // ← NOUVELLE ROUTE
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Statut mis à jour:", response.data);
      loadSituation(); // Recharger la situation
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
      
      if (err.response?.status === 403) {
        alert(err.response.data.message || "Vous n'êtes pas autorisé à faire cette action");
      } else {
        alert("Erreur lors de la mise à jour du statut");
      }
    }
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case "VALIDEE_RESPONSABLE":
      case "VALIDEE_SPONSOR":
        return { bg: "#e6f7e6", color: "#27ae60" };
      case "REFUSEE_RESPONSABLE":
      case "REFUSEE_SPONSOR":
        return { bg: "#ffe6e6", color: "#e74c3c" };
      case "EN_ATTENTE_RESPONSABLE":
        return { bg: "#fff3e0", color: "#f39c12" };
      default:
        return { bg: "#e6f0ff", color: "#4da6ff" };
    }
  };

  const getStatusLabel = (statut) => {
    switch(statut) {
      case "EN_ATTENTE_RESPONSABLE":
        return "En attente (Responsable)";
      case "REFUSEE_RESPONSABLE":
        return "Refusée (Responsable)";
      case "VALIDEE_RESPONSABLE":
        return "Validée (Responsable)";
      case "REFUSEE_SPONSOR":
        return "Refusée (Sponsor)";
      case "VALIDEE_SPONSOR":
        return "Validée (Sponsor)";
      default:
        return statut;
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement de la situation...</p>
      </div>
    );
  }

  if (!situation) return null;

  const statusStyle = getStatusColor(situation.statut);

  return (
    <div style={styles.container}>
      {/* En-tête avec retour */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Retour
        </button>
        <h1 style={styles.title}>Détail de la situation</h1>
      </div>

      {/* Carte principale */}
      <div style={styles.mainCard}>
        {/* Badge urgence et statut */}
        <div style={styles.badgeContainer}>
          {situation.urgence && (
            <span style={styles.urgentBadge}>⚠️ URGENT</span>
          )}
          <span style={{
            ...styles.statusBadge,
            backgroundColor: statusStyle.bg,
            color: statusStyle.color
          }}>
            {getStatusLabel(situation.statut)}
          </span>
        </div>

        {/* Informations principales */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Date</span>
            <span style={styles.infoValue}>
              {new Date(situation.dateSituation || situation.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Type</span>
            <span style={styles.infoValue}>{situation.typeSituation}</span>
          </div>

          {situation.montantDemande > 0 && (
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Montant demandé</span>
              <span style={styles.infoValue}>
                {parseInt(situation.montantDemande).toLocaleString()} Ar
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={styles.descriptionSection}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.description}>
            {situation.description || "Aucune description fournie"}
          </p>
        </div>

        {/* Actions de statut */}
        <div style={styles.actionsSection}>
          <h3 style={styles.sectionTitle}>Mettre à jour le statut</h3>
          <div style={styles.statusButtons}>
            
            {situation.statut === "EN_ATTENTE_RESPONSABLE" && (
              <>
                <button
                  onClick={() => updateStatus("VALIDEE_RESPONSABLE")}
                  style={{...styles.statusButton, ...styles.validateButton}}
                >
                  ✅ Valider (Responsable)
                </button>
                <button
                  onClick={() => updateStatus("REFUSEE_RESPONSABLE")}
                  style={{...styles.statusButton, ...styles.refuseButton}}
                >
                  ❌ Refuser (Responsable)
                </button>
              </>
            )}

            {situation.statut === "VALIDEE_RESPONSABLE" && (
              <button
                onClick={() => updateStatus("VALIDEE_SPONSOR")}
                style={{...styles.statusButton, ...styles.validateButton}}
              >
                ✅ Valider (Sponsor)
              </button>
            )}

            {situation.statut === "REFUSEE_RESPONSABLE" && (
              <p style={styles.infoMessage}>Situation refusée par le responsable</p>
            )}

            {(situation.statut === "VALIDEE_SPONSOR" || situation.statut === "REFUSEE_SPONSOR") && (
              <p style={styles.infoMessage}>Décision finale prise par le sponsor</p>
            )}

          </div>
        </div>
      </div>

      {/* Tabs pour commentaires et documents */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "comments" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("comments")}
        >
          💬 Commentaires
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "docs" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("docs")}
        >
          📎 Documents
        </button>
      </div>

      {/* Contenu des tabs */}
      <div style={styles.tabContent}>
        {activeTab === "comments" && (
          <div style={styles.commentsTab}>
            <CommentSection situationId={id} />
          </div>
        )}

        {activeTab === "docs" && (
          <div style={styles.docsTab}>
            <DocumentUpload situationId={id} />
          </div>
        )}
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
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '24px',
  },

  badgeContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },

  urgentBadge: {
    backgroundColor: '#ffe6e6',
    color: '#e74c3c',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },

  statusBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },

  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  infoLabel: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  infoValue: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },

  descriptionSection: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 16px 0',
  },

  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#555',
    margin: 0,
  },

  actionsSection: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '24px',
  },

  statusButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  statusButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    flex: '1 1 auto',
    minWidth: '120px',
  },

  validateButton: {
    backgroundColor: '#27ae60',
    color: '#ffffff',
  },

  refuseButton: {
    backgroundColor: '#e74c3c',
    color: '#ffffff',
  },

  infoMessage: {
    color: '#666',
    fontStyle: 'italic',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    width: '100%',
    textAlign: 'center',
  },

  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },

  tab: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  activeTab: {
    backgroundColor: '#4da6ff',
    color: '#ffffff',
  },

  tabContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },

  commentsTab: {
    // Styles pour l'onglet commentaires
  },

  docsTab: {
    // Styles pour l'onglet documents
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
`;