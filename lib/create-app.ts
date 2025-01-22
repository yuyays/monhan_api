import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serveStatic } from "hono/deno";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import { PinoLogger } from "npm:hono-pino";
import { pino_Logger } from "../middlewares/pino_logger.ts";

import { rateLimit } from "./ratelimit.ts";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(pino_Logger());
  app.use("*", rateLimit(100, 60));
  app.use("/static/*", serveStatic({ root: "./" }));
  app.use(
    "/*",
    cors({
      origin: ["http://localhost:3000", "https://monhan-api.deno.dev"],
      allowMethods: ["GET"],
    })
  );
  app.get(
    "*",
    cache({
      cacheName: "monhan_api",
      cacheControl: "max-age=3600",
      wait: true,
    })
  );

  app.get("/favicon.ico", (c) => c.body(null));
  //  app.openapi(getQuestByIdRoute, setupQuestsRoutes);

  app.doc("/api/docs", {
    openapi: "3.0.0",
    info: {
      title: "Monster Hunter API",
      version: "0.0.1",
      description: "API for accessing Monster Hunter monster data",
    },
    servers: [
      {
        url: "https://monhan-api.deno.dev",
        description: "Production server",
      },
    ],
  });

  app.get(
    "/ui",
    swaggerUI({
      url: "/doc",
    })
  );

  app.doc("/doc", {
    info: {
      title: "Monster Hunter API",
      version: "v0.01",
    },
    openapi: "3.1.0",
  });

  app.get("/", (c) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Monster Hunter API</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              line-height: 1.6;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .endpoint {
              background: #f8f9fa;
              padding: 1rem;
              margin: 1rem 0;
              border-radius: 4px;
              font-family: monospace;
            }
            code {
              background: #e9ecef;
              padding: 0.2rem 0.4rem;
              border-radius: 4px;
            }
          .api-link {
          color: #2563eb;
          text-decoration: none;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          background: #e9ecef;
        }
        .api-link:hover {
          background: #dee2e6;
          text-decoration: underline;
        }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Monster Hunter API</h1>
            <p>This API provides comprehensive data about monsters, quests, and endemic life from the Monster Hunter game series.</p>
            
            <h2>Quick Start</h2>
            <p>Access our interactive API documentation at: <a href="https://monhan-api.deno.dev/ui">https://monhan-api.deno.dev/ui</a></p>

            
            <h2>Key Features</h2>
            <ul>
              <li>Detailed monster information including types, elements, and weaknesses</li>
              <li>Quest data with objectives and requirements</li>
              <li>Endemic life details across different games</li>
              <li>Pagination support for large data sets</li>
            </ul>
  
            <h2>Example Endpoints</h2>
            <div class="endpoint">GET api/monsters/filter?elements=fire,water&elements_operator=or&weakness_operator=and&weakness=ice,thunder,fire
                - Get a list of all monsters with element with (fire OR water) AND weakness with (ice And thunder And fire)</div>
            <div class="endpoint">GET /api/monsters?limit=10&offset=20 - Get a list of all monsters with limit and offset with following value</div>
            
            <div class="endpoint">GET /api/quests - Get a list of all quests</div>
            
            <h2>Rate Limiting</h2>
            <p>Please note that this API is rate-limited to ensure fair usage. Each IP is limited to 100 requests per minute.</p>
            
            <h2>Data Source</h2>
            <p>All data is sourced from <a href="https://github.com/CrimsonNynja/monster-hunter-DB"> https://github.com/CrimsonNynja/monster-hunter-DB </a> Thanks for providing data
          </div>
        </body>
      </html>
    `;

    return c.html(html);
  });

  app.onError((err, c) => {
    console.error(`${err}`);
    return c.json(
      {
        error: "Internal Server Error",
        message: err.message,
      },
      500
    );
  });

  app.notFound((c) => {
    return c.json(
      {
        error: "Not Found",
        message: "The requested endpoint does not exist",
        path: c.req.path,
      },
      404
    );
  });

  return app;
}
