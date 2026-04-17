import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      // 🎨 Affichage
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      showPhotos: true,
      showStats: true,
      
      // 📋 Gestion
      defaultStatus: 'actif',
      confirmDelete: true,
      autoSave: true,
      saveHistory: true,
      
      // ⚡ Préférences
      stayConnected: true,
      autoRefresh: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      showPhotos: true,
      showStats: true,
      defaultStatus: 'actif',
      confirmDelete: true,
      autoSave: true,
      saveHistory: true,
      stayConnected: true,
      autoRefresh: false,
    });
    setTheme('light');
    alert('✅ Paramètres réinitialisés !');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      settings,
      toggleTheme,
      updateSetting,
      resetSettings,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};