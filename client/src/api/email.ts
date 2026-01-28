import { API_URL } from "./auth";

// this frontend helper fetches the /api/email/test-send route from express server
export const sendTestEmail = async (
  fromEmail: string,
  appPassword: string,
  toEmail: string
) => {
  const res = await fetch(`${API_URL}/email/test-send`, {
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

// type BulkEmailProgress = {
//   sent: number;
//   failed: number;
//   percent: number;
// };

// this frontend helper fetches the /email/send-mail route from express server

// export const sendBulkEmail = async (
//   payload: {
//     fromEmail: string;
//     appPassword: string;
//     headers: string[];
//     data: Record<string, string>[];
//     recipientField: string;
//     subject: string;
//     body: string;
//     attachment?: {
//       name: string;
//       type: string;
//       contentBase64: string;
//     };
//   },
//   options: {
//     onProgress?: (progress: BulkEmailProgress) => void;
//     onRecipientResult?: (r: { email: string; sent: "SUCCESS" | "FAILED" }) => void;
//     onDone?: () => void;
//   } = {}
// ) => {
//   const res = await fetch(`${API_URL}/email/send-mail`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok || !res.body) {
//     throw new Error("Failed to start email sending");
//   }

//   const reader = res.body.getReader();
//   const decoder = new TextDecoder();

//   while (true) {
//     const { value, done } = await reader.read();
//     if (done) break;

//     const chunk = decoder.decode(value);
//     const events = chunk.split("\n\n");

//     for (const event of events) {
//       if (!event.startsWith("data:")) continue;

//       const data = JSON.parse(event.replace("data: ", ""));

//       if (data.error) {
//         throw new Error(data.error);
//       }

//       if (data.done) {
//         options.onDone?.();
//         return;
//       }

//       if (data.percent !== undefined) {
//         options.onProgress?.({
//           sent: data.sent,
//           failed: data.failed,
//           percent: data.percent,
//         });
//       }

//       if (data.email && data.result) {
//         options.onRecipientResult?.({
//           email: data.email,
//           sent: data.result === "sent" ? "SUCCESS" : "FAILED",
//         });
//       }
      
//     }
//   }
// };

// lamda safe approact (no live loading)
export const sendBulkEmail = async (payload: any) => {
  const res = await fetch(`${API_URL}/email/send-mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to send emails");
  }

  return data;
};
