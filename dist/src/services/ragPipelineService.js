import { Buffer } from "node:buffer";
import path from "node:path";
import { r2Config } from "../config/r2Config.js";
import envData from "../env.js";
import R2FileService from "./r2/r2FileService.js";
const PDF_SERVICE_URL = envData.PDF_SERVICE_URL || "https://v2-an-pdf-service.up.railway.app/v1.0";
/**
 * Triggers the file conversion + chunking pipeline via api-pdf-service.com.
 * After upload completes, this sends the file to be chunked and sets up
 * a webhook to receive the chunk URLs.
 */
export async function triggerChunkingPipeline(fileKey, fileName, webhookUrl) {
    try {
        const r2Source = new R2FileService();
        const { download_url } = await r2Source.generateDownloadPresignedUrl(fileKey, 86400); // 24hr expiry for async queue processing
        if (!download_url) {
            throw new Error("Failed to generate download URL for chunking");
        }
        const requestBody = {
            file_id: fileKey,
            file_name: fileName,
            file_download_url: download_url,
            webhook_url: webhookUrl,
        };
        const response = await fetch(`${PDF_SERVICE_URL}/files/chunk-process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Chunking pipeline failed: ${response.status} - ${errorText}`);
            return { success: false, message: `Chunking failed: ${response.status}` };
        }
        console.info(`[RAG_PIPELINE] Triggered chunking for ${fileKey}`);
        return { success: true, message: "Chunking pipeline triggered" };
    }
    catch (error) {
        console.error(`[RAG_PIPELINE] Error triggering chunking for ${fileKey}:`, error.message);
        return { success: false, message: error.message };
    }
}
/**
 * Handles the webhook callback from api-pdf-service.com with chunk URLs.
 * Downloads each chunk and uploads it to the RAG bucket.
 */
export async function processChunksToRagBucket(fileKey, chunks) {
    const ragBucketService = new R2FileService(r2Config.rag_bucket);
    const uploadedKeys = [];
    try {
        const sortedChunks = chunks.sort((a, b) => a.chunk_index - b.chunk_index);
        for (const chunk of sortedChunks) {
            if (!chunk.chunk_url) {
                console.warn(`[RAG_PIPELINE] Missing URL for chunk ${chunk.chunk_index}`);
                continue;
            }
            const res = await fetch(chunk.chunk_url);
            if (!res.ok) {
                console.error(`[RAG_PIPELINE] Failed to download chunk ${chunk.chunk_index}: ${res.status}`);
                continue;
            }
            const buffer = Buffer.from(await res.arrayBuffer());
            // Build chunk key preserving case folder structure
            // fileKey is like: b2c/cases/{tempId}/{docType}/filename.pdf
            // chunk key: b2c/cases/{tempId}/{docType}/filename/{index}_filename.pdf
            const dir = path.dirname(fileKey);
            const baseName = path.basename(fileKey);
            const baseNameNoExt = path.parse(baseName).name;
            const chunkKey = `${dir}/${baseNameNoExt}/${chunk.chunk_index}_${baseName}`;
            await ragBucketService.putObject(chunkKey, buffer, "application/pdf");
            uploadedKeys.push(chunkKey);
        }
        console.info(`[RAG_PIPELINE] Uploaded ${uploadedKeys.length} chunks to RAG bucket for ${fileKey}`);
        return { success: true, uploadedKeys };
    }
    catch (error) {
        console.error(`[RAG_PIPELINE] Error processing chunks for ${fileKey}:`, error.message);
        return { success: false, uploadedKeys };
    }
}
/**
 * Triggers Cloudflare AutoRAG sync to re-index the RAG bucket.
 */
export async function triggerAutoRagSync() {
    const accountId = envData.AUTORAG_ACCOUNT_ID;
    const ragName = "dev-rag-nt-2";
    const apiKey = envData.AUTORAG_API_KEY;
    if (!accountId || !apiKey) {
        console.warn("[RAG_PIPELINE] AutoRAG config missing, skipping sync");
        return { success: false };
    }
    try {
        const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai-search/instances/${ragName}/jobs`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
        });
        if (!response.ok) {
            const errorJson = await response.json().catch(() => ({}));
            // Cooldown is normal — sync was already triggered recently
            if (errorJson.errors?.some((e) => e.code === 7020 || e.message?.includes("cooldown"))) {
                console.info("[RAG_PIPELINE] AutoRAG sync in cooldown — skipping");
                return { success: true };
            }
            console.error("[RAG_PIPELINE] AutoRAG sync failed:", response.status);
            return { success: false };
        }
        const json = await response.json();
        const jobId = json?.result?.id;
        console.info(`[RAG_PIPELINE] AutoRAG sync triggered, job_id: ${jobId}`);
        return { success: true, jobId };
    }
    catch (error) {
        console.error("[RAG_PIPELINE] Error triggering AutoRAG sync:", error.message);
        return { success: false };
    }
}
