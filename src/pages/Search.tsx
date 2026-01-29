import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { SearchDoc, SearchResponse } from "../types/search";

function bookIdFromKey(key:string) {
    return key.split("/").pop() ?? "";
}

function buildOpenLibraryUrl(params: URLSearchParams) {
    const q = (params.get("q") ?? "").trim();
    const title = (params.get("title") ?? "").trim();
    const author = (params.get("author") ?? "").trim();
    const subject = (params.get("subject") ?? "").trim();
    const publisher = (params.get("publisher") ?? "").trim();
    const year = (params.get("year") ?? "").trim();
    const limit = (params.get("limit") ?? "20").trim();
    const page = (params.get("page") ?? "1").trim();
    const apiParams = new URLSearchParams();

    const qParts: string[] = [];
    if (q) qParts.push(q);
    if (title) qParts.push(`title:${title}`);
    if (author) qParts.push(`author:${author}`);
    if (subject) qParts.push(`subject:${subject}`);
    if (publisher) qParts.push(`publisher:${publisher}`);
    if (year) qParts.push(`first_publish_year:${year}`);
    if (qParts.length > 0) apiParams.set("q", qParts.join(" "));
    apiParams.set("limit", limit);
    apiParams.set("page", page);

    return `https://openlibrary.org/search.json?${apiParams.toString()}`;
}

function buildActiveFiltersLabel(params: URLSearchParams) {
    const pairs: Array<[string, string]> = [
        ["q", params.get("q") ?? ""],
        ["title", params.get("title") ?? ""],
        ["author", params.get("author") ?? ""],
        ["subject", params.get("subject") ?? ""],
        ["publisher", params.get("publisher") ?? ""],
        ["year", params.get("year") ?? ""]
    ];

    const active = pairs
        .map(([k, v]) => [k, v.trim()] as const)
        .filter(([, v]) => v.length > 0)

        if (active.length === 0) return "";

        return active.map(([k, v]) => `${k}: ${v}`).join(" - ");
}

export default function Search() {
    const [searchParams] = useSearchParams();
    const paramsKey = searchParams.toString();
    const [docs, setDocs] = useState<SearchDoc[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const apiUrl = useMemo(() => buildOpenLibraryUrl(searchParams), [searchParams]);
    const label = useMemo(() => buildActiveFiltersLabel(searchParams), [searchParams]);

    const hasAnyQuery = useMemo(() => {
        return (
            (searchParams.get("q") ?? "").trim() ||
            (searchParams.get("title") ?? "").trim() ||
            (searchParams.get("author") ?? "").trim() ||
            (searchParams.get("subject") ?? "").trim() ||
            (searchParams.get("publisher") ?? "").trim() ||
            (searchParams.get("year") ?? "").trim()
        );
    }, [searchParams]);

    useEffect(() => {
        if (!hasAnyQuery) {
            setDocs([]);
            setTotal(0);
            setLoading(false);
            setError("");
            return;
        }
        setLoading(true);
        setError("");
        const controller = new AbortController();

        (async () => {
            try {
                const response = await fetch(apiUrl, {signal: controller.signal});
                if (!response.ok) throw new Error("Fetch failed");

                const data = (await response.json()) as SearchResponse;
                setDocs(data.docs ?? []);
                setTotal(data.numFound ?? 0);
            } catch (e) {
                if ((e as any)?.name !== "AbortError") {
                    setError("Impossible de charger les résultats");
                    setDocs([]);
                    setTotal(0);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [apiUrl, hasAnyQuery]);

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Résultats</h1>
            {!hasAnyQuery && (
                <div style={styles.card}>
                    <div style={styles.muted}>Tape une recherche dans la barre en haut, ou utilise la recherche avancée.</div>
                </div>
            )}
            {hasAnyQuery && !loading && !error && (
                <div style={{ marginBottom: 14 }}>
                    {label && <div style={styles.muted}>{label}</div>}
                    <div style={styles.muted}>{total.toLocaleString()} résultat(s)</div>
                </div>
            )}

            {loading && <div style={styles.card}>Chargement...</div>}
            {error && <div style={styles.card}>{error}</div>}

            {!loading && !error && hasAnyQuery && docs.length === 0 && (
                <div style={styles.card}>Aucun résultat.</div>
            )}

            {!loading && !error && docs.length > 0 && (
                <div style={styles.grid}>
                    {docs.map((doc) => {
                        const author = doc.author_name?.[0] ?? "Auteur inconnu";
                        const id = bookIdFromKey(doc.key);

                        return (
                            <Link key={doc.key} to={`/book/${id}`} style={styles.cardLink}>
                                <div style={styles.resultCard}>
                                    <div style={styles.resultTitle}>{doc.title}</div>
                                    <div style={styles.muted}>{author}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

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
    marginBottom: 12,
  },
  muted: {
    opacity: 0.75,
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
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
  },
  resultCard: {
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    transition: "transform 0.08s",
  },
  resultTitle: {
    fontWeight: 800,
    marginBottom: 6,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};