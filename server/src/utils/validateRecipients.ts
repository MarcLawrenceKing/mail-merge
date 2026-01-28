type ValidationResult = {
  validRows: any[];
  invalid: {
    rowIndex: number;
    email: string;
    reason: string;
  }[];
};

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRecipients = (
  rows: any[],
  recipientField: string
): ValidationResult => {
  const validRows: any[] = [];
  const invalid: ValidationResult["invalid"] = [];

  rows.forEach((row, index) => {
    const email = row[recipientField];

    if (!email) {
      invalid.push({
        rowIndex: index + 1,
        email: "",
        reason: "Missing email",
      });
      return;
    }

    if (typeof email !== "string") {
      invalid.push({
        rowIndex: index + 1,
        email: String(email),
        reason: "Invalid email type",
      });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      invalid.push({
        rowIndex: index + 1,
        email,
        reason: "Invalid email format",
      });
      return;
    }

    validRows.push(row);
  });

  return { validRows, invalid };
};
