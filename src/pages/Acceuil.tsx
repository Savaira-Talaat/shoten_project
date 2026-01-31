import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Type représentant un changement récent OpenLibrary
type ChangementRecent = {
  id: number;
  kind: string;
  comment?: string;
  timestamp: string;
  data?: {
    title?: string;
    key?: string;
  };
};

export default function Accueil() {
  const [changementsRecents, setChangementsRecents] = useState<ChangementRecent[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    async function chargerChangementsRecents() {
      try {
        const reponse = await fetch(
          "https://openlibrary.org/recentchanges.json?limit=10"
        );

        if (!reponse.ok) {
          throw new Error("Impossible de récupérer les changements récents");
        }

        const donnees: ChangementRecent[] = await reponse.json();
        setChangementsRecents(donnees);
      } catch (e) {
        console.error(e);
        setErreur("Une erreur est survenue lors du chargement des données.");
      } finally {
        setChargement(false);
      }
    }

    chargerChangementsRecents();
  }, []);

  if (chargement) return <p>Chargement de la bibliothèque…</p>;
  if (erreur) return <p>{erreur}</p>;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
      {/* EN-TÊTE */}
      <header style={{ marginBottom: "2rem" }}>
        <h1>📚 Bibliothèque municipale</h1>
        <p>
          Bienvenue sur le catalogue numérique de la bibliothèque.
          Recherchez des ouvrages, explorez notre collection
          et découvrez les dernières mises à jour.
        </p>
      </header>

      {/* SECTION : CHANGEMENTS RÉCENTS */}
      <section>
        <h2>🆕 Dernières mises à jour</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {changementsRecents.map((changement) => {
            const cleDocument = changement.data?.key;
            const identifiantLivre =
              cleDocument && cleDocument.startsWith("/works/")
                ? cleDocument.replace("/works/", "")
                : null;

            return (
              <li
                key={changement.id}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                <p>
                  <strong>
                    {changement.data?.title || "Document sans titre"}
                  </strong>
                </p>

                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  Type de modification : {changement.kind}
                  <br />
                  Date :{" "}
                  {new Date(changement.timestamp).toLocaleDateString("fr-FR")}
                </p>

                {identifiantLivre && (
                  <Link to={`/book/${identifiantLivre}`}>
                    Voir la fiche du livre
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
