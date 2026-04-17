export default function ConfirmModal({
  open,
  title = "Confirmation",
  message,
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button onClick={onCancel} style={{ marginRight: 10 }}>
            Annuler
          </button>

          <button
            onClick={onConfirm}
            style={{ background: "#dc3545", color: "white" }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 6,
  width: 400,
  maxWidth: "90%"
};
