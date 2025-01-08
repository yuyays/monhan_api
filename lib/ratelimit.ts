import { Redis } from "https://esm.sh/@upstash/redis";
import type { MiddlewareHandler } from "hono";

export const rateLimit = (
  requests: number = 100,
  window: number = 60
): MiddlewareHandler => {
  const redis = new Redis({
    url: Deno.env.get("UPSTASH_REDIS_REST_URL") ?? "",
    token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN") ?? "",
  });

  return async (c, next) => {
    try {
      const ip = c.req.header("x-forwarded-for") || "unknown";
      const key = `rate-limit:${ip}`;

      if (
        !Deno.env.get("UPSTASH_REDIS_REST_URL") ||
        !Deno.env.get("UPSTASH_REDIS_REST_TOKEN")
      ) {
        console.warn("Redis credentials not configured, skipping rate limit");
        return next();
      }

      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, window);
      }

      if (current > requests) {
        console.log(`Rate limit exceeded: ${c.req.method} ${c.req.path} 429`);
        return c.json(
          {
            error: "Too Many Requests",
            message: `Rate limit exceeded. Try again in ${window} seconds`,
          },
          429
        );
      }
      return next();
    } catch (error) {
      console.error("Rate limit error:", error);
      return next();
    }
  };
};
