// OTP Verification Email
export const otpEmailTemplate = (name: string, otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Verify Your Account</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #1a5c38;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
          }
          .body {
            padding: 40px 30px;
            color: #333333;
          }
          .body p {
            font-size: 16px;
            line-height: 1.6;
          }
          .otp-box {
            background-color: #f0f7f4;
            border: 2px dashed #1a5c38;
            border-radius: 8px;
            text-align: center;
            padding: 20px;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #1a5c38;
            letter-spacing: 10px;
          }
          .expiry {
            font-size: 14px;
            color: #888888;
            margin-top: 8px;
          }
          .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #999999;
          }
          .warning {
            background-color: #fff8e1;
            border-left: 4px solid #f9a825;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 14px;
            color: #555;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽️ Chuks Kitchen</h1>
          </div>
          <div class="body">
            <p>Hi <strong>${name}</strong>,</p>
            <p>
              Welcome to Chuks Kitchen! We're excited to have you on board.
              Use the OTP below to verify your account and start ordering
              your favourite meals.
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="expiry">This OTP expires in 10 minutes</div>
            </div>
            <div class="warning">
              ⚠️ Do not share this OTP with anyone. Chuks Kitchen will
              never ask for your OTP.
            </div>
            <p>
              If you did not create an account with us, please ignore
              this email.
            </p>
            <p>With love,<br/><strong>The Chuks Kitchen Team 🚀</strong></p>
          </div>
          <div class="footer">
            &copy; 2025 Chuks Kitchen. All rights reserved.<br/>
            Powered by Trueminds Innovations Ltd
          </div>
        </div>
      </body>
    </html>
  `;
};

// Resend OTP Email
export const resendOTPEmailTemplate = (name: string, otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; }
          .container { max-width: 600px; margin: 40px auto; background: #fff;
            border-radius: 8px; overflow: hidden; }
          .header { background: #1a5c38; padding: 30px; text-align: center; }
          .header h1 { color: #fff; margin: 0; }
          .body { padding: 40px 30px; color: #333; }
          .otp-box { background: #f0f7f4; border: 2px dashed #1a5c38;
            border-radius: 8px; text-align: center; padding: 20px; margin: 30px 0; }
          .otp-code { font-size: 42px; font-weight: bold;
            color: #1a5c38; letter-spacing: 10px; }
          .footer { background: #f4f4f4; text-align: center;
            padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>🍽️ Chuks Kitchen</h1></div>
          <div class="body">
            <p>Hi <strong>${name}</strong>,</p>
            <p>You requested a new OTP. Here it is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="color:#888; font-size:14px;">Expires in 10 minutes</p>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p>The Chuks Kitchen Team 🚀</p>
          </div>
          <div class="footer">
            &copy; 2025 Chuks Kitchen. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};