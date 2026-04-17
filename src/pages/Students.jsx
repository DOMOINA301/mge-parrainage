import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import ConfirmModal from "../components/ConfirmModal";

const API = "http://localhost:5000/api/students";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Erreur chargement étudiants:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = (id) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteSelected = () => {
    if (selectedStudents.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    setShowDeleteModal(false);
    const token = localStorage.getItem("token");
    
    try {
      await axios.delete(`${API}/${studentToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadStudents();
      setStudentToDelete(null);
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    
    setShowBulkDeleteModal(false);
    const token = localStorage.getItem("token");
    
    try {
      for (const id of selectedStudents) {
        await axios.delete(`${API}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSelectedStudents([]);
      loadStudents();
    } catch (error) {
      console.error("Erreur suppression multiple:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s._id));
    }
  };

  const callAllStudents = () => {
    if (!window.confirm(`Appeler ${students.length} étudiants ?`)) return;

    students.forEach((s, index) => {
      if (s.telephone) {
        setTimeout(() => {
          window.location.href = `tel:${s.telephone}`;
        }, index * 3000);
      }
    });
  };

  const exportExcel = () => {
    const data = students.map((s) => ({
      Nom: s.nom,
      Prénom: s.prenom,
      Sexe: s.sexe,
      Université: s.universite,
      Parcours: s.parcours,
      Classe: s.classe,
      Téléphone: s.telephone,
      Adresse: s.adresse,
      Statut: s.statut,
      "Motif": s.motifSuspension || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Étudiants");
    XLSX.writeFile(wb, "etudiants.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    
    doc.setFillColor(77, 166, 255);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("LISTE DES ÉTUDIANTS", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Madagascar Grandir Ensemble", 105, 30, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    let y = 50;

    const headers = ["N°", "Nom & Prénom", "Tél", "Statut"];
    const columns = [15, 80, 40, 40];
    
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y-5, 185, 10, 'F');
    
    let x = 10;
    headers.forEach((header, i) => {
      doc.text(header, x + 2, y);
      x += columns[i];
    });
    
    y += 10;
    
    students.forEach((s, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      x = 10;
      doc.text(String(index + 1), x + 2, y);
      x += columns[0];
      
      doc.text(`${s.nom} ${s.prenom}`, x + 2, y);
      x += columns[1];
      
      doc.text(s.telephone || "-", x + 2, y);
      x += columns[2];
      
      doc.text(s.statut || "-", x + 2, y);
      
      doc.line(10, y + 2, 195, y + 2);
      y += 8;
    });

    doc.save("etudiants.pdf");
  };

  // FILTRAGE
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.telephone?.includes(searchTerm);
    
    const matchesStatus = filterStatus === "Tous" || s.statut === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // STATISTIQUES
  const stats = {
    total: students.length,
    actifs: students.filter(s => s.statut === "actif").length,
    suspendus: students.filter(s => s.statut === "suspendu").length,
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des étudiants...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* En-tête avec statistiques */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Retour
          </button>
          <h1 style={styles.title}>Étudiants</h1>
        </div>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{stats.total}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={{...styles.statCard, backgroundColor: '#e6f7e6'}}>
            <span style={{...styles.statNumber, color: '#27ae60'}}>{stats.actifs}</span>
            <span style={styles.statLabel}>Actifs</span>
          </div>
          <div style={{...styles.statCard, backgroundColor: '#ffe6e6'}}>
            <span style={{...styles.statNumber, color: '#e74c3c'}}>{stats.suspendus}</span>
            <span style={styles.statLabel}>Suspendus</span>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="Tous">Tous</option>
            <option value="actif">Actifs</option>
            <option value="suspendu">Suspendus</option>
          </select>
        </div>

        {/* Actions */}
        <div style={styles.actionsBar}>
          <div style={styles.actionButtons}>
            <button onClick={exportExcel} style={styles.excelButton}>
              📊 Excel
            </button>
            <button onClick={exportPDF} style={styles.pdfButton}>
              📑 PDF
            </button>
            <button onClick={callAllStudents} style={styles.callAllButton}>
              📞 Tous appeler
            </button>
            {selectedStudents.length > 0 && (
              <button onClick={deleteSelected} style={styles.deleteSelectedButton}>
                🗑️ Supprimer ({selectedStudents.length})
              </button>
            )}
          </div>
        </div>

        {/* Checkbox tout sélectionner */}
        {filteredStudents.length > 0 && (
          <div style={styles.selectAll}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedStudents.length === filteredStudents.length}
                onChange={toggleSelectAll}
                style={styles.checkbox}
              />
              Tout sélectionner ({filteredStudents.length})
            </label>
          </div>
        )}
      </div>

      {/* Liste des étudiants */}
      {filteredStudents.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div style={viewMode === "grid" ? styles.gridView : styles.listView}>
          {filteredStudents.map((s) => (
            <div
              key={s._id}
              style={{
                ...styles.studentCard,
                ...(selectedStudents.includes(s._id) ? styles.studentCardSelected : {})
              }}
            >
              {/* Checkbox de sélection */}
              <div style={styles.cardCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s._id)}
                  onChange={() => toggleSelectStudent(s._id)}
                  style={styles.checkbox}
                />
              </div>

              {/* Photo */}
              <div style={styles.studentPhoto}>
                {s.photo ? (
                  <img
                    src={`http://localhost:5000${s.photo.startsWith('/') ? s.photo : '/uploads/' + s.photo}`}
                    alt={`${s.nom} ${s.prenom}`}
                    style={styles.photo}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#888;font-size:18px;">${s.nom?.[0]}${s.prenom?.[0]}</div>`;
                    }}
                  />
                ) : (
                  <div style={styles.photoPlaceholder}>
                    {s.nom?.[0]}{s.prenom?.[0]}
                  </div>
                )}
              </div>

              {/* Infos étudiant */}
              <div style={styles.studentInfo}>
                <h3 style={styles.studentName}>
                  {s.nom} {s.prenom}
                </h3>
                
                <div style={styles.studentDetails}>
                  <span style={styles.detailItem}>
                    📞 {s.telephone || "Non renseigné"}
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    ...(s.statut === "actif" ? styles.statusActif : styles.statusSuspendu)
                  }}>
                    {s.statut}
                  </span>
                </div>

                {s.statut === "suspendu" && s.motifSuspension && (
                  <div style={styles.motifInfo}>
                    <small>Motif: {s.motifSuspension}</small>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={styles.cardActions}>
                <button
                  onClick={() => navigate(`/students/${s._id}`)}
                  style={styles.actionButton}
                  title="Voir détails"
                >
                  👁️
                </button>
                <button
                  onClick={() => navigate(`/students/${s._id}/edit`)}
                  style={styles.actionButton}
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => window.location.href = `tel:${s.telephone}`}
                  style={styles.actionButton}
                  title="Appeler"
                >
                  📞
                </button>
                <button
                  onClick={() => deleteStudent(s._id)}
                  style={styles.actionButton}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        open={showDeleteModal}
        title="Confirmation de suppression"
        message={
          <span style={{ color: "#000000" }}>
            ⚠️ Cette action est irréversible.<br />
            Voulez-vous vraiment supprimer cet étudiant ?
          </span>
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setStudentToDelete(null);
        }}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <ConfirmModal
        open={showBulkDeleteModal}
        title="Confirmation de suppression"
        message={
          <span style={{ color: "#000000" }}>
            ⚠️ Cette action est irréversible.<br />
            Voulez-vous vraiment supprimer {selectedStudents.length} étudiant(s) ?
          </span>
        }
        onConfirm={confirmBulkDelete}
        onCancel={() => setShowBulkDeleteModal(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fafafa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #a0a0a0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  header: { marginBottom: '24px' },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333333',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#333333',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '14px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #f0f0f0',
  },
  statNumber: {
    display: 'block',
    fontSize: '22px',
    fontWeight: '500',
    color: '#4a4a4a',
    marginBottom: '4px',
  },
  statLabel: { fontSize: '12px', color: '#888888' },
  searchSection: { marginBottom: '24px' },
  searchBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  filterSelect: {
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
    color: '#000000',
  },
  actionsBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  excelButton: {
    padding: '8px 14px',
    backgroundColor: '#f0f7f0',
    border: '1px solid #d0e0d0',
    borderRadius: '6px',
    color: '#2c5e2c',
    fontSize: '13px',
    cursor: 'pointer',
  },
  pdfButton: {
    padding: '8px 14px',
    backgroundColor: '#fdf0f0',
    border: '1px solid #f0d0d0',
    borderRadius: '6px',
    color: '#8b3d3d',
    fontSize: '13px',
    cursor: 'pointer',
  },
  callAllButton: {
    padding: '8px 14px',
    backgroundColor: '#f0f5fa',
    border: '1px solid #c0d0e0',
    borderRadius: '6px',
    color: '#2c5e8c',
    fontSize: '13px',
    cursor: 'pointer',
  },
  deleteSelectedButton: {
    padding: '8px 14px',
    backgroundColor: '#faf0f0',
    border: '1px solid #e0c0c0',
    borderRadius: '6px',
    color: '#8b3d3d',
    fontSize: '13px',
    cursor: 'pointer',
  },
  selectAll: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#000000',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    color: '#aaaaaa',
    border: '1px solid #f0f0f0',
  },
  gridView: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
  },
  listView: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  studentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #f0f0f0',
  },
  studentCardSelected: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #c0c0c0',
  },
  cardCheckbox: { marginRight: '6px' },
  studentPhoto: {
    width: '50px',
    height: '50px',
    borderRadius: '25px',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    color: '#888888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    textTransform: 'uppercase',
  },
  studentInfo: { flex: 1 },
  studentName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    fontWeight: '500',
    color: '#000000',
  },
  studentDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  detailItem: {
    fontSize: '13px',
    color: '#000000',
  },
  motifInfo: {
    marginTop: '4px',
    fontSize: '11px',
    color: '#8b3d3d',
    fontStyle: 'italic',
  },
  statusBadge: {
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    textTransform: 'capitalize',
    color: '#000000',
  },
  statusActif: {
    backgroundColor: '#f0f7f0',
    border: '1px solid #d0e0d0',
  },
  statusSuspendu: {
    backgroundColor: '#fdf0f0',
    border: '1px solid #f0d0d0',
  },
  cardActions: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: '36px',
    height: '36px',
    padding: 0,
    border: '1px solid #e0e0e0',
    borderRadius: '18px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    color: '#555555',
  },
};

const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @media (min-width: 768px) {
    .gridView { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1024px) {
    .gridView { grid-template-columns: repeat(3, 1fr) !important; }
  }
  input:hover, select:hover { border-color: #cccccc !important; }
  input:focus, select:focus { border-color: #aaaaaa !important; outline: none; }
  button:hover:not(:disabled) { background-color: #f5f5f5 !important; }
  button:active:not(:disabled) { transform: scale(0.98); }
`;