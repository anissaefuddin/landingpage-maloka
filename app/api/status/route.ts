import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ status: "error", message: "Missing url parameter" }, { status: 400 });
  }

  const needsGet = url.includes("script.google.com") || url.includes("googleusercontent.com");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const start = Date.now();

    const res = await fetch(url, {
      method: needsGet ? "GET" : "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - start;

    if (res.ok) {
      return Response.json({
        status: "active",
        code: res.status,
        responseTime,
        checkedAt: new Date().toISOString(),
      });
    }

    // Fallback: retry with GET if HEAD returned non-ok
    if (!needsGet) {
      const ctrl2 = new AbortController();
      const t2 = setTimeout(() => ctrl2.abort(), 10000);
      const s2 = Date.now();
      const res2 = await fetch(url, { method: "GET", signal: ctrl2.signal, redirect: "follow" });
      clearTimeout(t2);
      return Response.json({
        status: res2.ok ? "active" : "inactive",
        code: res2.status,
        responseTime: Date.now() - s2,
        checkedAt: new Date().toISOString(),
      });
    }

    return Response.json({
      status: "inactive",
      code: res.status,
      responseTime,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json({ status: "inactive", code: 0, responseTime: -1, checkedAt: new Date().toISOString() });
  }
}
