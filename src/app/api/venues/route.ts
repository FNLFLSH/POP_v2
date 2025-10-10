import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

type VenueRecord = {
  id: string;
  address: string;
  geocode?: unknown;
  footprint?: unknown;
  created_at: string;
  source: "supabase" | "memory";
};

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_VENUE_TABLE || "venues";

const memoryStore: VenueRecord[] = [];

export async function GET() {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "return=representation",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ data, source: "supabase" });
    } catch (error) {
      console.error("[venues] GET fallback memory store. Reason:", error);
    }
  }

  return NextResponse.json({ data: memoryStore, source: "memory" });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const address = typeof payload?.address === "string" ? payload.address : "";

  if (!address) {
    return NextResponse.json(
      { error: "Address is required." },
      { status: 400 },
    );
  }

  const record: VenueRecord = {
    id: payload?.id || uuid(),
    address,
    geocode: payload?.geocode,
    footprint: payload?.footprint,
    created_at: new Date().toISOString(),
    source: SUPABASE_URL && SUPABASE_KEY ? "supabase" : "memory",
  };

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          id: record.id,
          address: record.address,
          geocode: record.geocode,
          footprint: record.footprint,
          created_at: record.created_at,
        }),
      });

      if (!response.ok) {
        throw new Error(`Supabase insert failed with status ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ data, source: "supabase" }, { status: 201 });
    } catch (error) {
      console.error("[venues] POST fallback memory store. Reason:", error);
    }
  }

  memoryStore.unshift(record);

  return NextResponse.json({ data: record, source: "memory" }, { status: 201 });
}
