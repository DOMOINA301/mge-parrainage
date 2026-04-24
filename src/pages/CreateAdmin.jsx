import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createAdminWithSecretKey } from '../services/localStorageService';

export default function CreateAdmin() {
  const { isAdmin } = useAuth();
  const [secretKey, setSecretKey] = useState('');
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  if (!isAdmin()) {
    return <div style={styles.accessDenied}>⛔ Accès non autorisé</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createAdminWithSecretKey(secretKey, form);
    setMessage(result.message);
    if (result.success) {
      setForm({ nom: '', email: '', password: '' });
      setSecretKey('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>👑 Créer un administrateur</h1>
        
        {message && (
          <div style={message.includes('succès') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom complet</label>
            <input 
              type="text" 
              placeholder="Jean Dupont" 
              value={form.nom} 
              onChange={(e) => setForm({...form, nom: e.target.value})} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Clé secrète</label>
            <input 
              type="password" 
              placeholder="Clé d'administration" 
              value={secretKey} 
              onChange={(e) => setSecretKey(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Créer l'administrateur
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '32px 24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: '24px',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'border-color 0.3s',
    width: '100%',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#4da6ff',
    },
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#4da6ff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop: '8px',
    ':hover': {
      backgroundColor: '#3a8ae0',
    },
  },
  accessDenied: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#e74c3c',
    background: '#f5f7fb',
  },
};

// Styles responsifs pour mobile
const responsiveStyles = `
  @media (max-width: 480px) {
    .card {
      padding: 24px 16px;
    }
    h1 {
      font-size: 20px;
    }
    input, button {
      font-size: 16px !important;
    }
  }
`;