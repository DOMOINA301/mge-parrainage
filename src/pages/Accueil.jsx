export default function Accueil() {
  return (
    <div style={styles.container}>
      {/* SECTION PRINCIPALE */}
      <div style={styles.hero}>
        <div style={styles.textBlock}>
          <h1 style={styles.title}>
            Association Madagascar <br /> Grandir Ensemble
          </h1>

          <p style={styles.subtitle}>
            Plateforme professionnelle de suivi des étudiants sponsorisés
          </p>

          <p style={styles.description}>
            Cette application permet à l’Association Madagascar Grandir Ensemble
            d’assurer le suivi administratif et académique des étudiants
            bénéficiaires, de centraliser les informations essentielles et de
            garantir une gestion transparente des actions de parrainage.
          </p>

          <div style={styles.buttons}>
           
          </div>
        </div>

        <img
          src="/solidarite.jpg"
          alt="Solidarité et éducation"
          style={styles.image}
        />
      </div>

      {/* PIED DE PAGE */}
      <div style={styles.footer}>
        Ensemble, investissons dans l’éducation et l’avenir des jeunes à Madagascar.
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  container: {
    minHeight: "100vh",
    padding: "60px 80px",
    backgroundColor: "#ffffff",
    fontFamily: "Arial, sans-serif"
  },

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 50,
    flexWrap: "wrap"
  },

  textBlock: {
    maxWidth: 600
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0b3d2e",
    marginBottom: 15
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20
  },

  description: {
    fontSize: 17,
    lineHeight: 1.6,
    color: "#555",
    marginBottom: 30
  },

  image: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 15,
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
  },

  buttons: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap"
  },

  primaryButton: {
    backgroundColor: "#0b3d2e",
    color: "#ffffff",
    padding: "14px 30px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: "bold"
  },

  secondaryButton: {
    backgroundColor: "#cfe4de",
    color: "#0b3d2e",
    padding: "14px 30px",
    borderRadius: 8,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: "bold"
  },

  footer: {
    marginTop: 80,
    paddingTop: 25,
    borderTop: "1px solid #ddd",
    textAlign: "center",
    fontSize: 15,
    color: "#666"
  }
};
