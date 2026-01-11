// this function parses the file input and uses it in the api/email/import-file route
import fs from "fs";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export type ParsedResult = {
  headers: string[];
  validRows: Record<string, string>[];
  skippedRows: number[];
  errors: string[];
};

/**
 * Ensures all headers are present and non-empty
 */
const validateHeaders = (headers: string[]) => {
  if (!headers || headers.length === 0) {
    throw new Error("File has no headers");
  }

  if (headers.some(h => !h || h.trim() === "")) {
    throw new Error("File contains a column with no header");
  }
};

/**
 * Validates a single row strictly.
 * Returns error messages if invalid, otherwise null.
 */
const validateRow = (
  row: unknown[],
  headers: string[],
  rowNumber: number
): string[] | null => {
  const errors: string[] = [];

  if (row.length !== headers.length) {
    errors.push(
      `Row ${rowNumber}: column count mismatch (expected ${headers.length}, got ${row.length - 1})`
    );
    return errors;
  }

  headers.forEach((header, index) => {
    const value = row[index];

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      errors.push(
        `Row ${rowNumber}: missing value for "${header}"`
      );
    }
  });

  return errors.length > 0 ? errors : null;
};

export const parseCSV = (filePath: string): ParsedResult => {
  const content = fs.readFileSync(filePath);

  const records: string[][] = parse(content, {
    skip_empty_lines: true,
  });

  const headers = records[0];
  validateHeaders(headers);

  const validRows: Record<string, string>[] = [];
  const skippedRows: number[] = [];
  const errors: string[] = [];

  records.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;

    const rowErrors = validateRow(row, headers, rowNumber);

    // ⛔ Immediately skip invalid rows
    if (rowErrors) {
      skippedRows.push(rowNumber);
      errors.push(...rowErrors);
      return;
    }

    // ✅ Safe to build row object (no undefined values)
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });

    validRows.push(obj);
  });

  return {
    headers,
    validRows,
    skippedRows,
    errors,
  };
};

export const parseXLSX = (filePath: string): ParsedResult => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
  });

  const headers = rows[0] as string[];
  validateHeaders(headers);

  const validRows: Record<string, string>[] = [];
  const skippedRows: number[] = [];
  const errors: string[] = [];

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;

    const rowErrors = validateRow(row, headers, rowNumber);

    // ⛔ Immediately skip invalid rows
    if (rowErrors) {
      skippedRows.push(rowNumber);
      errors.push(...rowErrors);
      return;
    }

    // ✅ Safe row construction
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = String(row[i]);
    });

    validRows.push(obj);
  });

  return {
    headers,
    validRows,
    skippedRows,
    errors,
  };
};

