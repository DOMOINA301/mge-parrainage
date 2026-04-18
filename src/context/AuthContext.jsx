import React, { createContext, useState, useContext, useEffect } from 'react';
import { findUserByEmail, initDatabase, saveUser } from '../services/localStorageService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      const storedUser = localStorage.getItem('mge_user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const foundUser = await findUserByEmail(email);
    if (foundUser && atob(foundUser.password) === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('mge_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, message: 'Email ou mot de passe incorrect' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mge_user');
  };

  const register = async (userData) => {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) return { success: false, message: 'Cet email est déjà utilisé' };
    
    const newUser = {
      id: Date.now().toString(),
      nom: userData.nom,
      email: userData.email,
      password: btoa(userData.password),
      role: userData.role || 'USER',
      createdAt: new Date().toISOString()
    };
    await saveUser(newUser);
    return { success: true, message: 'Compte créé avec succès' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};