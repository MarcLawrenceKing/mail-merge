// util to replace placeholders

export const replacePlaceholders = (
  template: string,
  row: Record<string, string>
) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return row[key.trim()] ?? "";
  });
};