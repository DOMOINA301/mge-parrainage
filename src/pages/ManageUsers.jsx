import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUser, deleteUser } from '../services/localStorageService';
import { useAuth } from '../context/AuthContext';

export default function ManageUsers() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'RESPONSABLE'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAdmin()) loadUsers();
  }, []);

  if (!isAdmin()) {
    return <div style={styles.accessDenied}>⛔ Accès non autorisé</div>;
  }

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.nom || !form.email || !form.password) {
      setMessage('Tous les champs sont requis');
      return;
    }

    const existingUser = users.find(u => u.email === form.email);
    if (existingUser) {
      setMessage('Cet email existe déjà');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      nom: form.nom,
      email: form.email,
      password: btoa(form.password),
      role: form.role,
      createdAt: new Date().toISOString(),
      active: true
    };

    await saveUser(newUser);
    
    setMessage(`✅ Compte ${form.role} créé avec succès`);
    setForm({ nom: '', email: '', password: '', role: 'RESPONSABLE' });
    setShowForm(false);
    await loadUsers();
  };

  const deleteUserAccount = async (userId, userRole) => {
    if (userRole === 'ADMIN') {
      setMessage('❌ Impossible de supprimer le compte ADMIN');
      return;
    }
    if (window.confirm('Supprimer ce compte ?')) {
      await deleteUser(userId);
      await loadUsers();
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'ADMIN': return { bg: '#e74c3c', label: 'Admin' };
      case 'RESPONSABLE': return { bg: '#27ae60', label: 'Responsable' };
      case 'SPONSOR': return { bg: '#f39c12', label: 'Sponsor' };
      default: return { bg: '#95a5a6', label: role };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
        <h1 style={styles.title}>Gestion des utilisateurs</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>👥 Comptes existants</h2>
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            + Nouveau compte
          </button>
        </div>

        {message && (
          <div style={message.includes('✅') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}

        {showForm && (
          <form onSubmit={createUser} style={styles.form}>
            <input type="text" name="nom" placeholder="Nom complet" value={form.nom} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="RESPONSABLE">Responsable</option>
              <option value="SPONSOR">Sponsor</option>
            </select>
            <div style={styles.formButtons}>
              <button type="submit" style={styles.createButton}>Créer</button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelFormButton}>Annuler</button>
            </div>
          </form>
        )}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const badge = getRoleBadge(u.role);
                return (
                  <tr key={u.id}>
                    <td data-label="Nom">{u.nom}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Rôle">
                      <span style={{...styles.roleBadge, backgroundColor: badge.bg}}>{badge.label}</span>
                    </td>
                    <td data-label="Date">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td data-label="Actions">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => deleteUserAccount(u.id, u.role)} style={styles.deleteButton}>
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#4da6ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
  },
  createButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#4da6ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  cancelFormButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'center',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#e74c3c',
    padding: '4px 8px',
  },
  accessDenied: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#e74c3c',
    backgroundColor: '#f5f7fb',
  },
};

// Styles responsifs pour mobile
const responsiveStyles = `
  @media (max-width: 768px) {
    .table thead {
      display: none;
    }
    .table tr {
      display: block;
      margin-bottom: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 12px;
    }
    .table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border: none;
    }
    .table td:before {
      content: attr(data-label);
      font-weight: 600;
      color: #666;
      margin-right: 16px;
    }
  }
`;