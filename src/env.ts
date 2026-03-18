import type { InferOutput, ValiError } from "valibot";

import { flatten, object, parseAsync, pipe, string, transform } from "valibot";

const VEnvSchema = object({
  NODE_ENV: string(),
  API_VERSION: string(),
  PORT: pipe(
    string(),
    transform(val => Number(val)),
  ),
  DB_HOST: string(),
  DB_PORT: pipe(
    string(),
    transform(val => Number(val)),
  ),
  DB_USER: string(),
  DB_PASSWORD: string(),
  DB_NAME: string(),
  JWT_SECRET: pipe(
    string(),
    transform((val) => {
      if (val.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters long");
      }
      return val;
    }),
  ),
  BREVO_API_KEY: string(),
  APP_BASE_URL: string(),
  YOUTUBE_API_KEY: string(),
  YOUTUBE_CHANNEL_ID: string(),
});

export type Env = InferOutput<typeof VEnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let envData: Env;

try {
  // eslint-disable-next-line node/no-process-env
  envData = await parseAsync(VEnvSchema, process.env, {
    abortPipeEarly: true,
  });
}
catch (e) {
  const error = e as ValiError<typeof VEnvSchema>;
  console.error("❌ Invalid Env");
  console.error(flatten(error.issues));
  process.exit(1);
}

export default envData;
