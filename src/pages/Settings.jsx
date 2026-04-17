import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, settings, toggleTheme, updateSetting, resetSettings } = useTheme();

  // ✅ Réglages UTILES pour MGE
  const categories = [
    {
      id: 'affichage',
      title: '🎨 Affichage',
      icon: '🎨',
      settings: [
        { 
          key: 'theme', 
          label: 'Mode sombre', 
          type: 'toggle', 
          description: 'Plus agréable la nuit',
          action: toggleTheme 
        },
        { 
          key: 'fontSize', 
          label: 'Taille du texte', 
          type: 'select', 
          options: ['small', 'medium', 'large'], 
          labels: ['Petite', 'Moyenne', 'Grande'],
        },
        { 
          key: 'compactMode', 
          label: 'Mode compact', 
          type: 'toggle', 
          description: 'Voir plus d\'étudiants' 
        },
        { 
          key: 'showPhotos', 
          label: 'Afficher les photos', 
          type: 'toggle', 
          description: 'Charger plus vite' 
        },
        { 
          key: 'showStats', 
          label: 'Statistiques', 
          type: 'toggle', 
          description: 'Voir les compteurs' 
        },
      ]
    },
    {
      id: 'gestion',
      title: '📋 Gestion',
      icon: '📋',
      settings: [
        { 
          key: 'defaultStatus', 
          label: 'Statut par défaut', 
          type: 'select', 
          options: ['actif', 'suspendu'], 
          labels: ['Actif', 'Suspendu'],
          description: 'Pour les nouveaux' 
        },
        { 
          key: 'confirmDelete', 
          label: 'Confirmation', 
          type: 'toggle', 
          description: 'Demander avant suppression' 
        },
        { 
          key: 'autoSave', 
          label: 'Sauvegarde auto', 
          type: 'toggle', 
          description: 'Enregistrer les modifs' 
        },
        { 
          key: 'saveHistory', 
          label: 'Historique', 
          type: 'toggle', 
          description: 'Garder les actions' 
        },
      ]
    },
    {
      id: 'connexion',
      title: '🔌 Connexion',
      icon: '🔌',
      settings: [
        { 
          key: 'stayConnected', 
          label: 'Rester connecté', 
          type: 'toggle', 
          description: 'Pas de reconnexion' 
        },
        { 
          key: 'autoRefresh', 
          label: 'Rafraîchir auto', 
          type: 'toggle', 
          description: 'Toutes les 5 minutes' 
        },
      ]
    },
  ];

  // Fonction pour rendre un toggle
  const renderToggle = (setting, value) => (
    <div 
      style={{
        width: '50px',
        height: '26px',
        backgroundColor: value ? '#1877f2' : (theme === 'dark' ? '#444' : '#e4e6eb'),
        borderRadius: '13px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={() => setting.key === 'theme' ? setting.action() : updateSetting(setting.key, !value)}
    >
      <div style={{
        width: '22px',
        height: '22px',
        backgroundColor: '#fff',
        borderRadius: '11px',
        position: 'absolute',
        top: '2px',
        left: value ? '26px' : '2px',
        transition: 'left 0.3s ease',
      }} />
    </div>
  );

  // Fonction pour rendre un select
  const renderSelect = (setting, value) => (
    <select
      value={value}
      onChange={(e) => updateSetting(setting.key, e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: `1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'}`,
        backgroundColor: theme === 'dark' ? '#3d3d3d' : '#ffffff',
        color: theme === 'dark' ? '#fff' : '#333',
        fontSize: '14px',
        cursor: 'pointer',
        minWidth: '120px',
      }}
    >
      {setting.options.map((opt, idx) => (
        <option key={opt} value={opt}>{setting.labels[idx]}</option>
      ))}
    </select>
  );

  return (
    <div style={{
      padding: '20px',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f2f5',
      minHeight: '100vh',
      color: theme === 'dark' ? '#ffffff' : '#1c1e21',
    }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`,
        paddingBottom: '16px',
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{
            padding: '8px 16px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            color: theme === 'dark' ? '#fff' : '#1877f2',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Retour
        </button>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          margin: 0,
          color: theme === 'dark' ? '#fff' : '#1c1e21',
        }}>Paramètres</h1>
      </div>

      {/* Catégories */}
      {categories.map(category => (
        <div key={category.id} style={{
          backgroundColor: theme === 'dark' ? '#242526' : '#ffffff',
          borderRadius: '12px',
          marginBottom: '16px',
          border: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
          overflow: 'hidden',
        }}>
          {/* Titre catégorie */}
          <div style={{
            padding: '16px',
            borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
            backgroundColor: theme === 'dark' ? '#1e1f20' : '#f8f9fa',
          }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: theme === 'dark' ? '#e4e6eb' : '#1c1e21',
            }}>
              {category.icon} {category.title}
            </span>
          </div>

          {/* Options */}
          {category.settings.map(setting => (
            <div key={setting.key} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'}`,
            }}>
              <div>
                <div style={{ 
                  fontSize: '15px',
                  fontWeight: '500',
                  color: theme === 'dark' ? '#e4e6eb' : '#1c1e21',
                }}>{setting.label}</div>
                {setting.description && (
                  <div style={{ 
                    fontSize: '13px',
                    color: theme === 'dark' ? '#b0b3b8' : '#65676b',
                  }}>{setting.description}</div>
                )}
              </div>
              
              {setting.type === 'toggle' && renderToggle(setting, 
                setting.key === 'theme' ? theme === 'dark' : settings[setting.key]
              )}
              {setting.type === 'select' && renderSelect(setting, settings[setting.key])}
            </div>
          ))}
        </div>
      ))}

      {/* Bouton réinitialiser */}
      <button 
        onClick={resetSettings}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: '#1877f2',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        🔄 Réinitialiser mes préférences
      </button>

      {/* Version */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        color: theme === 'dark' ? '#b0b3b8' : '#65676b',
        fontSize: '13px',
      }}>
        MGE • Version 1.0
      </div>
    </div>
  );
}