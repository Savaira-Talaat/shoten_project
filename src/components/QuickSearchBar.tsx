import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import type { QuickDoc } from "../types/search";


function bookIdFromKey(key: string) {
  return key.split("/").pop() ?? "";
}

export default function QuickSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuickDoc[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      abortRef.current?.abort();
      return;
    }

    setOpen(true);

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setResults((data.docs ?? []) as QuickDoc[]);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  function goToBookDetail(bookKey: string) {
    const id = bookIdFromKey(bookKey);
    if (!id) return;
    setOpen(false);
    setQuery("");
    navigate(`/book/${id}`);
  }

  return (
    <div style={{ position: "relative", flex: 1, maxWidth: 560 }}>
      <form onSubmit={onSubmit} style={styles.searchForm} role="search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Rechercher un livre, un auteur..."
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          <FiSearch size={18} />
        </button>
      </form>

      {open && (
        <div style={styles.dropdown}>
          {loading && <div style={styles.dropdownItemMuted}>Recherche...</div>}

          {!loading && results.length === 0 && (
            <div style={styles.dropdownItemMuted}>Aucun résultat</div>
          )}

          {!loading &&
            results.map((doc) => {
              const author = doc.author_name?.[0] ?? "Auteur inconnu";
              return (
                <button
                  key={doc.key}
                  onClick={() => goToBookDetail(doc.key)}
                  style={styles.dropdownItemBtn}
                  type="button"
                >
                  <div style={styles.row}>
                    <div style={styles.texts}>
                      <div style={styles.titleLine}>{doc.title}</div>
                      <div style={styles.metaLine}>{author}</div>
                    </div>
                  </div>
                </button>
              );
            })}

          {!loading && results.length > 0 && (
            <div style={styles.dropdownFooter}>
              <button
                onClick={() =>
                  onSubmit({ preventDefault() {} } as React.FormEvent)
                }
                style={styles.viewAllBtn}
                type="button"
              >
                Voir tous les résultats
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  searchForm: { display: "flex", alignItems: "center", gap: 10 },

  searchInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    backgroundColor: "white",
  },

  searchButton: {
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    backgroundColor: "white",
    padding: "10px 14px",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute" as const,
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
  },

  dropdownItemMuted: {
    padding: 12,
    opacity: 0.75,
  },

  dropdownItemBtn: {
    width: "100%",
    textAlign: "left" as const,
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
  },

  row: { display: "flex", gap: 12, padding: 12, alignItems: "center" },

  texts: { minWidth: 0 },

  titleLine: {
    fontWeight: 700,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  metaLine: {
    fontSize: 13,
    opacity: 0.75,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  dropdownFooter: { borderTop: "1px solid rgba(0,0,0,0.08)", padding: 10 },

  viewAllBtn: {
    width: "100%",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 700,
    padding: 8,
  },
};
