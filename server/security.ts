import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;
const requestBuckets = new Map<string, { startedAt: number; count: number }>();

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
}

export function apiRateLimit(req: Request, res: Response, next: NextFunction) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip || "unknown";
  const now = Date.now();
  const current = requestBuckets.get(ip);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestBuckets.set(ip, { startedAt: now, count: 1 });
    return next();
  }
  current.count += 1;
  if (current.count > MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ error: "Too many requests. Please try again shortly." });
    return;
  }
  next();
}

export function resetRateLimitBucketsForTests() {
  requestBuckets.clear();
}
