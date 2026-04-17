import { useNavigate } from "react-router-dom";

export default function SituationTable({ situations }) {
  const navigate = useNavigate();

  const renderStatut = (statut) => {
    switch (statut) {
      case "EN_ATTENTE_RESPONSABLE":
        return "🟡 En attente (Responsable)";
      case "VALIDEE_RESPONSABLE":
        return "🟢 Validée par responsable";
      case "REFUSEE_RESPONSABLE":
        return "🔴 Refusée par responsable";
      case "VALIDEE_SPONSOR":
        return "🟢 Validée par sponsor";
      case "REFUSEE_SPONSOR":
        return "🔴 Refusée par sponsor";
      default:
        return statut;
    }
  };

  return (
    <table border="1" cellPadding="6">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Urgence</th>
          <th>Statut</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {situations.map((s) => (
          <tr key={s._id}>
            <td>
              {new Date(s.createdAt).toLocaleDateString()}
            </td>
            <td>{s.typeSituation}</td>
            <td>{s.urgence ? "⚠️ Urgent" : "—"}</td>
            <td>{renderStatut(s.statut)}</td>
            <td>
              <button onClick={() => navigate(`/situations/${s._id}`)}>
                👁️ Voir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
