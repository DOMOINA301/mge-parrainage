import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createAdminWithSecretKey } from '../services/localStorageService';

export default function CreateAdmin() {
  const { isAdmin } = useAuth();
  const [secretKey, setSecretKey] = useState('');
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  if (!isAdmin()) {
    return <div style={styles.error}>Accès non autorisé</div>;
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
      <h1>Créer un administrateur</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Nom complet" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
        <input type="password" placeholder="Clé secrète" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} required />
        <button type="submit">Créer l'administrateur</button>
      </form>
      {message && <p style={message.includes('succès') ? styles.success : styles.error}>{message}</p>}
    </div>
  );
}

const styles = {
  container: { padding: '40px 20px', maxWidth: '500px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  error: { color: '#e74c3c', textAlign: 'center', marginTop: '20px' },
  success: { color: '#27ae60', textAlign: 'center', marginTop: '20px' }
};