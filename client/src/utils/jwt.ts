type OtpJwtPayload = {
  email: string;
  otpVerified: boolean;
  iat: number;
  exp: number;
};

// this helper function gets the email from the JWT token to be used in the "FROM" display in the SendEmail page
export const getEmailFromOtpToken = (): string => {
  const token = sessionStorage.getItem("otp_token");
  if (!token) return "";

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return "";

    const payloadJson = atob(payloadBase64);
    const payload: OtpJwtPayload = JSON.parse(payloadJson);

    return payload.email;
  } catch (err) {
    console.error("Failed to decode otp_token", err);
    return "";
  }
};
