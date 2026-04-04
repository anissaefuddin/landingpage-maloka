import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ status: "error", message: "Missing url parameter" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    return Response.json({
      status: res.ok ? "active" : "inactive",
      code: res.status,
    });
  } catch {
    return Response.json({ status: "inactive", code: 0 });
  }
}
