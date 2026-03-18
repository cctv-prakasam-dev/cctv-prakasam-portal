const EXTERNAL_TIMEOUT_MS = 15_000;
const API_KEY_REGEX = /key=[^&]+/;
export async function httpGet(url, headers) {
    const response = await fetch(url, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
    });
    if (!response.ok) {
        const safeUrl = url.replace(API_KEY_REGEX, "key=***");
        throw new Error(`HTTP GET ${safeUrl} failed with status ${response.status}`);
    }
    return await response.json();
}
export async function httpPost(url, body, customHeaders) {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...customHeaders,
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
    });
    if (!response.ok) {
        throw new Error(`HTTP POST ${url} failed with status ${response.status}`);
    }
    return response;
}
export async function httpPatch(url, body, customHeaders) {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...customHeaders,
    };
    const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
    });
    if (!response.ok) {
        throw new Error(`HTTP PATCH ${url} failed with status ${response.status}`);
    }
    return response;
}
