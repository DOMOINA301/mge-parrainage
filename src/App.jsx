import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from './context/ThemeContext'; // ← AJOUTÉ

/* PAGES */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Accueil from "./pages/Accueil";
import Inscription from "./pages/Inscription";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import EditStudent from "./pages/EditStudent";
import StudentHistory from "./pages/StudentHistory";

/* SITUATIONS */
import CreateSituation from "./pages/CreateSituation";
import SituationsList from "./pages/SituationsList";
import SituationView from "./pages/SituationView";
import Settings from "./pages/Settings"; // ← DÉJÀ PRÉSENT

/* LAYOUT */
import Layout from "./Layout";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Token au chargement:", token ? "Présent" : "Absent");
    setIsAuth(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: "#f5f7fb"
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <ThemeProvider> {/* ← AJOUTÉ */}
      <BrowserRouter>
        <Routes>
          {/* 🏠 PAGE DÉFAUT - Redirige selon auth */}
          <Route 
            path="/" 
            element={
              isAuth ? (
                <Navigate to="/accueil" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🔑 LOGIN */}
          <Route
            path="/login"
            element={
              isAuth ? (
                <Navigate to="/accueil" replace />
              ) : (
                <Login setIsAuth={setIsAuth} />
              )
            }
          />

          {/* 📝 REGISTER */}
          <Route path="/register" element={<Register />} />

          {/* 🔒 ZONE PROTÉGÉE */}
          <Route
            element={
              isAuth ? (
                <Layout setIsAuth={setIsAuth} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentView />} />
            <Route path="/students/:id/edit" element={<EditStudent />} />
            <Route path="/students/:id/history" element={<StudentHistory />} />
            <Route path="/students/:studentId/situations" element={<SituationsList />} />
            <Route path="/students/:studentId/situations/new" element={<CreateSituation />} />
            <Route path="/situations/:id" element={<SituationView />} />
            <Route path="/settings" element={<Settings />} /> {/* ← DÉJÀ PRÉSENT */}
          </Route>

          {/* ❌ AUTRE URL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}