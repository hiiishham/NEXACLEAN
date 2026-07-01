const express = require("express");
const router = express.Router();
const { sendTestEmail } = require("../utils/brevoEmail");

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

  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Brevo API key missing. Test email aborted."
    });
  }

  try {
    const result = await sendTestEmail();
    console.log("[TEST EMAIL SUCCESS] Message sent via Brevo API:", result.messageId);
    res.status(200).json({
      success: true,
      message: "Test email sent successfully!",
      messageId: result.messageId,
      recipient: process.env.EMAIL_TO
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
