import toast from 'react-hot-toast';

// Demander la permission de notification (navigateur)
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Ce navigateur ne supporte pas les notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Notification push pour les situations urgentes
export const notifyUrgentSituation = (studentName, situationType) => {
  // Notification toast (popup dans l'app)
  toast.error(`⚠️ URGENT : ${studentName} - ${situationType}`, {
    duration: 8000,
    position: 'top-right',
    icon: '🚨',
  });
  
  // Notification système (si permission accordée)
  if (Notification.permission === 'granted') {
    new Notification('MGE Parrainage - Situation urgente', {
      body: `${studentName} a signalé une situation : ${situationType}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
    });
  }
};

// Notification de validation
export const notifyValidation = (studentName, status) => {
  if (status === 'validée') {
    toast.success(`✅ Situation de ${studentName} a été validée !`);
  } else {
    toast.error(`❌ Situation de ${studentName} a été refusée.`);
  }
};