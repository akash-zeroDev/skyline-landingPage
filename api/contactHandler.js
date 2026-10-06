import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Automatically load .env if not loaded by parent process
function loadLocalEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1];
          let value = (match[2] || '').trim();
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value;
        }
      });
    }
  } catch {
    // Ignore fallback errors
  }
}
loadLocalEnv();

let etherealAccount = null;

/**
 * Handle contact form submission and deliver email via Nodemailer.
 * Supports production SMTP credentials (Gmail, Resend) or automatic Ethereal test fallback.
 */
export async function handleContactSubmission(data) {
  loadLocalEnv();
  const { name, email, company, services = [], budget, timeline, message } = data || {};

  // Basic validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { status: 400, body: { error: 'Please enter your name (minimum 2 characters).' } };
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { status: 400, body: { error: 'Please enter a valid email address.' } };
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return { status: 400, body: { error: 'Please provide some project details (minimum 10 characters).' } };
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanCompany = company ? company.trim() : 'Not specified';
  const cleanBudget = budget || 'Not specified';
  const cleanTimeline = timeline || 'Not specified';
  const cleanServices = Array.isArray(services) && services.length > 0 ? services : ['None specified'];
  const cleanMessage = message.trim();

  let transporter;
  let isEthereal = false;

  // Check if real SMTP credentials or Resend API key are provided in environment
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  const hasResendConfig = Boolean(process.env.RESEND_API_KEY);

  if (hasSmtpConfig) {
    const isPort465 = Number(process.env.SMTP_PORT) === 465;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: isPort465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else if (hasResendConfig) {
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
  } else {
    // Development fallback: automatic Ethereal test mailbox
    isEthereal = true;
    if (!etherealAccount) {
      etherealAccount = await nodemailer.createTestAccount();
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
    });
  }

  const recipientEmail =
    process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'akashkumar7653099@gmail.com';
  const senderEmail = process.env.SMTP_USER
    ? `"Skyline Digital Media" <${process.env.SMTP_USER}>`
    : (hasResendConfig ? 'Skyline Digital <onboarding@resend.dev>' : `Skyline Digital Inquiries <${cleanEmail}>`);

  // HTML Email Template matching Skyline's design
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F3F3; margin: 0; padding: 24px; color: #111A5C; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E4E9; overflow: hidden; box-shadow: 0 10px 30px rgba(17, 26, 92, 0.05); }
          .header { background: #111A5C; padding: 24px 32px; color: #FFFFFF; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
          .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
          .body { padding: 32px; }
          .badge { display: inline-block; background: #EEF2FF; color: #111A5C; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 2px 4px 2px 0; border: 1px solid #D7DDFC; }
          .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .grid td { padding: 10px 0; border-bottom: 1px solid #F0F0F3; vertical-align: top; }
          .grid td.label { width: 35%; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b6b80; font-weight: 600; }
          .grid td.val { font-size: 15px; font-weight: 500; color: #111A5C; }
          .message-box { background: #FAFAFC; border: 1px solid #E5E7EB; border-radius: 10px; padding: 18px; margin-top: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #1F2937; }
          .footer { padding: 20px 32px; background: #FAFAFB; border-top: 1px solid #E2E4E9; font-size: 12px; color: #8F91A2; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Project Inquiry</h1>
            <p>Skyline Digital Media Contact Form</p>
          </div>
          <div class="body">
            <table class="grid">
              <tr>
                <td class="label">Client Name</td>
                <td class="val">${cleanName}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="val"><a href="mailto:${cleanEmail}" style="color: #111A5C; text-decoration: underline;">${cleanEmail}</a></td>
              </tr>
              <tr>
                <td class="label">Company / Org</td>
                <td class="val">${cleanCompany}</td>
              </tr>
              <tr>
                <td class="label">Budget Range</td>
                <td class="val"><strong>${cleanBudget}</strong></td>
              </tr>
              <tr>
                <td class="label">Timeline</td>
                <td class="val"><strong>${cleanTimeline}</strong></td>
              </tr>
              <tr>
                <td class="label">Services Needed</td>
                <td class="val">
                  ${cleanServices.map((s) => `<span class="badge">${s}</span>`).join('')}
                </td>
              </tr>
            </table>

            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b6b80; font-weight: 600; margin-top: 16px;">
              Project Details
            </div>
            <div class="message-box">
              ${cleanMessage}
            </div>
          </div>
          <div class="footer">
            Submitted via Skyline Digital Media Website • ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
NEW PROJECT INQUIRY — SKYLINE DIGITAL MEDIA
-------------------------------------------
Name: ${cleanName}
Email: ${cleanEmail}
Company: ${cleanCompany}
Budget: ${cleanBudget}
Timeline: ${cleanTimeline}
Services: ${cleanServices.join(', ')}

PROJECT DETAILS:
${cleanMessage}

Submitted: ${new Date().toLocaleString()}
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: senderEmail,
      to: recipientEmail,
      replyTo: cleanEmail,
      subject: `🚀 New Project Inquiry from ${cleanName}${company ? ` (${cleanCompany})` : ''}`,
      text: textContent,
      html: htmlContent,
    });

    let previewUrl = null;
    if (isEthereal) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n======================================================');
      console.log('📧 [Skyline Contact API] Test Email Sent via Ethereal!');
      console.log(`🔗 Preview URL: ${previewUrl}`);
      console.log('======================================================\n');
    } else {
      console.log(`\n📧 [Skyline Contact API] Live Email Delivered to ${recipientEmail} (ID: ${info.messageId})\n`);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Thank you! We've received your inquiry and will review it within 24 hours.",
        previewUrl,
      },
    };
  } catch (err) {
    console.error('📧 [Skyline Contact API] Error sending email:', err);
    return {
      status: 500,
      body: {
        error: 'Failed to send inquiry email. Please try again or email us directly.',
        details: err.message,
      },
    };
  }
}
