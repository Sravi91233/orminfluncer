import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendOtpEmailParams {
  to: string;
  otp: string;
}

export async function sendOtpEmail({ to, otp }: SendOtpEmailParams) {
  const mailOptions = {
    from: `"Influencer Finder" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${otp}. It is valid for 10 minutes.`,
    html: `<b>Your verification code is: ${otp}</b><p>It is valid for 10 minutes.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send verification email.");
  }
}
