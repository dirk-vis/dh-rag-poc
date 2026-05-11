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
  const { query, topN = 5 } = await req.json();
  const safeTopN = Math.min(Math.max(Number(topN), 1), 20);

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
    match_count: Math.max(30, safeTopN * 5),
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
    topN: safeTopN,
  });

  const results = reranked.results.map((item: any) => {
    const original = candidates[item.index];

    return {
      ...original,
      rerank_score: item.relevanceScore,
    };
  });

  const answerPassages = results.slice(0, Math.min(8, safeTopN));

  const explanationPrompt = results
    .map(
      (r: any, i: number) => `
[${i}]
Title: ${r.title ?? ""}
Author: ${r.author ?? ""}
Date: ${r.date ?? ""}
Source: ${r.source ?? ""}
Text: ${r.text ?? ""}
`
    )
    .join("\n\n");

  const explanationResponse = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You explain why retrieved corpus passages are relevant to a user's question.

For each passage, write one concise sentence.
Use only the passage itself.
Do not overstate relevance.
If relevance is weak, say so.
Return valid JSON only.
      `,
      },
      {
        role: "user",
        content: `
Question:
${query}

Passages:
${explanationPrompt}

Return JSON in this format:
[
  {"index": 0, "explanation": "..."},
  {"index": 1, "explanation": "..."}
]
      `,
      },
    ],
  });

  let explanations: any[] = [];

  try {
    explanations = JSON.parse(explanationResponse.choices[0].message.content ?? "[]");
  } catch {
    explanations = [];
  }

  const resultsWithExplanations = results.map((result: any, index: number) => {
    const match = explanations.find((e: any) => e.index === index);

    return {
      ...result,
      explanation: match?.explanation ?? "",
    };
  });

  const context = answerPassages
    .map(
      (r: any, i: number) => `
[${i + 1}]
Title: ${r.title ?? ""}
Author: ${r.author ?? ""}
Date: ${r.date ?? ""}
Source: ${r.source ?? ""}
Text: ${r.text ?? ""}
`
    )
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are a scholarly research assistant for a digital humanities corpus.

Answer the user's question using only the provided passages.
Do not invent sources.
If the passages are insufficient, say so clearly.
Cite passages using bracket numbers like [1], [2], [3].
Keep the answer concise and evidence-based.
      `,
      },
      {
        role: "user",
        content: `
Question:
${query}

Passages:
${context}
      `,
      },
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0].message.content,
    results: resultsWithExplanations,
  });
}