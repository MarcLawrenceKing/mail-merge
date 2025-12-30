// function to send email

import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/aws-ses";

export const sendOtpEmail = async (to: string, otp: string) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_VERIFIED_EMAIL!,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: "Your OTP Code" },
      Body: {
        Text: { Data: `Your OTP code is: ${otp}` },
      },
    },
  });

  return sesClient.send(command);
};
