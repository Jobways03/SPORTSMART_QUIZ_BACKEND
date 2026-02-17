import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendResetEmail(to, token) {
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER, // recommended
    to,
    subject: "Reset your password",
    html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
  </head>

  <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#111827;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;">
      Reset your password using the secure link (valid for 15 minutes).
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6; padding:24px 0;">
      <tr>
        <td align="center" style="padding:0 12px;">

          <!-- Container -->
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
            style="width:100%; max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="padding:22px 24px; background:#0f172a;">
                <div style="font-size:16px; font-weight:700; color:#ffffff; letter-spacing:0.2px;">
                  Password Reset
                </div>
                <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">
                  Secure link valid for 15 minutes
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:26px 24px 10px 24px;">
                <div style="font-size:18px; font-weight:700; color:#111827; margin:0 0 10px 0;">
                  Reset your password
                </div>

                <div style="font-size:14px; line-height:22px; color:#374151; margin:0 0 14px 0;">
                  We received a request to reset the password for your account. Click the button below to choose a new password.
                </div>

                <!-- Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:18px 0 16px 0;">
                  <tr>
                    <td align="center" style="border-radius:10px;" bgcolor="#2563eb">
                      <a href="${link}"
                        style="display:inline-block; padding:12px 18px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <div style="font-size:13px; line-height:20px; color:#6b7280; margin:0 0 10px 0;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </div>

                <div style="word-break:break-all; font-size:12px; line-height:18px; color:#2563eb; background:#eff6ff; border:1px solid #dbeafe; padding:12px; border-radius:10px;">
                  <a href="${link}" style="color:#2563eb; text-decoration:none;">${link}</a>
                </div>

                <div style="font-size:13px; line-height:20px; color:#6b7280; margin:16px 0 0 0;">
                  This link will expire in <strong style="color:#111827;">15 minutes</strong> for your security.
                </div>

                <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />

                <div style="font-size:13px; line-height:20px; color:#6b7280;">
                  If you didn’t request a password reset, you can safely ignore this email.
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px 22px 24px; background:#fafafa;">
                <div style="font-size:12px; line-height:18px; color:#9ca3af;">
                  © ${new Date().getFullYear()} ${process.env.APP_NAME || "Your App"}. All rights reserved.
                </div>
              </td>
            </tr>

          </table>
          <!-- /Container -->

          <!-- Small footer note -->
          <div style="max-width:600px; font-size:11px; line-height:16px; color:#9ca3af; margin-top:12px; padding:0 6px;">
            This is an automated email. Please don’t reply to this message.
          </div>

        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });
}
