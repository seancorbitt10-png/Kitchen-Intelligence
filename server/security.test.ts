import { describe, expect, it, beforeEach } from "vitest";
import { apiRateLimit, resetRateLimitBucketsForTests, securityHeaders } from "./security";

function response() {
  const headers = new Map<string, string>();
  return { headers, setHeader(name: string, value: string) { headers.set(name, value); }, statusCode: 200, status(code: number) { this.statusCode = code; return this; }, json() { return this; } } as any;
}

describe("production security boundaries", () => {
  beforeEach(() => resetRateLimitBucketsForTests());

  it("sets defensive response headers", () => {
    const res = response();
    securityHeaders({} as any, res, () => undefined);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("limits bursts from one forwarded client address", () => {
    const req = { headers: { "x-forwarded-for": "198.51.100.25" }, ip: "127.0.0.1" } as any;
    let allowed = 0;
    for (let index = 0; index < 120; index += 1) apiRateLimit(req, response(), () => { allowed += 1; });
    const blocked = response();
    apiRateLimit(req, blocked, () => { allowed += 1; });
    expect(allowed).toBe(120);
    expect(blocked.statusCode).toBe(429);
  });
});
