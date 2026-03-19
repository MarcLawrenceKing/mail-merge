import { Router } from "express";
import { generateAndStoreOtp, verifyOtp } from "../services/otpService";
import { sendOtpEmail } from "../services/emailService";
import jwt from "jsonwebtoken";
import {
  requireOtpAndOAuthVerified,
  requireOtpVerified,
  type AuthenticatedRequest,
} from "../services/guardMiddleware";


const router = Router();

// this route "/api/auth/send-otp"
// - reads the email from request body
// - checks if email was extracted, if not, error toast
// - checks email format via regex, if wrong structure, error toast
// - calls the generateAndStoreOtp and sendOtpEmail functions from /services
// - toasts a success, or error message 
router.post("/send-otp", async (req, res) => {
  try {
    // recipient = email
    // get the email from request body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // call generate and send otp services 
    const otp = await generateAndStoreOtp(email);
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent, check your email" });
  } catch (err: any) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// this route "/api/auth/verify-otp"
// - extracts email and otp from the request body
// - returns error when there is no email or OTP
// - calls the verifyOtp helper function
// - returns the result, if there is error catched, print it
router.post("/verify-otp", async (req, res) => {
  try {
    // get the email and otp from VerifyOTP page
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const result = await verifyOtp(email, otp);

    return res.json(result);

  } catch (err: any) {
    return res.status(err.status || 500).json({
      message: err.message || "Server error",
      ...err.meta,
    });
  }
});

// this route "/api/auth/otp-guard-check"
// - checks the jwt in the backend to be used in the frontend
router.get("/otp-guard-check", requireOtpVerified, (req, res) => {
  res.json({ ok: true });
});

router.get("/session-guard-check", requireOtpAndOAuthVerified, (req, res) => {
  res.json({ ok: true });
});

router.get("/google/auth-url", requireOtpVerified, async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const jwtSecret = process.env.JWT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !jwtSecret || !redirectUri) {
    return res.status(500).json({
      message:
        "OAuth is not configured. Missing GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, or JWT_SECRET.",
    });
  }

  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.email || !auth.otpVerified) {
    return res.status(403).json({
      message: "OTP verification required before OAuth.",
    });
  }

  const requestOrigin =
    typeof req.headers.origin === "string" ? req.headers.origin : "";
  let clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  if (requestOrigin) {
    try {
      const parsed = new URL(requestOrigin);
      if (
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
      ) {
        clientUrl = parsed.origin;
      }
    } catch {
      // ignore invalid origin and keep fallback client URL
    }
  }

  const state = jwt.sign(
    {
      email: auth.email,
      otpVerified: true,
      clientUrl,
      type: "google_oauth_state",
    },
    jwtSecret,
    { expiresIn: "10m" }
  );

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("login_hint", auth.email);

  return res.json({ authUrl: authUrl.toString() });
});

router.get("/google/callback", async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const jwtSecret = process.env.JWT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const fallbackClientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const redirectBack = (baseClientUrl: string, params: Record<string, string>) => {
    const url = new URL("/verify/otp/oauth/callback", baseClientUrl);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    return res.redirect(url.toString());
  };

  if (!clientId || !clientSecret || !jwtSecret || !redirectUri) {
    return redirectBack(fallbackClientUrl, {
      error: "oauth_config_missing",
      message:
        "OAuth configuration is incomplete. Please contact the administrator.",
    });
  }

  const code = String(req.query.code || "");
  const state = String(req.query.state || "");

  if (!code || !state) {
    return redirectBack(fallbackClientUrl, {
      error: "oauth_missing_code",
      message: "OAuth callback is missing required parameters.",
    });
  }

  let statePayload: {
    email: string;
    otpVerified: boolean;
    clientUrl?: string;
    type: string;
  };
  try {
    statePayload = jwt.verify(state, jwtSecret) as {
      email: string;
      otpVerified: boolean;
      clientUrl?: string;
      type: string;
    };
  } catch {
    return redirectBack(fallbackClientUrl, {
      error: "invalid_state",
      message: "Invalid or expired OAuth state. Please retry.",
    });
  }

  if (!statePayload?.email || !statePayload?.otpVerified || statePayload?.type !== "google_oauth_state") {
    return redirectBack(fallbackClientUrl, {
      error: "invalid_state_payload",
      message: "Invalid OAuth state payload.",
    });
  }

  let callbackClientUrl = fallbackClientUrl;
  if (statePayload.clientUrl) {
    try {
      const parsed = new URL(statePayload.clientUrl);
      if (
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
      ) {
        callbackClientUrl = parsed.origin;
      }
    } catch {
      // ignore invalid state client URL and keep fallback
    }
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      id_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenRes.ok || !tokenData.id_token) {
      return redirectBack(callbackClientUrl, {
        error: "token_exchange_failed",
        message:
          tokenData.error_description ||
          tokenData.error ||
          "Failed to complete Google OAuth.",
      });
    }

    const idTokenParts = tokenData.id_token.split(".");
    const payloadSegment = idTokenParts[1];

    if (!payloadSegment) {
      return redirectBack(callbackClientUrl, {
        error: "invalid_id_token",
        message: "Google did not return a valid id_token payload.",
      });
    }

    const idTokenPayloadJson = Buffer.from(payloadSegment, "base64url").toString(
      "utf8"
    );
    const idTokenPayload = JSON.parse(idTokenPayloadJson) as {
      email?: string;
      email_verified?: boolean;
    };

    const oauthEmail = (idTokenPayload.email || "").trim().toLowerCase();
    const otpEmail = statePayload.email.trim().toLowerCase();

    if (!oauthEmail || !idTokenPayload.email_verified) {
      return redirectBack(callbackClientUrl, {
        error: "unverified_google_email",
        message: "Your Google account email is not verified.",
      });
    }

    if (oauthEmail !== otpEmail) {
      return redirectBack(callbackClientUrl, {
        error: "email_mismatch",
        message: "OTP and Google OAuth accounts must be the same.",
      });
    }

    const token = jwt.sign(
      {
        email: statePayload.email,
        otpVerified: true,
        oauthVerified: true,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return redirectBack(callbackClientUrl, {
      token,
      success: "true",
    });
  } catch {
    return redirectBack(callbackClientUrl, {
      error: "oauth_callback_failed",
      message: "OAuth verification failed. Please try again.",
    });
  }
});

export default router;
