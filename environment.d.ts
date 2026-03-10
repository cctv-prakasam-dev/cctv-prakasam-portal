declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: number;
      DATABASE_URL: string;
      API_VERSION: string;
    }
  }
}
export {};
