import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// import './styles/android.css';

// Service Worker temporairement désactivé
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(reg => console.log('✅ Service Worker enregistré:', reg))
//       .catch(err => console.log('❌ Erreur Service Worker:', err.message));
//   });
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);