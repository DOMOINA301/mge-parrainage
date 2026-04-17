import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CommentSection from "../components/CommentSection";
import DocumentUpload from "../components/DocumentUpload";

export default function SituationsList() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [situations, setSituations] = useState([]);

  useEffect(() => {
    loadSituations();
  }, []);

  const loadSituations = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:5000/api/situations/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setSituations(res.data);
  };

  return (
    <div style={{ padding: 20 }}>

      {/* BOUTONS RETOUR */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate(`/students/${studentId}`)}>
          ← Retour 
        </button>

        <button
          onClick={() => navigate(`/students/${studentId}/situations/new`)}
          style={{ marginLeft: 10 }}
        >
          + Nouvelle situation
        </button>
      </div>

   

      {situations.length === 0 && (
        <p>Aucune situation enregistree.</p>
      )}

      {situations.map((s) => (
        <div
          key={s._id}
          style={{
            border: "1px solid #444",
            borderRadius: 8,
            padding: 15,
            marginBottom: 20,
            background: "#1e1e1e",
          }}
        >
          <h4>{s.typeSituation}</h4>

          <p>
            {new Date(s.dateSituation).toLocaleDateString()} <br />
            {s.urgence ? "Urgent" : "Non urgent"} <br />
            Statut : <strong>{s.statut}</strong>
          </p>

          <p>{s.description}</p>

          <DocumentUpload situationId={s._id} />
          <CommentSection situationId={s._id} />

          <button
            onClick={() => navigate(`/situations/${s._id}`)}
            style={{ marginTop: 10 }}
          >
            Voir detail
          </button>
        </div>
      ))}
    </div>
  );
}
