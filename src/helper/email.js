import nodemailer from "nodemailer";
import "dotenv/config";
const from =  '"Authentication System" <kajalbharti990@gmail.com>';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendResetEmail(email, subject, htmlContent) {
  try {
    const mailOptions = {
      from: from,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export { sendResetEmail };
