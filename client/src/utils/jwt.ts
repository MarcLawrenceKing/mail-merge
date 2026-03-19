export type OtpJwtPayload = {
  email: string;
  otpVerified: boolean;
  oauthVerified: boolean;
  iat: number;
  exp: number;
};

const decodeBase64Url = (input: string) => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
};

export const getOtpTokenPayload = (): OtpJwtPayload | null => {
  const token = sessionStorage.getItem("otp_token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const payloadJson = decodeBase64Url(payloadBase64);
    return JSON.parse(payloadJson) as OtpJwtPayload;
  } catch (err) {
    console.error("Failed to decode otp_token", err);
    return null;
  }
};

export const hasValidAuthenticatedSessionToken = (): boolean => {
  const payload = getOtpTokenPayload();
  if (!payload) return false;

  const isNotExpired = payload.exp * 1000 > Date.now();
  return isNotExpired && payload.otpVerified && payload.oauthVerified;
};

// this helper function gets the email from the JWT token to be used in the "FROM" display in the SendEmail page
export const getEmailFromOtpToken = (): string => {
  const payload = getOtpTokenPayload();
  return payload?.email || "";
};
