// helper function to call the backend api route

import { API_URL } from "./auth";

export type ImportResponse = {
  headers: string[];
  rows: Record<string, string>[];
  skippedRows: number[];
  errors: string[]; // display detailed errors
};

export const importFile = async (
  file: File
): Promise<ImportResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/email/import-file`, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Import failed");
  }

  return result;
};
