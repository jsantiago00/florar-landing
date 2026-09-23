import { NextResponse } from "next/server";
import { getData, setData, checkPassword } from "../../../lib/store";

function withCors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-password");
  return res;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  const data = await getData();
  return withCors(NextResponse.json(data));
}

export async function PUT(request) {
  const password = request.headers.get("x-admin-password") || "";
  if (!checkPassword(password)) {
    return withCors(NextResponse.json({ error: "No autorizado" }, { status: 401 }));
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return withCors(NextResponse.json({ error: "JSON inválido" }, { status: 400 }));
  }

  if (!body || typeof body !== "object" || !body.profile || !Array.isArray(body.items)) {
    return withCors(NextResponse.json({ error: "Datos inválidos" }, { status: 400 }));
  }

  await setData(body);
  return withCors(NextResponse.json({ ok: true }));
}
