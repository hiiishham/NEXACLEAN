const nodemailer = require("nodemailer");
require("dotenv").config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO || emailUser;

// Nodemailer Gmail SMTP transporter config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 15000, // 15 seconds connection timeout
  socketTimeout: 15000,     // 15 seconds socket timeout
});

// Verify SMTP connection on startup
const verifyTransporter = () => {
  console.log("[SMTP] Verifying connection to Gmail SMTP server...");
  transporter.verify((error, success) => {
    if (error) {
      console.error("[SMTP ERROR] Transporter verification failed:", error.message);
    } else {
      console.log("[SMTP SUCCESS] Transporter is ready to send emails!");
    }
  });
};

module.exports = {
  transporter,
  verifyTransporter,
  emailUser,
  emailTo,
};
