import admin from "firebase-admin";
import { fcmConfig } from "../../config/fireBaseConfig.js";
import { device_tokens } from "../../db/schema/deviceTokens.js";
import { getSingleRecordByMultipleColumnValues, updateRecordById } from "../db/baseDbService.js";
const serviceAccount = {
    type: fcmConfig.type,
    project_id: fcmConfig.project_id,
    private_key_id: fcmConfig.private_key_id,
    private_key: fcmConfig.private_key,
    client_email: fcmConfig.client_email,
    client_id: fcmConfig.client_id,
    auth_uri: fcmConfig.auth_uri,
    token_uri: fcmConfig.token_uri,
    auth_provider_x509_cert_url: fcmConfig.auth_provider_x509_cert_url,
    client_x509_cert_url: fcmConfig.client_x509_cert_url,
    universe_domain: fcmConfig.universe_domain,
};
// Initialize two Firebase apps
const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }, "mobile");
async function sendNotificationForADevice({ token, title, body, caseId, userId, deviceType, tempCaseId, caseRefId, caseStage, caseSubStage, userType, serviceType, notificationMessage, }) {
    try {
        const dataPayload = {
            push_title: title,
            push_body: body,
            case_id: String(caseId),
            temp_id: tempCaseId ?? "",
            case_ref_id: caseRefId ?? "",
            case_stage: caseStage ?? "",
            case_sub_stage: caseSubStage ?? "",
            user_type: userType ?? "",
            service_type: serviceType ?? "",
            notification_message: notificationMessage ?? "",
        };
        const message = deviceType === "mobile"
            ? {
                notification: { title, body },
                data: dataPayload,
                token,
            }
            : {
                data: dataPayload,
                token,
            };
        const response = await app.messaging().send(message);
        return response;
    }
    catch (error) {
        if (error?.errorInfo?.code === "messaging/registration-token-not-registered") {
            try {
                const tokenRecord = await getSingleRecordByMultipleColumnValues(device_tokens, ["device_token", "user_id"], [token, userId], ["eq", "eq"]);
                if (tokenRecord) {
                    await updateRecordById(device_tokens, tokenRecord.id, {
                        active: false,
                    });
                }
            }
            catch (dbError) {
                console.error("db", dbError);
            }
        }
        console.error("catch-error-in-single-message-sending", error);
        throw error;
    }
}
async function sendNotificationsForMultipleDevices({ tokens, title, body, caseId, userId, deviceType, tempCaseId, caseRefId, caseStage, caseSubStage, userType, serviceType, notificationMessage, }) {
    try {
        const dataPayload = {
            push_title: title,
            push_body: body,
            case_id: String(caseId),
            temp_id: tempCaseId ?? "",
            case_ref_id: caseRefId ?? "",
            case_stage: caseStage ?? "",
            case_sub_stage: caseSubStage ?? "",
            user_type: userType ?? "",
            service_type: serviceType ?? "",
            notification_message: notificationMessage ?? "",
        };
        const message = deviceType === "mobile"
            ? {
                notification: { title, body },
                data: dataPayload,
                tokens,
            }
            : {
                data: dataPayload,
                tokens,
            };
        const response = await app.messaging().sendEachForMulticast(message);
        // Collect promises for marking invalid tokens
        const invalidTokenUpdatePromises = [];
        for (let i = 0; i < response.responses.length; i++) {
            const resp = response.responses[i];
            const token = tokens[i];
            if (!resp.success && resp.error?.code === "messaging/registration-token-not-registered") {
                // Push async DB update into promise array
                const promise = (async () => {
                    try {
                        const tokenRecord = await getSingleRecordByMultipleColumnValues(device_tokens, ["device_token", "user_id"], [token, userId], ["eq", "eq"]);
                        if (tokenRecord) {
                            await updateRecordById(device_tokens, tokenRecord.id, { active: false });
                        }
                    }
                    catch (dbError) {
                        console.error("db-error-in-multiple-message-sending", dbError);
                    }
                })();
                invalidTokenUpdatePromises.push(promise);
            }
        }
        // Run all DB updates in parallel
        await Promise.all(invalidTokenUpdatePromises);
        return response;
    }
    catch (error) {
        console.error("catch-error-in-multiple-message-sending", error);
        throw error;
    }
}
export { sendNotificationForADevice, sendNotificationsForMultipleDevices };
