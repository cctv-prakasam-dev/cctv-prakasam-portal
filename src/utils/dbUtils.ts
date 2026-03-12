import type { SQL } from "drizzle-orm";

import { and, eq, getTableName, gt, gte, ilike, inArray, isNull, like, lt, lte, ne, not, notInArray, sql } from "drizzle-orm";

import type { DBTable, DBTableColumns, DBTableRow, InQueryData, OrderByQueryData, SortDirection, Transaction, WhereQueryData } from "../types/db.types.js";

import { db } from "../db/configuration.js";

function prepareSelectColumnsForQuery(table: DBTable, columnsToSelect?: any) {
  if (!columnsToSelect) {
    return null;
  }

  if (columnsToSelect.length === 0) {
    return {};
  }

  const columnsForQuery: Record<string, SQL> = {};
  // loop through columns and prepare the select query object
  columnsToSelect.map((column: string) => {
    return (columnsForQuery[column as string] = sql.raw(
      `${getTableName(table)}.${column as string}`,
    ));
  });
  return columnsForQuery;
}

function prepareWhereQueryConditions<R extends DBTableRow>( // TODO: Need to handle json b support here
  table: DBTable,
  whereQueryData?: WhereQueryData<R>,
): SQL[] | null {
  if (!whereQueryData?.columns.length) {
    return null;
  }

  const whereQueries: SQL[] = [];
  const orSearchQueries: SQL[] = [];

  const tableName = getTableName(table);

  for (let i = 0; i < whereQueryData.columns.length; i++) {
    const col = whereQueryData.columns[i]! as string;
    const operator = whereQueryData.operators?.[i] ?? "eq";
    const value = whereQueryData.values[i];
    const columnInfo = sql.raw(`${tableName}.${col}`);

    const arrayValue = Array.isArray(value) ? value : [value];

    if (operator === "ilike") {
      orSearchQueries.push(ilike(columnInfo, value));
      continue;
    }

    switch (operator) {
      case "eq":
        whereQueries.push(eq(columnInfo, value));
        break;
      case "ne":
        whereQueries.push(ne(columnInfo, value));
        break;
      case "gt":
        whereQueries.push(gt(columnInfo, value));
        break;
      case "gte":
        whereQueries.push(gte(columnInfo, value));
        break;
      case "lt":
        whereQueries.push(lt(columnInfo, value));
        break;
      case "lte":
        whereQueries.push(lte(columnInfo, value));
        break;
      case "like":
        whereQueries.push(like(columnInfo, value));
        break;
      case "in":
        whereQueries.push(inArray(columnInfo, arrayValue));
        break;
      case "notIn":
        whereQueries.push(notInArray(columnInfo, arrayValue));
        break;
      case "isNull":
        whereQueries.push(isNull(columnInfo));
        break;
      case "isNotNull":
        whereQueries.push(not(isNull(columnInfo)));
        break;
      case "between":
        if (Array.isArray(value) && value.length === 2) {
          whereQueries.push(
            sql`${columnInfo} BETWEEN ${value[0]} AND ${value[1]}`,
          );
        }
        break;
      default:
        whereQueries.push(eq(columnInfo, value));
    }
  }

  // 🔥 Add all ilike search conditions with OR
  if (orSearchQueries.length > 0) {
    whereQueries.push(sql`(${sql.join(orSearchQueries, sql` OR `)})`);
  }

  return whereQueries;
}

function prepareOrderByQueryConditions<R extends DBTableRow>(
  table: DBTable,
  orderByQueryData?: OrderByQueryData<R>,
) {
  const orderByQueries: SQL[] = [];

  if (
    !orderByQueryData
    || Object.keys(orderByQueryData).length === 0
    || orderByQueryData.columns.length === 0
  ) {
    const orderByQuery = sql.raw(`${getTableName(table)}.id desc`);
    orderByQueries.push(orderByQuery);
  }

  if (
    orderByQueryData
    && Object.keys(orderByQueryData).length > 0
    && orderByQueryData.columns.length > 0
  ) {
    const { columns, values } = orderByQueryData;
    for (let i = 0; i < columns.length; i++) {
      const orderByQuery = sql.raw(
        `${getTableName(table)}.${columns[i] as string} ${values[i] as string}`,
      );
      orderByQueries.push(orderByQuery);
    }
  }
  return orderByQueries;
}

function prepareInQueryCondition<R extends DBTableRow>(
  table: DBTable,
  inQueryData?: InQueryData<R>,
) {
  if (
    inQueryData
    && Object.keys(inQueryData).length > 0
    && inQueryData.values.length > 0
  ) {
    const columnInfo = sql.raw(
      `${getTableName(table)}.${inQueryData.key as string}`,
    );
    const inQuery = inArray(columnInfo, inQueryData.values);
    return inQuery;
  }
  return null;
}

async function executeQuery<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  whereQuery: SQL | undefined | null,
  columnsRequired: Record<string, SQL> | null,
  orderByConditions: SQL[],
  inQueryCondition: SQL | null,
  paginationData?: { page: number; pageSize: number },
  trx?: Transaction,
) {
  let dQuery = columnsRequired
    ? db.select(columnsRequired).from(table).$dynamic()
    : db.select().from(table).$dynamic();

  if (whereQuery && inQueryCondition) {
    dQuery = dQuery.where(and(whereQuery, inQueryCondition));
  }
  else if (whereQuery) {
    dQuery = dQuery.where(whereQuery);
  }
  else if (inQueryCondition) {
    dQuery = dQuery.where(inQueryCondition);
  }

  dQuery = dQuery.orderBy(...orderByConditions);

  if (paginationData) {
    const { page, pageSize } = paginationData;
    dQuery = dQuery.limit(pageSize).offset((page - 1) * pageSize);
  }

  try {
    const results = trx ? await trx.execute(dQuery) : await dQuery;

    if (columnsRequired) {
      return results as Pick<R, C>[];
    }
    return results as R[];
  }
  catch (error) {
    console.error("Database query error details:");
    console.error("Table:", getTableName(table));
    // Attempt to log the query string and parameters if possible
    try {
      const sqlQuery = dQuery.toSQL();
      console.error("SQL:", sqlQuery.sql);
      console.error("Params:", sqlQuery.params);
    }
    catch (e) {
      console.error("Could not stringify query:", e);
    }
    throw error;
  }
}

export function parseOrderByQuery<T extends DBTableRow>(
  orderBy: string | undefined,
  defaultColumn: DBTableColumns<T> = "created_at" as DBTableColumns<T>,
  defaultDirection: SortDirection = "desc",
): OrderByQueryData<T> {
  // Default orderBy configuration
  let orderByQueryData: OrderByQueryData<T> = {
    columns: [defaultColumn],
    values: [defaultDirection],
  };
  if (orderBy) {
    const orderByColumns: DBTableColumns<T>[] = [];
    const orderByValues: SortDirection[] = [];

    // Split by comma for multiple ordering criteria
    const queryStrings = orderBy.split(",");

    // Process each ordering criterion
    for (const queryString of queryStrings) {
      const [column, value] = queryString.split(":");
      orderByColumns.push(column as DBTableColumns<T>);
      orderByValues.push(value as SortDirection);
    }

    // Update the orderByQueryData with parsed values
    orderByQueryData = {
      columns: orderByColumns,
      values: orderByValues,
    };
  }

  return orderByQueryData;
}

export {
  executeQuery,
  prepareInQueryCondition,
  prepareOrderByQueryConditions,
  prepareSelectColumnsForQuery,
  prepareWhereQueryConditions,
};
