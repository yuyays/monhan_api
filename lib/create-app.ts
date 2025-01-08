import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "hono/deno";
import { PinoLogger } from "npm:hono-pino";
import { pino_Logger } from "../middlewares/pino_logger.ts";
import { swaggerUI } from "@hono/swagger-ui";

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
  app.use("/static/*", serveStatic({ root: "./" }));
  // app.use("*", cors());
  // app.get(
  //   "*",
  //   cache({
  //     cacheName: "monhan_api",
  //     cacheControl: "max-age=3600",
  //     wait: true,
  //   })
  // );

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

  app.get("/", (c) =>
    c.text(
      "Welcome to Monster Hunter API. Check out https://monhan-api.deno.dev/ui for api endpoint"
    )
  );

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
