

function Navbar() {

    return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Shoten</div>
        <ul style={styles.links}>
            <li>
                <a href="/advanced-search" style={styles.link}>Recherche avancée</a>
            </li>
            <li>
                <a href="/" style={styles.link}>Accueil</a>
            </li>
            <li>
                <a href="/search" style={styles.link}>🔎</a>
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
    padding: "12px 24px",
    backgroundColor: "#e3f2fd",
  },

  brand: {
    fontWeight: "bold",
    fontSize: "20px",
  },

  links: {
    display: "flex",        
    listStyle: "none",
    gap: "20px",      
    margin: 0,
    padding: 0,
  },

  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
};