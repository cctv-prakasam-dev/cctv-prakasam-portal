import { Client } from "@upstash/qstash";
import { appConfig } from "../config/appConfig.js";
import BadRequestException from "../exceptions/badRequestException.js";
export class QstashSDKService {
    client;
    static instance;
    static getInstance() {
        if (!QstashSDKService.instance) {
            QstashSDKService.instance = new QstashSDKService();
        }
        return QstashSDKService.instance;
    }
    constructor() {
        this.client = new Client({ token: appConfig.QSTASH_TOKEN });
    }
    async sendBatchedDataToQueue(batchedData) {
        try {
            const res = await this.client.batchJSON(batchedData);
            if (res && res.length > 0) {
                return {
                    success: true,
                    message: ">>> Data sent to queue successfully :white_check_mark:",
                };
            }
            throw new BadRequestException("Data not sent to queue successfully :x:");
        }
        catch (error) {
            console.error("Error sending data to queue:", error);
            throw error;
        }
    }
    async sendDataToQueue(queueName, url, body) {
        const queue = this.client.queue({
            queueName,
        });
        const res = await queue.enqueueJSON({
            url,
            body,
            retries: 3,
        });
        if (res) {
            return {
                success: true,
                message: ">>> Data sent to Enqueue successfully :white_check_mark:",
            };
        }
        throw new BadRequestException("Data not sent to queue successfully :x:");
    }
    async createScheduledJob(url) {
        const response = await this.client.schedules.create({
            destination: url,
            cron: "0 4 * * *",
        });
        if (response) {
            return {
                success: true,
                data: response,
                cronJobId: response.scheduleId,
                message: ">>> Scheduled job created successfully :white_check_mark:",
            };
        }
        throw new BadRequestException("Scheduled job not created successfully :x:");
    }
    async deleteScheduledJob(cronJobId) {
        await this.client.schedules.delete(cronJobId);
        return {
            success: true,
            message: ">>> Scheduled job deleted successfully :white_check_mark:",
        };
    }
}
export const qstashSDKObj = QstashSDKService.getInstance();
