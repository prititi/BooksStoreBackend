import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Please verify your email address",
    text: `Click the following link to verify your email address: ${verificationUrl}`,
    html: `<p>Click the following link to verify your email address: <a href="${verificationUrl}">Verify Email</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `http://your-frontend-url.com/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>To reset your password, please click the link below:</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>
           <p>This link will expire in 1 hour.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send email.");
  }
};
