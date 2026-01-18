import { Router, Request, Response } from "express";
import { sendBulkEmails, sendTestEmail } from "../services/emailService";

import multer from "multer";
import fs from "fs";
import { parseCSV, parseXLSX } from "../services/fileParsingService";

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

// express middleware to store files temporarily in uploads
const upload = multer({ dest: "uploads/" });

// imports file, 
// saves it in /uploads,
// checks file extension, 
// parse the file, 
// handle parsing error
// removes temporary file

router.post("/import-file", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // check file exptension
    const ext = req.file.originalname.split(".").pop()?.toLowerCase();
    let result;

    if (ext === "csv") {
      result = parseCSV(req.file.path);
    } else if (ext === "xlsx") {
      result = parseXLSX(req.file.path);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    return res.json({
      headers: result.headers,
      rows: result.validRows,
      skippedRows: result.skippedRows,
      errors: result.errors,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "File parsing failed",
    });
  } finally {
    fs.unlinkSync(req.file.path); // cleanup temp file
  }
});

// this route
// takes parameters
// validates params 
// double checks recipientField 
// calls sendBulkEmails service 
// returns a response
// tracks success and failed emails

router.post("/send-mail", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const {
    fromEmail,
    appPassword,
    headers,
    data,
    recipientField,
    subject,
    body,
    attachment,
  } = req.body;

  if (!headers.includes(recipientField)) {
    res.write(
      `data: ${JSON.stringify({ error: "Invalid recipient field" })}\n\n`
    );
    res.end();
    return;
  }

  const total = data.length;
  let sent = 0;
  let failed = 0;

  try {
    await sendBulkEmails({
      fromEmail,
      appPassword,
      rows: data,
      recipientField,
      subject,
      body,
      attachment,

      // 👇 progress callback
      onProgress: (result) => {
        if (result === "sent") sent++;
        else failed++;

        res.write(
          `data: ${JSON.stringify({
            sent,
            failed,
            total,
            percent: Math.round(((sent + failed) / total) * 100),
          })}\n\n`
        );
      },
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "Send failed" })}\n\n`);
    res.end();
  }
});


export default router;
