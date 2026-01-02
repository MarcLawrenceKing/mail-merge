// function to send email

import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/aws-ses";

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
