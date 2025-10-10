import { NextRequest } from "next/server";

const CHATKIT_ENDPOINT = process.env.CHATKIT_SESSION_ENDPOINT;

export async function POST(request: NextRequest) {
  if (!CHATKIT_ENDPOINT) {
    return new Response(
      JSON.stringify({ error: "CHATKIT_SESSION_ENDPOINT env var not set" }),
      { status: 500 }
    );
  }

  const payload = await request.json().catch(() => ({}));

  try {
    const response = await fetch(CHATKIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(text || "Failed to create chat session", { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("/api/chatkit/session", error);
    return new Response(JSON.stringify({ error: "AgentKit service unreachable" }), { status: 502 });
  }
}
