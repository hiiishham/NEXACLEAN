const nodemailer = require("nodemailer");
require("dotenv").config();

const emailFrom = process.env.EMAIL_FROM;
const emailTo = process.env.EMAIL_TO;

// Nodemailer Brevo SMTP transporter config
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // use STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    connectionTimeout: 15000,
    socketTimeout: 15000,
});

// Verify SMTP connection on startup
const verifyTransporter = () => {
    console.log("[SMTP] Verifying connection to Brevo SMTP server...");
    transporter.verify((error, success) => {
        if (error) {
            console.error("✗ SMTP Connection Failed:", error.message);
        } else {
            console.log("✓ SMTP Connected");
        }
    });
};

module.exports = {
    transporter,
    verifyTransporter,
    emailFrom,
    emailTo,
};
