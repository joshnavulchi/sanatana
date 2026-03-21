/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
// API route stub to satisfy Next build during static export.
// Original implementation preserved in `app/_api_disabled`.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({}), {
    headers: { "content-type": "application/json" },
  });
}

export async function PUT() {
  return new Response(JSON.stringify({ error: "API disabled for static export" }), { status: 410, headers: { "content-type": "application/json" } });
}

export async function DELETE() {
  return new Response(JSON.stringify({ error: "API disabled for static export" }), { status: 410, headers: { "content-type": "application/json" } });
}

// Provide a minimal set of static params so the exporter can generate a static path.
// Removed generateStaticParams — API is dynamic
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
