import { Hono } from "hono";

import apiDocs from "./apiDocs.js";

const docsRoutes = new Hono();

// Serve OpenAPI JSON spec
docsRoutes.get("/openapi.json", (c) => {
  return c.json(apiDocs);
});

// Serve Swagger UI HTML
docsRoutes.get("/", (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CCTV AP Prakasam Portal — API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: "/api/docs/openapi.json", dom_id: "#swagger-ui" });
  </script>
</body>
</html>`;
  return c.html(html);
});

export default docsRoutes;
