import { Router, Request, Response } from "express";
import { sendTestEmail } from "../services/emailService";

const router = Router();


// this route "/api/email/test-send" test sends takes from & to emails, and app password to mail the user's self using nodemailer
router.post("/test-send", async (req: Request, res: Response) => {
  try {
    const { fromEmail, appPassword, toEmail } = req.body;

    if (!fromEmail || !appPassword || !toEmail) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    await sendTestEmail(fromEmail, appPassword, toEmail);

    return res.json({
      message: "Test email sent successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to send test email",
    });
  }
});

export default router;
