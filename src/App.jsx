import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from "./pages/Login";
import Accueil from "./pages/Accueil";
import Inscription from "./pages/Inscription";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import EditStudent from "./pages/EditStudent";
import StudentHistory from "./pages/StudentHistory";
import CreateSituation from "./pages/CreateSituation";
import SituationsList from "./pages/SituationsList";
import SituationView from "./pages/SituationView";
import Settings from "./pages/Settings";
import Layout from "./Layout";
import CreateAdmin from "./pages/CreateAdmin";
import ManageUsers from "./pages/ManageUsers";

function AppRoutes() {
  const { user, loading, canManageStudents, isAdmin } = useAuth();

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
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/accueil" : "/login"} />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/accueil" />} />
      
      {/* Route Inscription - seulement pour RESPONSABLE */}
      {user && canManageStudents() && (
        <Route path="/inscription" element={<Inscription />} />
      )}
      
      {/* Routes réservées ADMIN (gestion des comptes) */}
      {user && isAdmin() && (
        <>
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </>
      )}
      
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentView />} />
        <Route path="/students/:id/history" element={<StudentHistory />} />
        <Route path="/students/:studentId/situations" element={<SituationsList />} />
        <Route path="/situations/:id" element={<SituationView />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Routes réservées RESPONSABLE (création et modification) */}
        {canManageStudents() && (
          <>
            <Route path="/students/:id/edit" element={<EditStudent />} />
            <Route path="/students/:studentId/situations/new" element={<CreateSituation />} />
          </>
        )}
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}