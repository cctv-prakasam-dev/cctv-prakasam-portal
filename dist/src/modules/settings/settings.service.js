import { SETTING_NOT_FOUND } from "../../constants/appMessages.js";
import { settings } from "../../db/schema/settings.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { getRecordById, getRecordsConditionally, getSingleRecordByAColumnValue, updateRecordById, } from "../../services/db/baseDbService.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";
async function getSettingByKey(key) {
    const setting = await getSingleRecordByAColumnValue(settings, "key", key, "eq");
    if (!setting) {
        throw new NotFoundException(SETTING_NOT_FOUND);
    }
    return setting;
}
async function getAllSettings() {
    const orderByQueryData = parseOrderByQuery(undefined, "key", "asc");
    const result = await getRecordsConditionally(settings, undefined, undefined, orderByQueryData);
    return result;
}
async function updateSetting(id, data) {
    const existing = await getRecordById(settings, id);
    if (!existing) {
        throw new NotFoundException(SETTING_NOT_FOUND);
    }
    const updatedSetting = await updateRecordById(settings, id, data);
    return updatedSetting;
}
export { getAllSettings, getSettingByKey, updateSetting, };
