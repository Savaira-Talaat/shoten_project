import { Link } from "react-router-dom";
import QuickSearchBar from "./QuickSearchBar";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.brand}>Shoten</Link>

      <QuickSearchBar />

      <ul style={styles.links}>
        <li>
          <Link to="/advanced-search" style={styles.link}>
            Recherche avancée
          </Link>
        </li>
        <li>
          <Link to="/" style={styles.link}>
            Accueil
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;


const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    backgroundColor: "#e3f2fd",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
    gap: 16,
  },

  brand: {
    fontFamily: "var(--font)",
    fontWeight: "bold",
    fontSize: "28px",
    color: "var(--primary)",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
  },

  links: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
    margin: 0,
    padding: 0,
    alignItems: "center",
    whiteSpace: "nowrap" as const,
  },

  link: {
    textDecoration: "none",
    color: "var(--secondary)",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "999px",
    transition: "background 0.2s, transform 0.05s",
  },
};
