import { Router } from "express";
import { generateAndStoreOtp } from "../services/otpService";
import { sendOtpEmail } from "../services/emailService";

const router = Router();

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = await generateAndStoreOtp(email);
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

export default router;
