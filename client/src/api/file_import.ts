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
  const token = sessionStorage.getItem("otp_token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/email/import-file`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Import failed");
  }

  return result;
};
