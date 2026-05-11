import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { CohereClientV2 } from "cohere-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY!,
});

export async function POST(req: Request) {
  const { query } = await req.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  const { data: candidates, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 30,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const documents = candidates.map((r: any) =>
    `Title: ${r.title ?? ""}
Author: ${r.author ?? ""}
Date: ${r.date ?? ""}
Source: ${r.source ?? ""}
Text: ${r.text ?? ""}`
  );

  const reranked = await cohere.rerank({
    model: "rerank-v3.5",
    query,
    documents,
    topN: 5,
  });

  const results = reranked.results.map((item: any) => {
    const original = candidates[item.index];

    return {
      ...original,
      rerank_score: item.relevanceScore,
    };
  });

  return NextResponse.json({ results });
}