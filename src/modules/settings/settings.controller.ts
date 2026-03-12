import type { Context } from "hono";

import type { ValidatedUpdateSettingSchema } from "./settings.validation.js";

import {
  SETTING_FETCHED,
  SETTING_UPDATED,
  SETTINGS_FETCHED,
  UPDATE_SETTING_VALIDATION_ERROR,
} from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import {
  getAllSettings,
  getSettingByKey,
  updateSetting,
} from "./settings.service.js";

async function getSetting(c: Context) {
  const key = c.req.param("key")!;
  const result = await getSettingByKey(key);

  return sendSuccessResp(c, 200, SETTING_FETCHED, result);
}

async function getSettings(c: Context) {
  const result = await getAllSettings();

  return sendSuccessResp(c, 200, SETTINGS_FETCHED, result);
}

async function update(c: Context) {
  const id = Number(c.req.param("id"));
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedUpdateSettingSchema>(
    "update-setting",
    reqData,
    UPDATE_SETTING_VALIDATION_ERROR,
  );

  const result = await updateSetting(id, validatedData);

  return sendSuccessResp(c, 200, SETTING_UPDATED, result);
}

export {
  getSetting,
  getSettings,
  update,
};
