import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

transporter.verify((error) => {
  if (error) {
    console.error("Email service is not ready", error.message);
  } else {
    console.log("Email service is ready to send messages ✅");
  }
});

export default transporter;