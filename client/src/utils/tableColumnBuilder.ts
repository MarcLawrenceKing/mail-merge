// helper function to build the columns in the recipient table

export type TableColumn<T> = {
  key: keyof T | string;
  label: string;
};

export const buildColumnsFromHeaders = <T extends object>(
  headers: string[]
): TableColumn<T>[] =>
  headers.map(h => ({
    key: h,
    label: h,
  }));
