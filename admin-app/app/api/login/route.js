import { NextResponse } from "next/server";
import { checkPassword } from "../../../lib/store";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!checkPassword(body.password || "")) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
