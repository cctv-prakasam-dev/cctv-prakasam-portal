import { flatten, object, optional, parseAsync, pipe, string, transform, } from "valibot";
const VEnvSchema = object({
    NODE_ENV: string(),
    API_VERSION: string(),
    PORT: pipe(string(), transform(val => Number(val))),
    COOKIE_DOMAIN: string(),
    API_BASE_URL: string(),
    APP_BASE_URL: string(),
    DB_HOST: string(),
    DB_PORT: pipe(string(), transform(val => Number(val))),
    DB_USER: string(),
    DB_PASSWORD: string(),
    DB_NAME: string(),
    JWT_SECRET: string(),
    BASELIME_API_KEY: string(),
    RAZOR_PAY_KEY_ID: string(),
    RAZOR_PAY_KEY_SECRET: string(),
    PAYMENT_URL: string(),
    BREVO_API_KEY: string(),
    PDF_API: string(),
    FIREBASE_TYPE: string(),
    FIREBASE_PROJECT_ID: string(),
    FIREBASE_PRIVATE_KEY_ID: string(),
    FIREBASE_PRIVATE_KEY: string(),
    FIREBASE_CLIENT_EMAIL: string(),
    FIREBASE_CLIENT_ID: string(),
    FIREBASE_AUTH_URI: string(),
    FIREBASE_TOKEN_URI: string(),
    FIREBASE_AUTH_PROVIDER_CERT_URL: string(),
    FIREBASE_CLIENT_CERT_URL: string(),
    FIREBASE_UNIVERSE_DOMAIN: string(),
    // oauth
    SCOPE: string(),
    WEB_CLIENT_ID: string(),
    WEB_CLIENT_SECRET: string(),
    WEB_REDIRECT_URL: string(),
    ANDROID_REDIRECT_URL: string(),
    QSTASH_TOKEN: string(),
    CNR_API_URL: string(),
    DRAFT_AGENT_URL: optional(string()),
    ECOURTS_API_KEY: string(),
    LAW_FEED_URL: string(),
    // R2 (Cloudflare) storage
    R2_ACCESS_KEY_ID: string(),
    R2_SECRET_ACCESS_KEY: string(),
    R2_ENDPOINT: string(),
    R2_SOURCE_BUCKET: string(),
    R2_PUBLIC_BUCKET: string(),
    R2_RAG_BUCKET: string(),
    // RAG pipeline
    PDF_SERVICE_URL: string(),
    AUTORAG_API_KEY: string(),
    AUTORAG_ACCOUNT_ID: string(),
    AUTORAG_INSTANCE_ID: string(),
});
// eslint-disable-next-line import/no-mutable-exports
let envData;
try {
    // eslint-disable-next-line node/no-process-env
    envData = await parseAsync(VEnvSchema, process.env, {
        abortPipeEarly: true,
    });
}
catch (e) {
    const error = e;
    console.error("❌ Invalid Env");
    console.error(flatten(error.issues));
    process.exit(1);
}
export default envData;
