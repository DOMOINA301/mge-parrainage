import React, { createContext, useState, useContext, useEffect } from 'react';
import { findUserByEmail, initDatabase, saveUser } from '../services/localStorageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      const storedUser = localStorage.getItem('mge_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Erreur parse user:', e);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    try {
      const foundUser = await findUserByEmail(email);
      if (foundUser && atob(foundUser.password) === password) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('mge_user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, message: 'Email ou mot de passe incorrect' };
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mge_user');
    window.location.href = '/login';
  };

  const register = async (userData) => {
    try {
      const existingUser = await findUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, message: 'Cet email est déjà utilisé' };
      }
      
      const newUser = {
        id: Date.now().toString(),
        nom: userData.nom,
        email: userData.email,
        password: btoa(userData.password),
        role: userData.role || 'RESPONSABLE',
        createdAt: new Date().toISOString()
      };
      await saveUser(newUser);
      return { success: true, message: 'Compte créé avec succès' };
    } catch (error) {
      console.error('Erreur register:', error);
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  // ========== PERMISSIONS ==========
  
  // RESPONSABLE peut tout gérer (inscription, modification, suppression, création situation)
  const canManageStudents = () => {
    return hasRole(['RESPONSABLE']); // Seul RESPONSABLE peut gérer les étudiants
  };
  
  const canEditStudent = () => {
    return hasRole(['RESPONSABLE']); // Seul RESPONSABLE peut modifier
  };
  
  const canDeleteStudent = () => {
    return hasRole(['RESPONSABLE']); // Seul RESPONSABLE peut supprimer
  };
  
  const canCreateSituation = () => {
    return hasRole(['RESPONSABLE']); // Seul RESPONSABLE peut créer une situation
  };
  
  // ADMIN (Sponsor) peut seulement valider/refuser les situations
  const canValidateSituation = () => {
    return hasRole(['ADMIN']); // Seul ADMIN (Sponsor) peut valider
  };
  
  // Les deux peuvent voir
  const canViewStudents = () => {
    return hasRole(['ADMIN', 'RESPONSABLE']);
  };
  
  const canViewSituations = () => {
    return hasRole(['ADMIN', 'RESPONSABLE']);
  };

  const isSponsor = () => {
    return hasRole(['ADMIN']);
  };

  const isResponsable = () => {
    return hasRole(['RESPONSABLE']);
  };

  const isAdmin = () => {
    return hasRole(['ADMIN']);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    hasRole,
    canManageStudents,
    canEditStudent,
    canDeleteStudent,
    canCreateSituation,
    canValidateSituation,
    canViewStudents,
    canViewSituations,
    isSponsor,
    isResponsable,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;