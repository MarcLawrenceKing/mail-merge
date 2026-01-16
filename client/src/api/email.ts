
// this frontend helper fetches the /api/email/test-send route from express server
export const sendTestEmail = async (
  fromEmail: string,
  appPassword: string,
  toEmail: string
) => {
  const res = await fetch("/api/email/test-send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fromEmail,
      appPassword,
      toEmail,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to send email");
  }

  return res.json();
};

// this frontend helper fetches the /api/email/send-email route from express server
export const sendBulkEmail = async (payload: {
  fromEmail: string;
  appPassword: string;
  headers: string[];
  data: Record<string, string>[];
  recipientField: string;
  subject: string;
  body: string;
  attachment?: {
    name: string;
    type: string;
    contentBase64: string;
  };
}) => {
  const res = await fetch("/api/email/send-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to send emails");
  }

  return res.json();
};

