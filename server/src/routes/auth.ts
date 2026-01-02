import { Router } from "express";
import { generateAndStoreOtp } from "../services/otpService";
import { sendOtpEmail } from "../services/emailService";

const router = Router();

// this route "/send-otp"
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

export default router;
