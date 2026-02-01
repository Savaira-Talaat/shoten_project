import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Work, WikiData } from "../types/bookDetails";

export default function BookDetail() {

  //stocke ce qui y aura à utilité
  const { id } = useParams<{ id: string }>(); // l'id du livre en passant par l'URL
  const [book, setBook] = useState<Work | null>(null);  // titre et description
  const [authors, setAuthors] = useState<string[]>([]); //noms des auteurs
  const [publishDate, setPublishDate] = useState<string | null>(null); //date de publication
  const [coverId, setCoverId] = useState<number | null>(null); //l'id de la couverture
  const [loading, setLoading] = useState(true); //le chargement

// Stocke les informations récupérées depuis Wikipedia
// null = aucune donnée ou article non trouvé
  const [wikipedia, setWikipedia] = useState<WikiData | null>(null);


  useEffect(() => {
    async function fetchBookData() {

      try {
        //récupération des infos du livre
        const workRes = await fetch(`https://openlibrary.org/works/${id}.json`);
        const workData: Work = await workRes.json();  
        setBook(workData); // on stocke

        // DEBUT - Partie de wikipedia 
const titreWikipedia = encodeURIComponent(workData.title);

try {
  const wikiRes = await fetch(
    `https://fr.wikipedia.org/api/rest_v1/page/summary/${titreWikipedia}`
  );

  if (wikiRes.ok) {
    const wikiJson: WikiData = await wikiRes.json();
    setWikipedia(wikiJson);
  }
} catch (error) {
  console.warn("Informations Wikipedia non disponibles");
}
      // FIN - Parti wikipedia

        //on récupère les noms des auteurs si le livre en a
        if (workData.authors && workData.authors.length > 0) {
          const authorPromises = workData.authors.map((a) =>
            fetch(`https://openlibrary.org${a.author.key}.json`)
              .then((res) => res.json())
              .then((data) => data.name)
          );

          const authorNames = await Promise.all(authorPromises); // attente des fetch
          setAuthors(authorNames);// on stock les noms
        }

        //récupération des éditions pour avoir la date et la couverture
        const editionRes = await fetch(`https://openlibrary.org/works/${id}/editions.json`);
        const editionData = await editionRes.json();

        if (editionData.entries && editionData.entries.length > 0) {
          
          const edition = editionData.entries.find(
            (e: any) => e.covers && e.covers.length > 0
          ) || editionData.entries[0];

          setPublishDate(edition.publish_date || null); // si la date existe, affiche

          if (edition.covers && edition.covers.length > 0) {
            setCoverId(edition.covers[0]);// on prend la couverture
          }
        }
      } catch (error) {
        console.error("Erreur chargement livre", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!book) return <p>Livre introuvable</p>; // au cas où le livre n'existe pas

  return (

    //tout l'html
    <div style={{ padding: "1rem" }}>
      {coverId && (
        <img
          src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
          alt={`Couverture du livre ${book.title}`}
          style={{ maxWidth: "200px", marginBottom: "1rem" }}
        />
      )}

      <h1>{book.title}</h1>

      {authors.length > 0 && (
        <p>
          <strong>Auteur(s) :</strong> {authors.join(", ")}
        </p>
      )}

      {publishDate && (
        <p>
          <strong>Date de publication :</strong> {publishDate}
        </p>
      )}

      {book.description && (
        <p style={{ marginTop: "1rem" }}>
          {typeof book.description === "string"
            ? book.description
            : book.description.value}
        </p>
      )}

      {/* partie de wikipedia  */}
      
      {wikipedia && (
  <section style={{ marginTop: "2rem" }}>
    <h2>À propos (Wikipedia)</h2>

    {wikipedia.originalimage && (
      <img
        src={wikipedia.originalimage.source}
        alt="Illustration Wikipedia"
        style={{ maxWidth: "250px", marginBottom: "1rem" }}
      />
    )}

    {wikipedia.extract && <p>{wikipedia.extract}</p>}

    {wikipedia.content_urls?.desktop?.page && (
      <a
        href={wikipedia.content_urls.desktop.page}
        target="_blank"
        rel="noopener noreferrer"
      >
        Voir l’article sur Wikipedia
      </a>
    )}
  </section>
)}

    </div>
  );
}