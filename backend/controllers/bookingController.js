const { transporter, emailUser, emailTo } = require("../config/mailer");

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

  // Format the email content
  const mailOptions = {
    from: emailUser,
    to: emailTo,
    subject: `New NexaClean Booking - ${full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #128a7d; border-bottom: 2px solid #128a7d; padding-bottom: 10px;">New Booking Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Full Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${full_name.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone_number.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-transform: capitalize;">${service_type.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Booking Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking_date.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Booking Time:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking_time.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${address.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${message ? message.trim() : "N/A"}</td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    console.log("[BOOKING EMAIL] Email sending started...");
    const info = await transporter.sendMail(mailOptions);

    console.log("[BOOKING EMAIL SUCCESS] Email sent successfully!");
    console.log("  Nodemailer Message ID:", info.messageId);
    console.log("  SMTP Response:", info.response);
    console.log("-----------------------------------------");

    return res.status(200).json({
      success: true,
      message: "Booking request sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("[BOOKING EMAIL FAILED] SMTP Error encountered while sending booking email:");
    console.error("  Error Name:", error.name);
    console.error("  Error Message:", error.message);
    if (error.code) console.error("  Error Code:", error.code);
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

  const mailOptions = {
    from: emailUser,
    to: emailTo,
    subject: `New Newsletter Subscriber - ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 500px;">
        <h2 style="color: #10B981; margin-bottom: 16px;">📬 New Newsletter Subscriber!</h2>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px;">
          <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email.trim()}</p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #64748b;">Subscribed on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  };

  try {
    console.log("[SUBSCRIBE EMAIL] Email sending started...");
    const info = await transporter.sendMail(mailOptions);
    console.log("[SUBSCRIBE EMAIL SUCCESS] Subscription notification sent!");
    console.log("  Message ID:", info.messageId);
    console.log("-----------------------------------------");

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully!",
    });
  } catch (error) {
    console.error("[SUBSCRIBE EMAIL FAILED] SMTP Error sending subscription notification:", error.message);
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
