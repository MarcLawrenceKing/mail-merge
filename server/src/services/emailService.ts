// function to send email

import nodemailer from "nodemailer";
import { replacePlaceholders } from "../utils/replacePlaceholders";
import { resend } from "../config/resend";


// this function
// - takes email and OTP as parameter
// - create SendEmailCommand (aws-sdk) and complete parameters such as source(verified_email), destination, and message (subject and body)
// - sends the email with ses credentials

// export const sendOtpEmail = async (email: string, otp: string) => {
//   const command = new SendEmailCommand({
//     Source: process.env.SES_VERIFIED_EMAIL!,
//     // email = recipient
//     Destination: { ToAddresses: [email] },
//     Message: {
//       Subject: { Data: "Your OTP Code" },
//       Body: {
//         Text: { Data: `Your OTP code is: ${otp}` },
//       },
//     },
//   });

//   return sesClient.send(command);
// };


// Resend replacement for SES
export const sendOtpEmail = async (email: string, otp: string) => {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send OTP email");
  }

  return data;
};

// this function sends a test email using Gmail OAuth access token
export const sendTestEmail = async (
  fromEmail: string,
  googleAccessToken: string,
  toEmail: string,
  googleRefreshToken?: string
) => {
  const transporter = createGmailTransporter({
    fromEmail,
    googleAccessToken,
    googleRefreshToken,
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"Test Mailer" <${fromEmail}>`,
      to: toEmail,
      subject: "Test Email Successful ✅",
      text: "This is a test email sent using Google OAuth.",
    });
  } catch (err: any) {
    const raw = typeof err?.message === "string" ? err.message : "";
    if (
      raw.includes("Invalid login") ||
      raw.includes("Username and Password not accepted")
    ) {
      throw new Error(
        "Google OAuth token is not valid for Gmail SMTP. Please reconnect Google OAuth and grant mail permission."
      );
    }
    throw err;
  }
};

type Base64Attachment = {
  name: string;
  type: string;
  contentBase64: string;
};

type SendBulkEmailParams = {
  fromEmail: string;
  googleAccessToken: string;
  googleRefreshToken?: string;
  rows: Record<string, string>[];
  recipientField: string;
  subject: string;
  body: string;
  attachment?: Base64Attachment;
  onProgress?: (payload: {
    email: string;
    result: "sent" | "failed";
    reason?: string;
  }) => void;
};

const normalizeSendError = (err: unknown) => {
  const raw = typeof (err as any)?.message === "string" ? (err as any).message : "";
  if (
    raw.includes("Invalid login") ||
    raw.includes("Username and Password not accepted")
  ) {
    return "Google OAuth token is not valid for Gmail SMTP. Please reconnect Google OAuth and grant mail permission.";
  }
  if (raw.includes("Invalid credentials")) {
    return "Google OAuth credentials are invalid. Please reconnect Google OAuth.";
  }
  if (raw.includes("Daily user sending quota exceeded")) {
    return "Gmail sending quota exceeded for this account.";
  }
  return raw || "Unknown email send error";
};

const createGmailTransporter = ({
  fromEmail,
  googleAccessToken,
  googleRefreshToken,
}: {
  fromEmail: string;
  googleAccessToken: string;
  googleRefreshToken?: string;
}) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const auth: Record<string, string> = {
    type: "OAuth2",
    user: fromEmail,
    accessToken: googleAccessToken,
  };

  if (googleRefreshToken && clientId && clientSecret) {
    auth.clientId = clientId;
    auth.clientSecret = clientSecret;
    auth.refreshToken = googleRefreshToken;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth,
  });
};

// function to actually send a gmail to the recipients
export const sendBulkEmails = async ({
  fromEmail,
  googleAccessToken,
  googleRefreshToken,
  rows,
  recipientField,
  subject,
  body,
  attachment,
  onProgress
}: SendBulkEmailParams) => {
  const transporter = createGmailTransporter({
    fromEmail,
    googleAccessToken,
    googleRefreshToken,
  });

  await transporter.verify();

  for (const row of rows) {

    const to = row[recipientField];
    if (!to) continue;

    try {
      const parsedSubject = replacePlaceholders(subject, row);
      const parsedBody = replacePlaceholders(body, row);

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject: parsedSubject,
        html: parsedBody.replace(/\n/g, "<br/>"),
        attachments: attachment
          ? [
              {
                filename: attachment.name,
                content: Buffer.from(
                  attachment.contentBase64,
                  "base64"
                ),
                contentType: attachment.type,
              },
            ]
          : [],
      });
      
      // Important: “sent” ≠ “delivered”
      // This code determines SMTP success, not actual delivery.
      onProgress?.({ email: to, result: "sent" });
    } catch (err) {
      onProgress?.({
        email: to,
        result: "failed",
        reason: normalizeSendError(err),
      });
    }
    //await delay(3000); // wait 3 seconds before sending
  }
};
