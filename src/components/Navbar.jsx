import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 15, background: "#0f172a" }}>
      <NavLink
        to="/"
        style={{ marginRight: 15, color: "white", textDecoration: "none" }}
      >
        Accueil
      </NavLink>

      <NavLink
        to="/register"
        style={{ marginRight: 15, color: "white", textDecoration: "none" }}
      >
        Inscription
      </NavLink>

      <NavLink
        to="/students"
        style={{ color: "white", textDecoration: "none" }}
      >
        Étudiants
      </NavLink>
    </nav>
  );
}
