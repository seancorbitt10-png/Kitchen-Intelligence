import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { apiRateLimit, securityHeaders } from "../security";
import { reportOperationalEvent, sanitizeError } from "../operations";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));
  app.get("/healthz", (_req, res) => res.status(200).json({ ok: true, service: "kitchen-intelligence" }));
  app.get("/readyz", (_req, res) => {
    const ready = Boolean(process.env.DATABASE_URL && process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY);
    res.status(ready ? 200 : 503).json({ ready, billingConfigured: false });
  });
  app.use("/api/oauth", apiRateLimit);
  app.use("/manus-storage", apiRateLimit);
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use("/api/trpc", apiRateLimit);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(error);
    void reportOperationalEvent({ name: "unhandled_server_error", error });
    res.status(500).json({ error: "Internal server error", detail: process.env.NODE_ENV === "production" ? undefined : sanitizeError(error) });
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
