import Link from "next/link";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#1e1b2e]">
      <header className="border-b bg-white px-8 py-5 flex justify-between items-center">
        <div>
          <div className="text-4xl font-serif tracking-wide text-[#8b1025]">EIEC</div>
          <div className="text-sm">Ethnicity and (In)Equality in Early Christianity</div>
        </div>

        <nav className="flex gap-8 text-sm">
          <Link href="/">Search</Link>
          <span className="font-semibold text-[#8b1025]">Methodology</span>
          <a href="https://eiec.info/database" target="_blank" rel="noreferrer">Corpus</a>
          <a href="https://eiec.info" target="_blank" rel="noreferrer">About</a>
        </nav>
      </header>

      <div className="grid grid-cols-[340px_1fr]">
        <aside className="border-r bg-[#fbf7f1] p-8 min-h-screen">
          <h1 className="font-serif text-3xl mb-3">Methodology</h1>
          <p className="text-sm mb-6 leading-6">
            Learn how the search flow retrieves and generates evidence-based answers from the corpus.
          </p>

          <div className="mt-8 border-t pt-6 space-y-4 text-sm text-[#4f4a4a]">
            <div className="rounded-md border bg-white px-4 py-3">
              <p className="font-semibold">Data sources</p>
              <p className="mt-2 text-xs text-[#6d6666]">Early Christian texts and metadata drawn from the research corpus.</p>
            </div>
            <div className="rounded-md border bg-white px-4 py-3">
              <p className="font-semibold">Search design</p>
              <p className="mt-2 text-xs text-[#6d6666]">Queries are encoded as embeddings and compared with corpus passages for semantic matching.</p>
            </div>
            <div className="rounded-md border bg-white px-4 py-3">
              <p className="font-semibold">Answer safety</p>
              <p className="mt-2 text-xs text-[#6d6666]">Generated answers are grounded in retrieved passages and cite supporting evidence.</p>
            </div>
          </div>

          <div className="mt-8 rounded-md border bg-white p-4 text-sm leading-6">
            <h3 className="font-semibold mb-2">About EIEC</h3>
            <p>
              EIEC explores how early Christian authors wrote about ethnicity, equality, peoplehood, and difference.
            </p>
          </div>
        </aside>

        <section className="p-8">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8b1025]">How it works</p>
                <h2 className="mt-3 text-3xl font-serif text-[#1e1b2e]">From query to grounded answer</h2>
              </div>
              <Link
                href="/"
                className="rounded-full border border-[#8b1025] bg-[#f9f5f1] px-5 py-3 text-sm font-semibold text-[#8b1025] transition hover:bg-[#f0e6e0]"
              >
                Back to search
              </Link>
            </div>

            <div className="mt-8 space-y-8 text-[#4f4a4a]">
              <section className="rounded-3xl border border-[#ede7e0] bg-[#fbf7f1] p-6">
                <h3 className="text-xl font-semibold text-[#1e1b2e]">1. Query understanding</h3>
                <p className="mt-3 leading-7">
                  The system converts the user query into a semantic embedding so it can match meaning rather than only exact words.
                </p>
              </section>

              <section className="rounded-3xl border border-[#ede7e0] bg-[#fbf7f1] p-6">
                <h3 className="text-xl font-semibold text-[#1e1b2e]">2. Corpus retrieval</h3>
                <p className="mt-3 leading-7">
                  The query embedding is compared with the corpus using a vector search. The top passages are retrieved by semantic similarity.
                </p>
              </section>

              <section className="rounded-3xl border border-[#ede7e0] bg-[#fbf7f1] p-6">
                <h3 className="text-xl font-semibold text-[#1e1b2e]">3. Passage reranking</h3>
                <p className="mt-3 leading-7">
                  Retrieved passages are reranked with a relevance model to surface the most scholarly and contextually useful results.
                </p>
              </section>

              <section className="rounded-3xl border border-[#ede7e0] bg-[#fbf7f1] p-6">
                <h3 className="text-xl font-semibold text-[#1e1b2e]">4. Evidence-based answer generation</h3>
                <p className="mt-3 leading-7">
                  The final answer is generated from the top passages only. This keeps the response grounded in the source material and reduces hallucination.
                </p>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
