import { useEffect, useState } from "react";
import axios from "axios";

export default function DocumentUpload({ situationId }) {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");

  const loadDocs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/documents/situation/${situationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDocs(res.data);
    } catch (err) {
      console.error("Erreur chargement documents:", err);
    }
  };

  useEffect(() => {
    if (situationId) loadDocs();
  }, [situationId]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("document", file);
    data.append("situation", situationId);

    try {
      await axios.post(
        "http://localhost:5000/api/documents",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      loadDocs();
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Erreur lors de l'upload du document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h4>📎 Documents</h4>

      {docs.length === 0 ? (
        <p>Aucun document</p>
      ) : (
        docs.map((d) => (
          <div key={d._id} style={{ marginBottom: 5 }}>
            <a
              href={`http://localhost:5000/uploads/documents/${d.fichier}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 {d.fichier}
            </a>
          </div>
        ))
      )}

      <input 
        type="file" 
        onChange={upload} 
        disabled={uploading}
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
      />
      {uploading && <p>Upload en cours...</p>}
    </div>
  );
}