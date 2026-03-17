import type { Context } from "hono";

import { createMiddleware } from "hono/factory";

const securityHeaders = createMiddleware(async (c: Context, next) => {
  await next();

  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' https://img.youtube.com https://i.ytimg.com data:; frame-src https://www.youtube.com https://www.openstreetmap.org; connect-src 'self'; font-src 'self'",
  );
});

export default securityHeaders;
