import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, canEdit } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/accueil" style={styles.logo}>
          📚 MGE
        </Link>
        
        <div style={styles.navLinks}>
          <Link to="/accueil" style={styles.navLink}>Accueil</Link>
          {canEdit() && <Link to="/inscription" style={styles.navLink}>Inscription</Link>}
          <Link to="/students" style={styles.navLink}>Étudiants</Link>
          <Link to="/settings" style={styles.navLink}>Paramètres</Link>
        </div>
        
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.nom || user?.email}</span>
          <span style={{...styles.roleBadge, ...getRoleStyle(user?.role)}}>
            {user?.role}
          </span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

const getRoleStyle = (role) => {
  switch(role) {
    case 'ADMIN': return { backgroundColor: '#e74c3c', color: 'white' };
    case 'RESPONSABLE': return { backgroundColor: '#27ae60', color: 'white' };
    case 'SPONSOR': return { backgroundColor: '#f39c12', color: 'white' };
    default: return { backgroundColor: '#95a5a6', color: 'white' };
  }
};

const styles = {
  navbar: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4da6ff',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'background 0.2s'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  userName: {
    fontSize: '14px',
    color: '#333'
  },
  roleBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666',
    transition: 'background 0.2s'
  }
};

// Responsive
const mediaStyles = `
  @media (max-width: 768px) {
    .navContainer { flex-direction: column; text-align: center; }
    .navLinks { justify-content: center; }
    .userInfo { justify-content: center; }
  }
`;