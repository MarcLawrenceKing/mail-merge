// function to send email

import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/aws-ses";

import nodemailer from "nodemailer";
import { replacePlaceholders } from "../utils/replacePlaceholders";
import { delay } from "../utils/delay3Seconds";


// this function
// - takes email and OTP as parameter
// - create SendEmailCommand (aws-sdk) and complete parameters such as source(verified_email), destination, and message (subject and body)
// - sends the email with ses credentials
export const sendOtpEmail = async (email: string, otp: string) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_VERIFIED_EMAIL!,
    // email = recipient
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Your OTP Code" },
      Body: {
        Text: { Data: `Your OTP code is: ${otp}` },
      },
    },
  });

  return sesClient.send(command);
};

// this function sends a test email using the from&to email, and app password
// uses nodemailer to send using the user's own gmail account
export const sendTestEmail = async (
  fromEmail: string,
  appPassword: string,
  toEmail: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: fromEmail,
      pass: appPassword,
    },
  });

  await transporter.sendMail({
    from: `"Test Mailer" <${fromEmail}>`,
    to: toEmail,
    subject: "Test Email Successful ✅",
    text: "This is a test email sent using your Google App Password.",
  });
};

type Base64Attachment = {
  name: string;
  type: string;
  contentBase64: string;
};

type SendBulkEmailParams = {
  fromEmail: string;
  appPassword: string;
  rows: Record<string, string>[];
  recipientField: string;
  subject: string;
  body: string;
  attachment?: Base64Attachment;
  onProgress?: (payload: {
    email: string;
    result: "sent" | "failed";
  }) => void;
};

// function to actually send a gmail to the recipients
export const sendBulkEmails = async ({
  fromEmail,
  appPassword,
  rows,
  recipientField,
  subject,
  body,
  attachment,
  onProgress
}: SendBulkEmailParams) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: fromEmail,
      pass: appPassword,
    },
  });

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
    } catch {
      onProgress?.({ email: to, result: "failed" });
    }
    await delay(3000); // wait 3 seconds before sending
  }
};
