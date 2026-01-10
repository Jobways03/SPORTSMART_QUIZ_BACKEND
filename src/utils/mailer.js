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
    to,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${link}">Click here to reset password</a></p>
      <p>Valid for 15 minutes.</p>
    `,
  });
}
