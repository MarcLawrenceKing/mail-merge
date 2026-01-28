const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRecipients = (
  rows: any[],
  recipientField: string
) => {
  const validRows: any[] = [];
  const invalid: {
    email: string;
    reason: string;
  }[] = [];

  for (const row of rows) {
    const email = row[recipientField];

    if (!email) {
      invalid.push({ email: "(empty)", reason: "Missing email" });
      continue;
    }

    if (!EMAIL_REGEX.test(email)) {
      invalid.push({ email, reason: "Invalid email format" });
      continue;
    }

    validRows.push(row);
  }

  return { validRows, invalid };
};
