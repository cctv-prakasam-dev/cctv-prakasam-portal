import type { Category } from "../../db/schema/categories.js";
import type { ValidatedCreateCategorySchema, ValidatedUpdateCategorySchema } from "./categories.validation.js";

import { CATEGORY_NOT_FOUND } from "../../constants/appMessages.js";
import { categories } from "../../db/schema/categories.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  deleteRecordById,
  getRecordById,
  getRecordsConditionally,
  saveSingleRecord,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";

async function getAllActiveCategories(): Promise<Category[]> {
  const orderByQueryData = parseOrderByQuery<Category>(undefined, "sort_order", "asc");

  const result = await getRecordsConditionally<Category>(
    categories,
    {
      columns: ["is_active"],
      values: [true],
      operators: ["eq"],
    },
    undefined,
    orderByQueryData,
  );

  return result as Category[];
}

async function getCategoryById(id: number): Promise<Category> {
  const category = await getRecordById<Category>(categories, id);

  if (!category) {
    throw new NotFoundException(CATEGORY_NOT_FOUND);
  }

  return category;
}

async function createCategory(data: ValidatedCreateCategorySchema): Promise<Category> {
  const newCategory = await saveSingleRecord<Category>(categories, {
    name: data.name,
    name_te: data.name_te,
    slug: data.slug,
    icon: data.icon,
    color: data.color,
    sort_order: data.sort_order,
  });

  return newCategory;
}

async function updateCategory(id: number, data: ValidatedUpdateCategorySchema): Promise<Category> {
  await getCategoryById(id);

  const updatedCategory = await updateRecordById<Category>(categories, id, data);

  return updatedCategory;
}

async function deleteCategory(id: number): Promise<Category> {
  await getCategoryById(id);

  const deletedCategory = await deleteRecordById<Category>(categories, id);

  return deletedCategory;
}

export {
  createCategory,
  deleteCategory,
  getAllActiveCategories,
  getCategoryById,
  updateCategory,
};
