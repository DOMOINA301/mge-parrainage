import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from "./pages/Login";
import Register from "./pages/Register";
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

function AppRoutes() {
  const { user, loading } = useAuth();

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
      <Route path="/register" element={<Register />} />
      
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentView />} />
        <Route path="/students/:id/edit" element={<EditStudent />} />
        <Route path="/students/:id/history" element={<StudentHistory />} />
        <Route path="/students/:studentId/situations" element={<SituationsList />} />
        <Route path="/students/:studentId/situations/new" element={<CreateSituation />} />
        <Route path="/situations/:id" element={<SituationView />} />
        <Route path="/settings" element={<Settings />} />
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