import type { AdvancedSearchFilters } from "../types/search";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

const initalFilters: AdvancedSearchFilters = {
    title: "",
    author: "",
    subject: "",
    publisher: "",
    year: "",
};

function AdvancedSearch () {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<AdvancedSearchFilters>(initalFilters);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const hasAtLeastOneFilter = useMemo(() => {
        return Object.values(filters).some((v) => v.trim() !== "");
    }, [filters]);

    function buildSearchUrl() {
        const params = new URLSearchParams();

        const title = filters.title.trim();
        const author = filters.author.trim();
        const subject = filters.subject.trim();
        const publisher = filters.publisher.trim();
        const year = filters.year.trim();

        if (title) params.set("title", title);
        if (author) params.set("author", author);
        if (subject) params.set("subject", subject);
        if (publisher) params.set("publisher", publisher);
        if (year) params.set("year", year);

        params.set("limit", "20");
        params.set("page", "1");

        return `/search?${params.toString()}`;
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!hasAtLeastOneFilter) return;

        const url = buildSearchUrl();
        navigate(url);
    }

    function onReset() {
        setFilters(initalFilters);
    }

    return (
        <div style={styles.page}>
        <h1 style={styles.title}>Recherche avancée</h1>

        <form onSubmit={onSubmit} style={styles.card}>
            <div style={styles.grid}>
            <div style={styles.field}>
                <label style={styles.label}>Titre</label>
                <input
                name="title"
                value={filters.title}
                onChange={handleChange}
                style={styles.input}
                placeholder="ex: Dune"
                />
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Auteur</label>
                <input
                name="author"
                value={filters.author}
                onChange={handleChange}
                style={styles.input}
                placeholder="ex: Frank Herbert"
                />
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Sujet</label>
                <input
                name="subject"
                value={filters.subject}
                onChange={handleChange}
                style={styles.input}
                placeholder="ex: fantasy"
                />
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Éditeur</label>
                <input
                name="publisher"
                value={filters.publisher}
                onChange={handleChange}
                style={styles.input}
                placeholder="ex: Chilton Books"
                />
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Année</label>
                <input
                name="year"
                value={filters.year}
                onChange={handleChange}
                style={styles.input}
                placeholder="ex: 1997"
                inputMode="numeric"
                />
            </div>
            </div>

            <div style={styles.actions}>
            <button type="button" onClick={onReset} style={styles.secondaryBtn}>
                Réinitialiser
            </button>

            <button
                type="submit"
                style={{
                ...styles.primaryBtn,
                opacity: hasAtLeastOneFilter ? 1 : 0.6,
                cursor: hasAtLeastOneFilter ? "pointer" : "not-allowed",
                }}
                disabled={!hasAtLeastOneFilter}
            >
                Rechercher
            </button>
            </div>
        </form>
        </div>
    );    
}

export default AdvancedSearch;

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 24,
    maxWidth: 1100,
    margin: "0 auto",
  },
  title: {
    fontFamily: "var(--font)",
    color: "var(--primary)",
    fontSize: 42,
    marginBottom: 16,
  },
  card: {
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontWeight: 700,
    color: "var(--secondary)",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    padding: "10px 14px",
    backgroundColor: "var(--primary)",
    color: "white",
    fontWeight: 800,
  },
  secondaryBtn: {
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    padding: "10px 14px",
    backgroundColor: "white",
    fontWeight: 800,
  },
};