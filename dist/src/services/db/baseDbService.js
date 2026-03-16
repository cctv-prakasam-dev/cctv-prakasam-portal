import { and, asc, count, desc, eq, getTableName, inArray, sql } from "drizzle-orm";
import { db } from "../../db/configuration.js";
import { executeQuery, prepareInQueryCondition, prepareOrderByQueryConditions, prepareSelectColumnsForQuery, prepareWhereQueryConditions } from "../../utils/dbUtils.js";
async function getRecordById(table, id, columnsToSelect) {
    const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);
    const result = columnsRequired
        ? await db.select(columnsRequired).from(table).where(eq(table.id, id))
        : await db.select().from(table).where(eq(table.id, id));
    if (result.length === 0) {
        return null;
    }
    if (columnsRequired) {
        return result[0];
        // return result[0] as SelectedKeys<R, C>
        // return result[0] as Record<C, any>
    }
    return result[0];
}
async function getRecordsConditionally(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData, trx) {
    const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);
    const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
    const inQueryCondition = prepareInQueryCondition(table, inQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);
    const whereQuery = whereConditions ? and(...whereConditions) : null;
    const results = await executeQuery(table, whereQuery, columnsRequired, orderByConditions, inQueryCondition, undefined, trx);
    // if (!results || results.length === 0) {
    //   return null;
    // }
    return results;
}
async function getPaginatedRecordsConditionally(table, page, pageSize, orderByQueryData, whereQueryData, columnsToSelect, inQueryData) {
    const MAX_PAGE_SIZE = 100;
    pageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
    let countQuery = db
        .select({ total: count(table.id) })
        .from(table)
        .$dynamic();
    if (whereQueryData && inQueryData) {
        // Case 1: Both where and in query data exist
        const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
        const inQueryCondition = prepareInQueryCondition(table, inQueryData);
        if (whereConditions && whereConditions.length > 0 && inQueryCondition) {
            // Both conditions are valid - combine them with AND
            countQuery = countQuery.where(and(and(...whereConditions), inQueryCondition));
        }
    }
    else if (whereQueryData) {
        // Case 2: Only where query data exists
        const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
        if (whereConditions && whereConditions.length > 0) {
            countQuery = countQuery.where(and(...whereConditions));
        }
    }
    const recordsCount = await countQuery;
    const total_records = recordsCount[0]?.total || 0;
    const total_pages = Math.ceil(total_records / pageSize) || 1;
    const pagination_info = {
        total_records,
        total_pages,
        page_size: pageSize,
        current_page: page > total_pages ? total_pages : page,
        next_page: page >= total_pages ? null : page + 1,
        prev_page: page <= 1 ? null : page - 1,
    };
    if (total_records === 0) {
        return {
            pagination_info,
            records: [],
        };
    }
    const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);
    const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);
    const inQueryCondition = prepareInQueryCondition(table, inQueryData);
    const whereQuery = whereConditions ? and(...whereConditions) : null;
    const paginationData = { page, pageSize };
    const results = await executeQuery(table, whereQuery, columnsRequired, orderByConditions, inQueryCondition, paginationData);
    // if (!results || results.length === 0) {
    //   return null;
    // }
    return {
        pagination_info,
        records: results,
    };
}
async function getMultipleRecordsByAColumnValue(table, column, value, operator, columnsToSelect, orderByQueryData, inQueryData) {
    const whereQueryData = {
        columns: [column],
        values: [value],
        operators: [operator],
    };
    const results = await getRecordsConditionally(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);
    return results;
}
async function getMultipleRecordsByMultipleColumnValues(table, columns, values, operators, columnsToSelect, orderByQueryData, inQueryData) {
    const whereQueryData = {
        columns,
        values,
        operators,
    };
    const results = await getRecordsConditionally(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);
    // if (!results) {
    //   return null;
    // }
    return results;
}
async function getSingleRecordByAColumnValue(table, column, value, operator, columnsToSelect, orderByQueryData, inQueryData) {
    const whereQueryData = {
        columns: [column],
        values: [value],
        operators: [operator],
    };
    const results = await getRecordsConditionally(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);
    if (!results) {
        return null;
    }
    return results[0];
}
async function getSingleRecordByMultipleColumnValues(table, columns, values, operators, columnsToSelect, orderByQueryData, inQueryData) {
    const whereQueryData = {
        columns,
        values,
        operators,
    };
    const results = await getRecordsConditionally(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);
    if (!results) {
        return null;
    }
    return results[0];
}
async function saveSingleRecord(table, record, trx) {
    const client = trx ?? db;
    const result = await client.insert(table).values(record).returning();
    return result[0];
}
// async function saveSingleRecord<R extends DBTableRow>(
//   table: DBTable,
//   record: DBNewRecord,
// ) {
//   const recordSaved = await db.insert(table).values(record).returning();
//   return recordSaved[0] as R;
// }
async function saveRecords(table, records, trx) {
    const client = trx ?? db; // use transaction if passed, else default db
    const recordsSaved = await client.insert(table).values(records).returning();
    return recordsSaved;
}
// async function saveRecords<R extends DBTableRow>(
//   table: DBTable,
//   records: DBNewRecords,
// ) {
//   const recordsSaved = await db.insert(table).values(records).returning();
//   return recordsSaved as R[];
// }
// async function updateRecordById<R extends DBTableRow>(
//   table: DBTable,
//   id: number,
//   record: UpdateRecordData<R>,
// ) {
//   const dataWithTimeStamps = { id, ...record, updated_at: new Date() };
//   const recordUpdated = await db
//     .update(table)
//     .set(dataWithTimeStamps)
//     .where(eq(table.id, id))
//     .returning();
//   return recordUpdated[0] as R;
// }
async function updateRecordById(table, id, record, trx) {
    const client = trx ?? db; // ← fallback to db if trx not passed
    const dataWithTimeStamps = {
        id,
        ...record,
        updated_at: new Date(),
    };
    const recordUpdated = await client
        .update(table)
        .set(dataWithTimeStamps)
        .where(eq(table.id, id))
        .returning();
    return recordUpdated[0];
}
async function deleteRecordById(table, id) {
    const deletedRecord = await db
        .delete(table)
        .where(eq(table.id, id))
        .returning();
    return deletedRecord[0];
}
async function softDeleteRecordById(table, id, record) {
    return await db.update(table).set(record).where(eq(table.id, id)).returning();
}
async function exportData(table, projection, filters) {
    const initialQuery = db.select(projection).from(table);
    let finalQuery;
    if (filters && filters.length > 0) {
        finalQuery = initialQuery.where(and(...filters));
    }
    const result = await finalQuery;
    return result;
}
async function getPaginatedRecords(table, skip, limit, filters, sorting, projection) {
    let initialQuery = db.select(projection).from(table);
    if (filters && filters.length > 0) {
        initialQuery = initialQuery.where(and(...filters));
    }
    if (sorting) {
        const columnExpression = table[sorting.sort_by];
        if (sorting.sort_type === "asc") {
            initialQuery = initialQuery.orderBy(asc(columnExpression));
        }
        else {
            initialQuery = initialQuery.orderBy(desc(columnExpression));
        }
    }
    else {
        initialQuery = initialQuery.orderBy(desc(table.created_at));
    }
    const result = await initialQuery.limit(limit).offset(skip);
    return result;
}
async function getRecordsCount(table, filters) {
    const initialQuery = db.select({ total: count() }).from(table);
    let finalQuery;
    if (filters && filters.length > 0) {
        finalQuery = initialQuery.where(and(...filters));
    }
    else {
        finalQuery = initialQuery;
    }
    const result = await finalQuery;
    return result[0].total;
}
export async function deleteAllRecords(table) {
    return await db.delete(table);
}
async function updateRecordByColumnValue(table, column, value, record, id) {
    const dataWithTimeStamps = { id, ...record, updated_at: new Date() };
    const columnInfo = sql.raw(`${getTableName(table)}.${column}`);
    return await db
        .update(table)
        .set(dataWithTimeStamps)
        .where(eq(columnInfo, value));
}
async function updateRecordByMultipleColumnValues(table, columns, values, operators, record, id, trx) {
    const client = trx ?? db;
    const whereQueryData = {
        columns,
        values,
        operators,
    };
    const dataWithTimeStamps = { id, ...record, updated_at: new Date() };
    const whereConditions = whereQueryData.columns.map((column, index) => eq(sql.raw(`${getTableName(table)}.${String(column)}`), whereQueryData.values[index]));
    return await client
        .update(table)
        .set(dataWithTimeStamps)
        .where(and(...whereConditions));
}
async function updateMultipleRecordsByIds(table, ids, record) {
    const updatedRecords = await db
        .update(table)
        .set(record)
        .where(inArray(table.id, ids))
        .returning();
    return updatedRecords.length;
}
async function updateCallStatus(table, actionType, userType, caseId, flag) {
    await db.execute(sql `
    UPDATE ${table}
    SET call_status = jsonb_set(
      call_status,
      '{${sql.raw(actionType)}}',
      CASE
        WHEN ${flag} THEN
          COALESCE(call_status->${sql.raw(`'${actionType}'`)}, '[]'::jsonb) || to_jsonb(${userType}::text)
        ELSE COALESCE((
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements_text(
            COALESCE(call_status->${sql.raw(`'${actionType}'`)}, '[]'::jsonb)
          ) AS elem
          WHERE elem != ${userType}
        ), '[]'::jsonb)
      END
    )
    WHERE id = ${caseId}
  `);
}
async function updateRecordsByColumnsAndIn(table, columns, values, inColumn, inValues, updateData) {
    const whereConditions = columns.map((col, idx) => eq(sql.raw(`${getTableName(table)}.${col}`), values[idx]));
    whereConditions.push(inArray(sql.raw(`${getTableName(table)}.${inColumn}`), inValues));
    return db
        .update(table)
        .set(updateData)
        .where(and(...whereConditions));
}
export { deleteRecordById, exportData, getMultipleRecordsByAColumnValue, getMultipleRecordsByMultipleColumnValues, getPaginatedRecords, getPaginatedRecordsConditionally, getRecordById, getRecordsConditionally, getRecordsCount, getSingleRecordByAColumnValue, getSingleRecordByMultipleColumnValues, saveRecords, saveSingleRecord, softDeleteRecordById, updateCallStatus, updateMultipleRecordsByIds, updateRecordByColumnValue, updateRecordById, updateRecordByMultipleColumnValues, updateRecordsByColumnsAndIn, };
