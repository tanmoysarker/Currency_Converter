import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const appId = process.env.OXR_APP_ID;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "latest"; 
  const date = searchParams.get("date");

  try {
    let url: string;
    if (type === "historical" && date) {
      url = `https://openexchangerates.org/api/historical/${date}.json?app_id=${appId}`;
    } else {
      url = `https://openexchangerates.org/api/latest.json?app_id=${appId}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch from Open Exchange Rates");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
