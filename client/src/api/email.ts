
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
