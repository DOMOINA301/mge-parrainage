import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents, deleteStudent } from "../services/localStorageService";
import { useAuth } from "../context/AuthContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import ConfirmModal from "../components/ConfirmModal";

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
  const { canEditStudent, canDeleteStudent } = useAuth();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const data = await getStudents();
    setStudents(data);
    setLoading(false);
  };

  const deleteStudentById = async (id) => {
    await deleteStudent(id);
    await loadStudents();
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setShowDeleteModal(false);
    await deleteStudentById(studentToDelete);
    setStudentToDelete(null);
  };

  const confirmBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    setShowBulkDeleteModal(false);
    for (const id of selectedStudents) {
      await deleteStudent(id);
    }
    setSelectedStudents([]);
    await loadStudents();
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
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const exportExcel = () => {
    const data = students.map((s) => ({
      Nom: s.nom, Prénom: s.prenom, Sexe: s.sexe, Université: s.universite,
      Parcours: s.parcours, Classe: s.classe, Téléphone: s.telephone,
      Adresse: s.adresse, Statut: s.statut, Motif: s.motifSuspension || "-"
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
    headers.forEach((header, i) => { doc.text(header, x + 2, y); x += columns[i]; });
    y += 10;
    students.forEach((s, index) => {
      if (y > 270) { doc.addPage(); y = 20; }
      x = 10;
      doc.text(String(index + 1), x + 2, y); x += columns[0];
      doc.text(`${s.nom} ${s.prenom}`, x + 2, y); x += columns[1];
      doc.text(s.telephone || "-", x + 2, y); x += columns[2];
      doc.text(s.statut || "-", x + 2, y);
      doc.line(10, y + 2, 195, y + 2);
      y += 8;
    });
    doc.save("etudiants.pdf");
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.telephone?.includes(searchTerm);
    const matchesStatus = filterStatus === "Tous" || s.statut === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: students.length,
    actifs: students.filter(s => s.statut === "actif").length,
    suspendus: students.filter(s => s.statut === "suspendu").length,
  };

  if (loading) {
    return <div style={styles.loadingContainer}><div style={styles.spinner}></div><p>Chargement...</p></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
          <h1 style={styles.title}>Étudiants</h1>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}><span style={styles.statNumber}>{stats.total}</span><span style={styles.statLabel}>Total</span></div>
          <div style={{...styles.statCard, backgroundColor: '#e6f7e6'}}><span style={{...styles.statNumber, color: '#27ae60'}}>{stats.actifs}</span><span style={styles.statLabel}>Actifs</span></div>
          <div style={{...styles.statCard, backgroundColor: '#ffe6e6'}}><span style={{...styles.statNumber, color: '#e74c3c'}}>{stats.suspendus}</span><span style={styles.statLabel}>Suspendus</span></div>
        </div>
      </div>

      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterSelect}>
            <option value="Tous">Tous</option><option value="actif">Actifs</option><option value="suspendu">Suspendus</option>
          </select>
        </div>
        <div style={styles.actionButtons}>
          <button onClick={exportExcel} style={styles.excelButton}>📊 Excel</button>
          <button onClick={exportPDF} style={styles.pdfButton}>📑 PDF</button>
          {canDeleteStudent() && selectedStudents.length > 0 && <button onClick={() => setShowBulkDeleteModal(true)} style={styles.deleteSelectedButton}>🗑️ Supprimer ({selectedStudents.length})</button>}
        </div>
        {canDeleteStudent() && filteredStudents.length > 0 && (
          <div style={styles.selectAll}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={selectedStudents.length === filteredStudents.length} onChange={toggleSelectAll} style={styles.checkbox} />
              Tout sélectionner ({filteredStudents.length})
            </label>
          </div>
        )}
      </div>

      {filteredStudents.length === 0 ? (
        <div style={styles.emptyState}><p>Aucun étudiant trouvé</p></div>
      ) : (
        <div style={viewMode === "grid" ? styles.gridView : styles.listView}>
          {filteredStudents.map((s) => (
            <div key={s.id} style={{...styles.studentCard, ...(selectedStudents.includes(s.id) ? styles.studentCardSelected : {})}}>
              {canDeleteStudent() && (
                <div style={styles.cardCheckbox}>
                  <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleSelectStudent(s.id)} style={styles.checkbox} />
                </div>
              )}
              <div style={styles.studentPhoto}>
                <div style={styles.photoPlaceholder}>{s.nom?.[0]}{s.prenom?.[0]}</div>
              </div>
              <div style={styles.studentInfo}>
                <h3 style={styles.studentName}>{s.nom} {s.prenom}</h3>
                <div style={styles.studentDetails}>
                  <span style={styles.detailItem}>📞 {s.telephone || "-"}</span>
                  <span style={{...styles.statusBadge, ...(s.statut === "actif" ? styles.statusActif : styles.statusSuspendu)}}>{s.statut}</span>
                </div>
              </div>
              <div style={styles.cardActions}>
                <button onClick={() => navigate(`/students/${s.id}`)} style={styles.actionButton}>👁️</button>
                {canEditStudent() && (
                  <button onClick={() => navigate(`/students/${s.id}/edit`)} style={styles.actionButton}>✏️</button>
                )}
                <button onClick={() => window.location.href = `tel:${s.telephone}`} style={styles.actionButton}>📞</button>
                {canDeleteStudent() && (
                  <button onClick={() => { setStudentToDelete(s.id); setShowDeleteModal(true); }} style={styles.actionButton}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={showDeleteModal} title="Confirmation" message={<span>⚠️ Supprimer cet étudiant ?</span>} onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} confirmText="Supprimer" cancelText="Annuler" />
      <ConfirmModal open={showBulkDeleteModal} title="Confirmation" message={<span>⚠️ Supprimer {selectedStudents.length} étudiant(s) ?</span>} onConfirm={confirmBulkDelete} onCancel={() => setShowBulkDeleteModal(false)} confirmText="Supprimer" cancelText="Annuler" />
    </div>
  );
}

const styles = {
  container: { padding: '16px', backgroundColor: '#fafafa', minHeight: '100vh' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  spinner: { width: '50px', height: '50px', border: '3px solid #f0f0f0', borderTop: '3px solid #4da6ff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' },
  header: { marginBottom: '24px' },
  headerTop: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  backButton: { padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '500', color: '#333', margin: 0 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  statCard: { backgroundColor: '#fff', padding: '14px', borderRadius: '10px', textAlign: 'center' },
  statNumber: { display: 'block', fontSize: '22px', fontWeight: '500', color: '#4a4a4a', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#888' },
  searchSection: { marginBottom: '24px' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '16px' },
  searchInput: { flex: 1, padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' },
  filterSelect: { padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', outline: 'none' },
  actionButtons: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' },
  excelButton: { padding: '8px 14px', backgroundColor: '#f0f7f0', border: '1px solid #d0e0d0', borderRadius: '6px', cursor: 'pointer' },
  pdfButton: { padding: '8px 14px', backgroundColor: '#fdf0f0', border: '1px solid #f0d0d0', borderRadius: '6px', cursor: 'pointer' },
  deleteSelectedButton: { padding: '8px 14px', backgroundColor: '#faf0f0', border: '1px solid #e0c0c0', borderRadius: '6px', cursor: 'pointer', color: '#8b3d3d' },
  selectAll: { padding: '12px', backgroundColor: '#fff', borderRadius: '8px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '10px', color: '#aaa' },
  gridView: { display: 'grid', gridTemplateColumns: '1fr', gap: '14px' },
  studentCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f0f0f0' },
  studentCardSelected: { backgroundColor: '#f8f8f8', border: '1px solid #c0c0c0' },
  cardCheckbox: { marginRight: '6px' },
  studentPhoto: { width: '50px', height: '50px', borderRadius: '25px', overflow: 'hidden' },
  photoPlaceholder: { width: '100%', height: '100%', backgroundColor: '#4da6ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', textTransform: 'uppercase', borderRadius: '25px' },
  studentInfo: { flex: 1 },
  studentName: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: '500', color: '#000' },
  studentDetails: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  detailItem: { fontSize: '13px', color: '#000' },
  statusBadge: { padding: '3px 8px', borderRadius: '12px', fontSize: '11px', textTransform: 'capitalize' },
  statusActif: { backgroundColor: '#f0f7f0', border: '1px solid #d0e0d0', color: '#2c5e2c' },
  statusSuspendu: { backgroundColor: '#fdf0f0', border: '1px solid #f0d0d0', color: '#8b3d3d' },
  cardActions: { display: 'flex', gap: '4px' },
  actionButton: { width: '36px', height: '36px', border: '1px solid #e0e0e0', borderRadius: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
};

const globalStyles = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @media (min-width: 768px) { .gridView { grid-template-columns: repeat(2, 1fr) !important; } }
  @media (min-width: 1024px) { .gridView { grid-template-columns: repeat(3, 1fr) !important; } }
`;