const { sendBookingEmail, sendSubscriptionEmail } = require("../utils/brevoEmail");

// POST endpoint for booking service
const bookService = async (req, res) => {
  console.log("-----------------------------------------");
  console.log("[BOOKING API] Request received.");
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  const {
    full_name,
    phone_number,
    service_type,
    booking_date,
    booking_time,
    address,
    message,
  } = req.body;

  // Request Validation
  const errors = [];
  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    errors.push("Full name is required and must be a valid text.");
  }
  if (!phone_number || typeof phone_number !== 'string' || !phone_number.trim()) {
    errors.push("Phone number is required.");
  }
  if (!service_type || typeof service_type !== 'string' || !service_type.trim()) {
    errors.push("Service type is required.");
  }
  if (!booking_date || typeof booking_date !== 'string' || !booking_date.trim()) {
    errors.push("Booking date is required.");
  }
  if (!booking_time || typeof booking_time !== 'string' || !booking_time.trim()) {
    errors.push("Booking time is required.");
  }
  if (!address || typeof address !== 'string' || !address.trim()) {
    errors.push("Address is required.");
  }
  if (message && typeof message !== 'string') {
    errors.push("Message must be a valid text.");
  }

  if (errors.length > 0) {
    console.warn("[BOOKING WARNING] Validation errors:", errors);
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors
    });
  }

  try {
    console.log("[BOOKING EMAIL] Email sending started via Brevo API...");
    const result = await sendBookingEmail(req.body);

    console.log("[BOOKING EMAIL SUCCESS] Email sent successfully!");
    console.log("  Brevo Message ID:", result.messageId);
    console.log("-----------------------------------------");

    return res.status(200).json({
      success: true,
      message: "Booking request sent successfully!",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("[BOOKING EMAIL FAILED] Brevo API Error encountered while sending booking email:");
    console.error("  Error Message:", error.message);
    console.error("-----------------------------------------");

    return res.status(500).json({
      success: false,
      message: "Failed to send booking email notification. Please try again later.",
      error: error.message,
    });
  }
};

// POST endpoint for newsletter subscription
const subscribe = async (req, res) => {
  console.log("-----------------------------------------");
  console.log("[SUBSCRIBE API] Request received.");
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes("@")) {
    console.warn("[SUBSCRIBE WARNING] Invalid email format:", email);
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  console.log("  Subscriber Email:", email);

  try {
    console.log("[SUBSCRIBE EMAIL] Email sending started via Brevo API...");
    const result = await sendSubscriptionEmail(email);
    console.log("[SUBSCRIBE EMAIL SUCCESS] Subscription notification sent!");
    console.log("  Brevo Message ID:", result.messageId);
    console.log("-----------------------------------------");

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully!",
    });
  } catch (error) {
    console.error("[SUBSCRIBE EMAIL FAILED] Brevo API Error sending subscription notification:", error.message);
    console.error("-----------------------------------------");

    return res.status(500).json({
      success: false,
      message: "Subscription failed. Please try again later.",
      error: error.message
    });
  }
};

module.exports = {
  bookService,
  subscribe,
};
