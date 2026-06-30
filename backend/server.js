const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Configure CORS to allow frontend communication
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify email environment variables are loaded
console.log("Checking .env configuration...");
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO || emailUser;

if (!emailUser || !emailPass) {
  console.error("ERROR: EMAIL_USER and EMAIL_PASS environment variables are not set in the .env file!");
} else {
  console.log("Environment variables loaded successfully:");
  console.log("  EMAIL_USER (sender/auth):", emailUser);
  console.log("  EMAIL_TO (recipient):", emailTo);
  console.log("  EMAIL_PASS: [LOADED - Hidden for security]");
}

// Nodemailer Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Verify SMTP connection on startup
console.log("Verifying SMTP connection...");
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Transporter verification failed:", error.message);
  } else {
    console.log("SMTP Transporter verification successful: Server is ready to send emails");
  }
});

// POST endpoint for booking service
app.post("/api/book-service", async (req, res) => {
  const {
    full_name,
    phone_number,
    service_type,
    booking_date,
    booking_time,
    address,
    message,
  } = req.body;

  // Validation: Check for empty required fields
  if (!full_name || !phone_number || !service_type || !booking_date || !booking_time || !address) {
    return res.status(400).json({
      success: false,
      message: "Required booking fields are missing.",
    });
  }

  // Format the email content
  const mailOptions = {
    from: emailUser,
    to: emailTo, // Send booking details to configured recipient
    subject: `New NexaClean Booking - ${full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #128a7d; border-bottom: 2px solid #128a7d; padding-bottom: 10px;">New Booking Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Full Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${full_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone_number}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-transform: capitalize;">${service_type}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Booking Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking_date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Booking Time:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking_time}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${message || "N/A"}</td>
          </tr>
        </table>
      </div>
    `,
  };

  console.log("-----------------------------------------");
  console.log("Incoming Booking API Request:");
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  try {
    console.log("Attempting to send booking email via Nodemailer SMTP...");
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully!");
    console.log("Nodemailer Message ID:", info.messageId);
    console.log("Nodemailer SMTP Response:", info.response);
    console.log("-----------------------------------------");

    return res.status(200).json({
      success: true,
      message: "Booking request sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("SMTP Error encountered while sending booking email:");
    console.error("  Error Name:", error.name);
    console.error("  Error Message:", error.message);
    if (error.code) console.error("  Error Code:", error.code);
    if (error.command) console.error("  Error SMTP Command:", error.command);
    console.error("-----------------------------------------");

    return res.status(500).json({
      success: false,
      message: "Failed to send email. SMTP configuration issue or network error.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// POST endpoint for newsletter subscription
app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  console.log("-----------------------------------------");
  console.log("New Newsletter Subscription:");
  console.log("  Subscriber Email:", email);

  const mailOptions = {
    from: emailUser,
    to: emailTo,
    subject: `New Newsletter Subscriber - ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 500px;">
        <h2 style="color: #10B981; margin-bottom: 16px;">📬 New Newsletter Subscriber!</h2>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px;">
          <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #64748b;">Subscribed on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Subscription notification sent!");
    console.log("  Message ID:", info.messageId);
    console.log("-----------------------------------------");

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully!",
    });
  } catch (error) {
    console.error("SMTP Error sending subscription notification:", error.message);
    console.error("-----------------------------------------");

    return res.status(500).json({
      success: false,
      message: "Subscription failed. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});