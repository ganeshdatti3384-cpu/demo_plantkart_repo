import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  console.log(`[AUTH] OTP for ${email}: ${otp}`);

  // If SMTP is not configured, just log to console and return (for development)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('[AUTH] SMTP not configured, skipping email delivery.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@support-platform.com',
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[AUTH] Nodemailer Error:`, error);
    throw error; // Rethrow to be caught by the route handler
  }
}

export async function sendEmail({ to, subject, text, html }: { to: string, subject: string, text?: string, html?: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] Body: ${text || html}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@support-platform.com',
      to,
      subject,
      text,
      html
    });
    console.log(`[EMAIL] Sent to ${to}`);
  } catch (error) {
    console.error(`[EMAIL] Error:`, error);
  }
}
