import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { theme, settings } = useTheme();
  const { logout, canManageStudents, isAdmin } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const closeMenu = () => setMenuOpen(false);

  const getFontSize = () => {
    switch(settings.fontSize) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f7fb',
      color: theme === 'dark' ? '#ffffff' : '#333333',
      fontSize: getFontSize(),
    },
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 16px',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#4da6ff',
      margin: 0,
    },
    burgerButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    burgerLine: {
      width: '24px',
      height: '2px',
      backgroundColor: '#333',
      borderRadius: '2px',
      transition: 'all 0.3s ease',
    },
    nav: {
      ...(isMobile && menuOpen ? {
        position: 'fixed',
        top: '60px',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 99,
        padding: '20px',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto',
      } : {}),
    },
    navLinks: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      ...(isMobile && menuOpen ? {
        flexDirection: 'column',
        width: '100%',
      } : {}),
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      color: '#333',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      backgroundColor: '#f5f5f5',
      ...(isMobile && menuOpen ? {
        width: '100%',
      } : {}),
    },
    navLinkActive: {
      backgroundColor: '#e6f0ff',
      color: '#4da6ff',
    },
    navIcon: {
      width: '20px',
      height: '20px',
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 20px',
      backgroundColor: '#ff4757',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      width: '100%',
      marginTop: '10px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 98,
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 16px',
    },
  };

  // Navigation desktop (visible sur grand écran)
  const desktopNav = !isMobile && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Link to="/accueil" style={{...styles.navLink, ...(location.pathname === '/accueil' ? styles.navLinkActive : {})}}>
        Accueil
      </Link>
      {canManageStudents() && (
        <Link to="/inscription" style={{...styles.navLink, ...(location.pathname === '/inscription' ? styles.navLinkActive : {})}}>
          Inscription
        </Link>
      )}
      <Link to="/students" style={{...styles.navLink, ...(location.pathname.includes('/students') ? styles.navLinkActive : {})}}>
        Étudiants
      </Link>
      {isAdmin() && (
        <Link to="/manage-users" style={{...styles.navLink, ...(location.pathname === '/manage-users' ? styles.navLinkActive : {})}}>
          Utilisateurs
        </Link>
      )}
      <Link to="/settings" style={{...styles.navLink, ...(location.pathname === '/settings' ? styles.navLinkActive : {})}}>
        Paramètres
      </Link>
      <button onClick={handleLogout} style={styles.logoutButton}>Déconnexion</button>
    </div>
  );

  // Navigation mobile (menu burger)
  const mobileNav = isMobile && menuOpen && (
    <div style={styles.nav}>
      <div style={styles.navLinks}>
        <Link to="/accueil" style={{...styles.navLink, ...(location.pathname === '/accueil' ? styles.navLinkActive : {})}} onClick={closeMenu}>
          <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg> Accueil
        </Link>
        {canManageStudents() && (
          <Link to="/inscription" style={{...styles.navLink, ...(location.pathname === '/inscription' ? styles.navLinkActive : {})}} onClick={closeMenu}>
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg> Inscription
          </Link>
        )}
        <Link to="/students" style={{...styles.navLink, ...(location.pathname.includes('/students') ? styles.navLinkActive : {})}} onClick={closeMenu}>
          <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg> Étudiants
        </Link>
        {isAdmin() && (
          <Link to="/manage-users" style={{...styles.navLink, ...(location.pathname === '/manage-users' ? styles.navLinkActive : {})}} onClick={closeMenu}>
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg> Utilisateurs
          </Link>
        )}
        <Link to="/settings" style={{...styles.navLink, ...(location.pathname === '/settings' ? styles.navLinkActive : {})}} onClick={closeMenu}>
          <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg> Paramètres
        </Link>
        <button onClick={() => { handleLogout(); closeMenu(); }} style={styles.logoutButton}>
          <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        @media (max-width: 768px) {
          input, select, textarea, button { font-size: 16px !important; min-height: 48px !important; }
          button:active { opacity: 0.8; transform: scale(0.98); }
        }
      `}</style>
      
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.logo}>MGE Parrainage</h1>
            {isMobile && (
              <button style={styles.burgerButton} onClick={() => setMenuOpen(!menuOpen)}>
                <span style={{...styles.burgerLine, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'}}></span>
                <span style={{...styles.burgerLine, opacity: menuOpen ? 0 : 1}}></span>
                <span style={{...styles.burgerLine, transform: menuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none'}}></span>
              </button>
            )}
          </div>
        </header>

        {desktopNav}
        {mobileNav}
        {menuOpen && isMobile && <div style={styles.overlay} onClick={closeMenu} />}

        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </>
  );
}