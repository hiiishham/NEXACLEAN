const express = require("express");
const router = express.Router();
const { transporter, emailFrom, emailTo } = require("../config/mailer");

// Health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexaClean Backend Running Successfully"
  });
});

// Additional health endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NexaClean API"
  });
});

// Test Email endpoint
router.get("/api/test-email", async (req, res) => {
  console.log("[TEST EMAIL] Request received to send test email.");

  if (!emailFrom || !process.env.SMTP_PASS) {
    return res.status(500).json({
      success: false,
      message: "SMTP auth credentials missing. Test email aborted."
    });
  }

  const mailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: "NexaClean Backend Test Email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #10B981;">NexaClean Backend Test</h2>
        <p>This is a test email sent from the NexaClean production backend to verify SMTP configuration.</p>
        <p>Sent at: <strong>${new Date().toLocaleString()}</strong></p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[TEST EMAIL SUCCESS] Message sent:", info.messageId);
    res.status(200).json({
      success: true,
      message: "Test email sent successfully!",
      messageId: info.messageId,
      recipient: emailTo
    });
  } catch (error) {
    console.error("[TEST EMAIL ERROR] Failed to send test email:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send test email.",
      error: error.message
    });
  }
});

module.exports = router;
