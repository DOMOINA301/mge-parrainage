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
      
      let role = userData.role || 'RESPONSABLE';
      if (role === 'ADMIN') {
        role = 'RESPONSABLE';
      }
      
      const newUser = {
        id: Date.now().toString(),
        nom: userData.nom,
        email: userData.email,
        password: btoa(userData.password),
        role: role,
        createdAt: new Date().toISOString(),
        active: true
      };
      await saveUser(newUser);
      return { success: true, message: 'Compte créé avec succès' };
    } catch (error) {
      console.error('Erreur register:', error);
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (typeof requiredRole === 'string') {
      return user.role === requiredRole;
    }
    return requiredRole.includes(user.role);
  };

  // ============ PERMISSIONS ============
  
  // RESPONSABLE : peut tout gérer (étudiants, situations)
  const canManageStudents = () => {
    return user?.role === 'RESPONSABLE';
  };

  const canEditStudent = () => {
    return user?.role === 'RESPONSABLE';
  };

  const canDeleteStudent = () => {
    return user?.role === 'RESPONSABLE';
  };

  const canCreateSituation = () => {
    return user?.role === 'RESPONSABLE';
  };

  // SPONSOR (ET ADMIN) : peut seulement VALIDER les demandes d'aide
  const canValidateSituation = () => {
    return user?.role === 'SPONSOR' || user?.role === 'ADMIN';
  };

  // Vérifications de rôles
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isResponsable = () => {
    return user?.role === 'RESPONSABLE';
  };

  const isSponsor = () => {
    return user?.role === 'SPONSOR';
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
    isAdmin,
    isResponsable,
    isSponsor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;