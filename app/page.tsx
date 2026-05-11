"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>Corpus Search</h1>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your corpus..."
        style={{ width: "100%", height: 100, padding: 12 }}
      />

      <button onClick={search} disabled={loading || !query}>
        {loading ? "Searching..." : "Search"}
      </button>

      <div style={{ marginTop: 30 }}>
        {results.map((r) => (
          <article
            key={r.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h2>{r.title}</h2>
            <p>
              {r.author} {r.date ? `— ${r.date}` : ""}
            </p>
            <p>{r.text}</p>
            <small>
              Similarity: {Number(r.similarity).toFixed(3)} | Rerank:{" "}
              {Number(r.rerank_score).toFixed(3)}
            </small>
          </article>
        ))}
      </div>
    </main>
  );
}
