import { Router } from "express";
import { generateAndStoreOtp, verifyOtp } from "../services/otpService";
import { sendOtpEmail } from "../services/emailService";
import { requireOtpVerified } from "../services/guardMiddleware";


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

export default router;
