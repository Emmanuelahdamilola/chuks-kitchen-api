import { config } from "@/config";
import transporter from "@/config/email";
import { otpEmailTemplate, resendOTPEmailTemplate } from "./emailTemplates";


export const sendOTPEmail = async (
    name: string,
    email: string,
    otp: string
): Promise<void> => {
   const mailOptions = {
    from: config.mailer.from,
    to: email,
    subject: "🍽️ Verify Your Chuks Kitchen Account",
    html: otpEmailTemplate(name, otp),
   }

  await transporter.sendMail(mailOptions);
  console.log(`OTP email sent to ${email}`);
}

// resend OTP email
export const sendResetPasswordEmail = async (
    name: string,
    email: string,
    otp: string
): Promise<void> => {
   const mailOptions = {
    from: config.mailer.from,
    to: email,
    subject: "🍽️ Your New Chuks Kitchen OTP",
    html: resendOTPEmailTemplate(name, otp),
   }

   await transporter.sendMail(mailOptions);
   console.log(`Resend OTP email sent to ${email}`);
}