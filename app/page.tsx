"use client";

import Link from "next/link";
import { useState } from "react";

type Result = {
  id: string;
  title: string;
  author?: string;
  date?: string;
  source?: string;
  text: string;
  similarity?: number;
  rerank_score?: number;
  explanation?: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [topN, setTopN] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  async function search() {
    setLoading(true);
    setAnswer("");
    setResults([]);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, topN }),
    });

    const data = await res.json();
    setAnswer(data.answer ?? "");
    setResults(data.results ?? []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#1e1b2e]">
      <header className="border-b bg-white px-8 py-5 flex justify-between items-center">
        <div>
          <div className="text-4xl font-serif tracking-wide text-[#8b1025]">EIEC</div>
          <div className="text-sm">Ethnicity and (In)Equality in Early Christianity</div>
        </div>

        <nav className="flex gap-8 text-sm">
          <span className="font-semibold text-[#8b1025]">Search</span>
          <Link href="/methodology">Methodology</Link>
          <a href="https://eiec.info/database" target="_blank" rel="noreferrer">Corpus</a>
          <a href="https://eiec.info" target="_blank" rel="noreferrer">About</a>
        </nav>
      </header>

      <div className="grid grid-cols-[340px_1fr]">
        <aside className="border-r bg-[#fbf7f1] p-8 min-h-screen">
          <h1 className="font-serif text-3xl mb-3">Ask the Corpus</h1>
          <p className="text-sm mb-6 leading-6">
            Search early Christian texts by theme, concept, author, or passage.
          </p>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do early Christian authors say about ethnicity, descent, or equality?"
            className="w-full h-32 rounded-md border p-4 bg-white text-sm"
          />

          <label className="block mt-4 text-sm font-semibold">Number of passages</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full accent-[#8b1025]"
            />
            <span className="w-14 text-right text-sm font-medium text-[#8b1025]">{topN}</span>
          </div>

          <button
            onClick={search}
            disabled={loading || !query}
            className="mt-4 w-full rounded-md bg-[#8b1025] text-white py-3 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button className="text-sm text-[#8b1025]">Clear all</button>
            </div>

            {[
              "Author",
              "Date Range",
              "Text Type / Genre",
              "Language",
              "Region",
              "Theme / Keyword",
            ].map((filter) => (
              <div
                key={filter}
                className="mb-2 rounded-md border bg-white px-4 py-3 text-sm flex justify-between"
              >
                <span>{filter}</span>
                <span>⌄</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-md border bg-white p-4 text-sm leading-6">
            <h3 className="font-semibold mb-2">About this project</h3>
            <p>
              EIEC explores how early Christian authors wrote about ethnicity,
              equality, peoplehood, and difference.
            </p>
          </div>
        </aside>

        <section className="p-8">
          <div className="flex gap-8 border-b mb-6">
            <button className="border-b-2 border-[#8b1025] pb-3 font-semibold">Answer</button>
            <button className="pb-3">
              Passages <span className="ml-1 rounded-full bg-gray-200 px-2">{results.length}</span>
            </button>
            <button className="pb-3">Timeline</button>
          </div>

          <section className="rounded-xl border bg-white p-6 mb-6 shadow-sm">
            <h2 className="font-semibold mb-3">Answer</h2>

            {answer ? (
              <p className="leading-7 whitespace-pre-wrap">{answer}</p>
            ) : (
              <p className="text-gray-500">
                Ask a question to generate an answer grounded in retrieved
                corpus passages.
              </p>
            )}

            <p className="text-xs text-gray-500 mt-6">
              This answer is generated from the passages below. Review the
              original texts before citing.
            </p>
          </section>

          <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="flex justify-between px-5 py-4 border-b">
              <h2 className="font-semibold">Key Passages</h2>
              <button className="text-sm text-[#8b1025]">View all passages →</button>
            </div>

            {results.length === 0 && (
              <div className="p-6 text-gray-500">Retrieved passages will appear here.</div>
            )}

            {results.map((r, index) => (
              <article
                key={r.id}
                onClick={() => setSelectedResult(r)}
                className="grid grid-cols-[320px_1fr_120px] gap-5 border-b p-5 last:border-b-0 cursor-pointer hover:bg-[#faf8f4] transition-colors"
              >
                <div>
                  <div className="flex gap-3">
                    <span className="bg-[#8b1025] text-white rounded px-2 py-1 text-xs h-fit">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm">{r.title}</h3>
                      <p className="text-sm text-gray-600">{r.author}</p>
                      <p className="text-sm text-gray-600">{r.date}</p>
                    </div>
                  </div>
                </div>

                <div>
                  {r.explanation && (
                    <div className="rounded-md bg-[#faf8f4] p-3 text-sm">
                      <strong>Why this passage matters: </strong>
                      {r.explanation}
                    </div>
                  )}
                </div>

                <div className="text-center border-l">
                  <p className="text-xs text-gray-500">Relevance</p>
                  <p className="font-semibold text-lg">
                    {r.rerank_score ? r.rerank_score.toFixed(2) : r.similarity?.toFixed(2)}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>

      {selectedResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] rounded-xl bg-white shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex justify-between items-center border-b bg-white p-6">
              <div>
                <h2 className="font-semibold text-lg">{selectedResult.title}</h2>
                <p className="text-sm text-gray-600">
                  {selectedResult.author}
                  {selectedResult.date && `, ${selectedResult.date}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm leading-7 whitespace-pre-wrap">{selectedResult.text}</p>
              {selectedResult.source && (
                <p className="mt-4 text-xs text-gray-500">Source: {selectedResult.source}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
