const brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';

const getHeaders = () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("Missing BREVO_API_KEY environment variable.");
  }
  return {
    'accept': 'application/json',
    'api-key': process.env.BREVO_API_KEY,
    'content-type': 'application/json'
  };
};

const sendEmail = async (subject, htmlContent, replyToEmail = null) => {
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.EMAIL_TO;

  if (!emailFrom || !emailTo) {
    throw new Error("Missing EMAIL_FROM or EMAIL_TO environment variables.");
  }

  const payload = {
    sender: { name: 'NexaClean', email: emailFrom },
    to: [{ email: emailTo }],
    subject: subject,
    htmlContent: htmlContent
  };

  if (replyToEmail) {
    payload.replyTo = { email: replyToEmail };
  }

  try {
    const response = await fetch(brevoApiUrl, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[BREVO API ERROR]", data);
      throw new Error(data.message || `Brevo API returned status ${response.status}`);
    }

    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("[BREVO FETCH ERROR]", error.message);
    throw error;
  }
};

const sendBookingEmail = async (bookingData) => {
  const { full_name, phone_number, service_type, booking_date, booking_time, address, message } = bookingData;

  const subject = `New NexaClean Booking - ${full_name}`;
  const html = `
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
  `;

  return sendEmail(subject, html);
};

const sendSubscriptionEmail = async (email) => {
  const subject = `New Newsletter Subscriber - ${email}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 500px;">
      <h2 style="color: #10B981; margin-bottom: 16px;">📬 New Newsletter Subscriber!</h2>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px;">
        <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email.trim()}</p>
        <p style="margin: 8px 0 0; font-size: 13px; color: #64748b;">Subscribed on: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;

  return sendEmail(subject, html, email);
};

const sendTestEmail = async () => {
  const subject = "NexaClean Backend Test Email (Brevo API)";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #10B981;">NexaClean Backend Test</h2>
      <p>This is a test email sent from the NexaClean production backend to verify Brevo API configuration.</p>
      <p>Sent at: <strong>${new Date().toLocaleString()}</strong></p>
    </div>
  `;

  return sendEmail(subject, html);
};

module.exports = {
  sendBookingEmail,
  sendSubscriptionEmail,
  sendTestEmail
};
