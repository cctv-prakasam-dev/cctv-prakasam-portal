import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, GetObjectCommand, ListPartsCommand, PutObjectCommand, S3Client, S3ServiceException, UploadPartCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Config } from "../../config/r2Config.js";
import S3ErrorException from "../../exceptions/s3ErrorException.js";
class R2FileService {
    s3Client;
    bucket;
    constructor(bucket) {
        this.bucket = bucket || r2Config.source_bucket;
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: r2Config.access_key_id,
                secretAccessKey: r2Config.secret_access_key,
            },
            region: r2Config.region,
            endpoint: r2Config.endpoint,
        });
    }
    generateUploadPresignedUrl = async (fileKey, fileType, metadata) => {
        const params = {
            Bucket: this.bucket,
            Key: fileKey,
            ContentType: fileType,
        };
        if (metadata) {
            params.Metadata = metadata;
        }
        const command = new PutObjectCommand(params);
        const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600,
        });
        return { target_url: presignedUrl, file_key: fileKey };
    };
    generateDownloadPresignedUrl = async (fileKey, expiresIn = 3600) => {
        const params = {
            Bucket: this.bucket,
            Key: fileKey,
        };
        const command = new GetObjectCommand(params);
        const downloadUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn,
        });
        return { download_url: downloadUrl };
    };
    initializeMultipartUpload = async (fileKey, fileType, metadata) => {
        try {
            const params = {
                Bucket: this.bucket,
                Key: fileKey,
                ContentType: fileType,
            };
            if (metadata) {
                params.Metadata = metadata;
            }
            const command = new CreateMultipartUploadCommand(params);
            const response = await this.s3Client.send(command);
            return response;
        }
        catch (error) {
            if (error instanceof S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new S3ErrorException(statusCode, error.message, error);
            }
            throw error;
        }
    };
    async multipartPresignedUrl(fileKey, parts, uploadId) {
        try {
            const urls = [];
            for (let i = 0; i < parts; i++) {
                const baseParams = {
                    Bucket: this.bucket,
                    Key: fileKey,
                    UploadId: uploadId,
                    PartNumber: i + 1,
                };
                const presignCommand = new UploadPartCommand(baseParams);
                urls.push(await getSignedUrl(this.s3Client, presignCommand, { expiresIn: 3600 }));
            }
            return await Promise.all(urls);
        }
        catch (error) {
            if (error instanceof S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new S3ErrorException(statusCode, error.message, error);
            }
            throw error;
        }
    }
    async completeMultipartUpload(fileKey, uploadId, uploadedParts) {
        try {
            const input = {
                Bucket: this.bucket,
                Key: fileKey,
                UploadId: uploadId,
                MultipartUpload: { Parts: uploadedParts },
            };
            const command = new CompleteMultipartUploadCommand(input);
            return await this.s3Client.send(command);
        }
        catch (error) {
            if (error instanceof S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new S3ErrorException(statusCode, error.message, error);
            }
            throw error;
        }
    }
    async abortMultipartUpload(fileKey, uploadId) {
        try {
            const input = {
                Bucket: this.bucket,
                Key: fileKey,
                UploadId: uploadId,
            };
            const command = new AbortMultipartUploadCommand(input);
            return await this.s3Client.send(command);
        }
        catch (error) {
            if (error instanceof S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new S3ErrorException(statusCode, error.message, error);
            }
            throw error;
        }
    }
    async listIncompleteParts(fileKey, uploadId, totalParts) {
        try {
            const input = {
                Bucket: this.bucket,
                Key: fileKey,
                UploadId: uploadId,
            };
            const command = new ListPartsCommand(input);
            const listPartsResponse = await this.s3Client.send(command);
            const uploadedPartNumbers = new Set(listPartsResponse.Parts?.map((part) => part.PartNumber));
            const incompleteParts = [];
            for (let i = 1; i <= totalParts; i++) {
                if (!uploadedPartNumbers.has(i)) {
                    incompleteParts.push(i);
                }
            }
            return incompleteParts;
        }
        catch (error) {
            if (error instanceof S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new S3ErrorException(statusCode, error.message, error);
            }
            throw error;
        }
    }
    getPresignedUrl = async (fileKey, options = {}) => {
        const { method = "put", contentType } = options;
        const params = {
            Bucket: this.bucket,
            Key: fileKey,
        };
        if (method === "put") {
            params.ContentType = contentType;
        }
        const command = method === "put"
            ? new PutObjectCommand(params)
            : new GetObjectCommand(params);
        const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600,
        });
        return { target_url: presignedUrl, file_key: fileKey };
    };
    async putObject(key, body, contentType) {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            });
            return await this.s3Client.send(command);
        }
        catch (error) {
            if (error instanceof S3ServiceException) {
                const statusCode = error.$metadata.httpStatusCode;
                throw new S3ErrorException(statusCode, error.message, error);
            }
            throw error;
        }
    }
    async uploadFile(key, fileContent) {
        return this.putObject(key, fileContent);
    }
    async getPreSignedUrl(fileName, type = "put") {
        const params = {
            Bucket: this.bucket,
            Key: fileName,
        };
        const command = type === "put"
            ? new PutObjectCommand(params)
            : new GetObjectCommand(params);
        const signedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600,
        });
        return { download_url: signedUrl };
    }
}
export default R2FileService;
