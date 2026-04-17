import { useEffect, useState } from "react";
import axios from "axios";

export default function CommentSection({ situationId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const loadComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/situation/${situationId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Erreur chargement commentaires:", err);
    }
  };

  useEffect(() => {
    if (situationId) loadComments();
  }, [situationId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/comments",
        {
          situation: situationId,
          contenu: newComment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error("Erreur ajout commentaire:", err);
      alert("Erreur lors de l'ajout du commentaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>💬 Commentaires internes</h4>

      {/* Liste des commentaires */}
      <div style={styles.commentsList}>
        {comments.length === 0 ? (
          <p style={styles.emptyMessage}>Aucun commentaire</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} style={styles.commentCard}>
              <div style={styles.commentHeader}>
                <strong style={styles.author}>
                  {comment.auteur?.nom || "Utilisateur"}
                </strong>
                <span style={styles.date}>
                  {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p style={styles.content}>{comment.contenu}</p>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={addComment} style={styles.form}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire interne..."
          rows="3"
          style={styles.textarea}
        />
        <button 
          type="submit" 
          disabled={loading || !newComment.trim()}
          style={{
            ...styles.button,
            ...(loading || !newComment.trim() ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "Envoi en cours..." : "Commenter"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    marginTop: "20px"
  },
  title: {
    color: "#000000",
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "600"
  },
  commentsList: {
    marginBottom: "20px"
  },
  emptyMessage: {
    color: "#000000",
    fontStyle: "italic",
    padding: "10px 0"
  },
  commentCard: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    border: "1px solid #e0e0e0"
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    flexWrap: "wrap",
    gap: "8px"
  },
  author: {
    color: "#000000",
    fontWeight: "600",
    fontSize: "14px"
  },
  date: {
    color: "#000000",
    fontSize: "12px",
    opacity: "0.7"
  },
  content: {
    color: "#000000",
    margin: "0",
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    color: "#000000",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none"
  },
  button: {
    padding: "10px 20px",
    color: "#000000",
    backgroundColor: "#e0e0e0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    alignSelf: "flex-start",
    transition: "all 0.2s ease"
  },
  buttonDisabled: {
    opacity: "0.5",
    cursor: "not-allowed"
  }
};

// Styles globaux pour les états hover
const globalStyles = `
  textarea:focus {
    border-color: #4da6ff !important;
    box-shadow: 0 0 0 2px rgba(77, 166, 255, 0.1) !important;
  }

  button:hover:not(:disabled) {
    background-color: #d0d0d0 !important;
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

// Ajoute ceci dans ton composant si tu veux les styles globaux
// <style>{globalStyles}</style>