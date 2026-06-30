const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { verifyTransporter } = require("./config/mailer");
const healthRoutes = require("./routes/healthRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Load environment variables
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL;

const envStatus = {
  PORT: !!process.env.PORT,
  EMAIL_USER: !!process.env.EMAIL_USER,
  EMAIL_PASS: !!process.env.EMAIL_PASS,
  EMAIL_TO: !!process.env.EMAIL_TO,
  FRONTEND_URL: !!frontendUrl,
};

// Configure CORS
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://localhost:5173", // Vite default
  "https://nexaclean.onrender.com",
];

if (frontendUrl) {
  allowedOrigins.push(frontendUrl);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost:") ||
      origin.includes("127.0.0.1:");

    if (isAllowed) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify SMTP connection on startup
verifyTransporter();

// Routes
app.use("/", healthRoutes);
app.use("/api", bookingRoutes);

// Start Server and Print Audit Logs
app.listen(port, () => {
  console.log("\n=============================================");
  console.log(" NEXACLEAN PRODUCTION BACKEND IS STARTING");
  console.log("=============================================");
  console.log(`Port configuration: ${port}`);
  console.log("---------------------------------------------");
  console.log(" Environment variables check:");
  console.log(`  PORT status:          [${envStatus.PORT ? "LOADED" : "MISSING (Using default 5000)"}]`);
  console.log(`  EMAIL_USER status:    [${envStatus.EMAIL_USER ? "LOADED" : "MISSING"}] -> ${process.env.EMAIL_USER || "None"}`);
  console.log(`  EMAIL_TO status:      [${envStatus.EMAIL_TO ? "LOADED (Configured)" : "FALLBACK (Same as sender)"}] -> ${process.env.EMAIL_TO || process.env.EMAIL_USER}`);
  console.log(`  EMAIL_PASS status:    [${envStatus.EMAIL_PASS ? "LOADED" : "MISSING"}]`);
  console.log(`  FRONTEND_URL status:  [${envStatus.FRONTEND_URL ? "LOADED" : "NOT SET (CORS default allowed)"}] -> ${frontendUrl || "None"}`);
  console.log("=============================================\n");
});