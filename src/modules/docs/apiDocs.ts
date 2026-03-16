const apiDocs = {
  openapi: "3.0.3",
  info: {
    title: "CCTV AP Prakasam Portal API",
    description: "Backend API for the CCTV AP Prakasam news portal — YouTube video management, auth, newsletter, breaking news, and more.",
    version: "1.0.0",
  },
  servers: [
    { url: "/api", description: "API Base" },
  ],
  tags: [
    { name: "Auth", description: "Authentication & user management" },
    { name: "Videos", description: "Public video endpoints" },
    { name: "Categories", description: "Video categories" },
    { name: "Newsletter", description: "Newsletter subscriptions" },
    { name: "Breaking News", description: "Breaking news ticker" },
    { name: "Featured Content", description: "Featured content management" },
    { name: "Contact", description: "Contact form" },
    { name: "Settings", description: "Site settings" },
    { name: "Admin - Videos", description: "Admin video management" },
    { name: "Admin - YouTube", description: "YouTube sync management" },
    { name: "Admin - Dashboard", description: "Admin dashboard stats" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } } },
        responses: { 201: { description: "User registered, auth cookies set" }, 422: { description: "Validation error" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } } },
        responses: { 200: { description: "Login successful, auth cookies set" }, 401: { description: "Invalid credentials" } },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token (reads refresh_token cookie)",
        responses: { 200: { description: "New tokens set as cookies" }, 401: { description: "Invalid or expired refresh token" } },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (clears auth cookies)",
        responses: { 200: { description: "Logged out" } },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset email",
        requestBody: { content: { "application/json": { schema: { properties: { email: { type: "string", format: "email" } }, required: ["email"] } } } },
        responses: { 200: { description: "Always returns success (prevents enumeration)" } },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password with token",
        requestBody: { content: { "application/json": { schema: { properties: { token: { type: "string" }, password: { type: "string", minLength: 8 } }, required: ["token", "password"] } } } },
        responses: { 200: { description: "Password reset" }, 404: { description: "Invalid token" } },
      },
    },
    "/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email with token",
        requestBody: { content: { "application/json": { schema: { properties: { token: { type: "string" } }, required: ["token"] } } } },
        responses: { 200: { description: "Email verified" }, 404: { description: "Invalid token" } },
      },
    },
    "/videos": {
      get: {
        tags: ["Videos"],
        summary: "Get paginated videos",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "page_size", in: "query", schema: { type: "integer", default: 10, maximum: 100 } },
          { name: "category_id", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "Paginated video list" } },
      },
    },
    "/videos/featured": {
      get: { tags: ["Videos"], summary: "Get featured videos", responses: { 200: { description: "Featured video list" } } },
    },
    "/videos/trending": {
      get: { tags: ["Videos"], summary: "Get trending videos", responses: { 200: { description: "Trending video list" } } },
    },
    "/videos/channel-stats": {
      get: { tags: ["Videos"], summary: "Get YouTube channel statistics", responses: { 200: { description: "Channel stats (subscribers, views, video count, years)" } } },
    },
    "/categories": {
      get: { tags: ["Categories"], summary: "Get all categories", responses: { 200: { description: "Category list" } } },
    },
    "/newsletter/subscribe": {
      post: {
        tags: ["Newsletter"],
        summary: "Subscribe to newsletter",
        requestBody: { content: { "application/json": { schema: { properties: { email: { type: "string", format: "email" } }, required: ["email"] } } } },
        responses: { 201: { description: "Subscribed" } },
      },
    },
    "/breaking-news": {
      get: { tags: ["Breaking News"], summary: "Get active breaking news items", responses: { 200: { description: "Breaking news list" } } },
    },
    "/contact": {
      post: {
        tags: ["Contact"],
        summary: "Submit contact form",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ContactInput" } } } },
        responses: { 200: { description: "Message sent" } },
      },
    },
    "/settings": {
      get: { tags: ["Settings"], summary: "Get public site settings", responses: { 200: { description: "Settings list" } } },
    },
    "/admin/videos": {
      get: {
        tags: ["Admin - Videos"],
        summary: "Get paginated videos (admin)",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "Paginated video list" }, 401: { description: "Unauthorized" } },
      },
    },
    "/admin/youtube/sync": {
      post: {
        tags: ["Admin - YouTube"],
        summary: "Trigger YouTube video sync (non-blocking)",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "Sync started in background" } },
      },
    },
    "/admin/youtube/sync-status": {
      get: {
        tags: ["Admin - YouTube"],
        summary: "Get current sync status",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "Sync status with last result" } },
      },
    },
    "/admin/dashboard/stats": {
      get: {
        tags: ["Admin - Dashboard"],
        summary: "Get dashboard statistics",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "Dashboard stats (videos, users, subscribers, etc.)" } },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
        description: "httpOnly cookie set on login/register",
      },
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["first_name", "last_name", "email", "password"],
        properties: {
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      ContactInput: {
        type: "object",
        required: ["name", "email", "message"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          message: { type: "string" },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          status: { type: "integer" },
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
    },
  },
};

export default apiDocs;
