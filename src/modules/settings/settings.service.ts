import type { Setting } from "../../db/schema/settings.js";
import type { ValidatedUpdateSettingSchema } from "./settings.validation.js";

import { SETTING_NOT_FOUND } from "../../constants/appMessages.js";
import { settings } from "../../db/schema/settings.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  getRecordById,
  getRecordsConditionally,
  getSingleRecordByAColumnValue,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";

async function getSettingByKey(key: string): Promise<Setting> {
  const setting = await getSingleRecordByAColumnValue<Setting>(
    settings,
    "key",
    key,
    "eq",
  );

  if (!setting) {
    throw new NotFoundException(SETTING_NOT_FOUND);
  }

  return setting;
}

async function getAllSettings(): Promise<Setting[]> {
  const orderByQueryData = parseOrderByQuery<Setting>(undefined, "key", "asc");

  const result = await getRecordsConditionally<Setting>(
    settings,
    undefined,
    undefined,
    orderByQueryData,
  );

  return result as Setting[];
}

async function updateSetting(id: number, data: ValidatedUpdateSettingSchema): Promise<Setting> {
  const existing = await getRecordById<Setting>(settings, id);

  if (!existing) {
    throw new NotFoundException(SETTING_NOT_FOUND);
  }

  const updatedSetting = await updateRecordById<Setting>(settings, id, data);

  return updatedSetting;
}

export {
  getAllSettings,
  getSettingByKey,
  updateSetting,
};
