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
    return <div style={styles.error}>Accès non autorisé</div>;
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

    const allUsers = await getUsers();
    allUsers.push(newUser);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>← Retour</button>
        <h1 style={styles.title}>Gestion des utilisateurs</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2>Comptes existants</h2>
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            + Nouveau compte
          </button>
        </div>

        {message && <p style={message.includes('✅') ? styles.success : styles.error}>{message}</p>}

        {showForm && (
          <form onSubmit={createUser} style={styles.form}>
            <input type="text" name="nom" placeholder="Nom complet" value={form.nom} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="RESPONSABLE">Responsable</option>
              <option value="SPONSOR">Sponsor</option>
            </select>
            <button type="submit">Créer le compte</button>
            <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Annuler</button>
          </form>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nom</th><th>Email</th><th>Rôle</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.nom}</td><td>{u.email}</td><td><span style={getRoleStyle(u.role)}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => deleteUserAccount(u.id, u.role)} style={styles.deleteButton}>🗑️</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getRoleStyle = (role) => {
  switch(role) {
    case 'ADMIN': return { backgroundColor: '#e74c3c', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'RESPONSABLE': return { backgroundColor: '#27ae60', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    case 'SPONSOR': return { backgroundColor: '#f39c12', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
    default: return {};
  }
};

const styles = {
  container: { padding: '20px', backgroundColor: '#f5f7fb', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backButton: { padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '600', color: '#333', margin: 0 },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' },
  addButton: { padding: '10px 16px', backgroundColor: '#4da6ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px' },
  cancelButton: { backgroundColor: '#ccc', color: '#333' },
  table: { width: '100%', borderCollapse: 'collapse' },
  deleteButton: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#e74c3c' },
  error: { color: '#e74c3c', padding: '10px', textAlign: 'center' },
  success: { color: '#27ae60', padding: '10px', textAlign: 'center' }
};