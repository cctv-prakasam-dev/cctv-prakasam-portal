import envData from "../env.js";
const isProduction = envData.NODE_ENV === "production";
function formatMessage(level, context, message, meta) {
    if (isProduction) {
        // Structured JSON logging for production
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            context,
            message,
        };
        if (meta) {
            entry.meta = meta;
        }
        return JSON.stringify(entry);
    }
    // Human-readable for development
    const prefix = `[${level.toUpperCase()}] [${context}]`;
    if (meta) {
        return `${prefix} ${message} ${JSON.stringify(meta)}`;
    }
    return `${prefix} ${message}`;
}
function info(context, message, meta) {
    // eslint-disable-next-line no-console
    console.log(formatMessage("info", context, message, meta));
}
function warn(context, message, meta) {
    console.warn(formatMessage("warn", context, message, meta));
}
function error(context, message, meta) {
    console.error(formatMessage("error", context, message, meta));
}
function debug(context, message, meta) {
    if (!isProduction) {
        // eslint-disable-next-line no-console
        console.log(formatMessage("debug", context, message, meta));
    }
}
const logger = { info, warn, error, debug };
export default logger;
