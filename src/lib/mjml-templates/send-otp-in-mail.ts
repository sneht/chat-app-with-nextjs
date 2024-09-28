export const SendOtpInMailTemplate = ({
  user_name,
  link,
}: {
  user_name: string;
  link: string;
}) => {
  try {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{EMAIL_SUBJECT}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo {
            max-width: 150px;
            height: auto;
        }
        h1 {
            color: #128C7E;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #128C7E;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{LOGO_URL}}" alt=" Chat App With Next.js Logo" class="logo">
            <h1>Verify Email for continue to chat with Friends</h1>
        </div>
        <div class="content">
            <p>Hello ${user_name},</p>
            <p>Thank you for signing up for Chat App With Next js. To complete your registration and start using our service, please verify your email address by clicking the button below</p>
            <p style="text-align: center;">
                <a href="${link}" class="button">Verify Email Address</a>
            </p>
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>This verification link will expire in 24 hours. If you need a new verification link, please visit our website and request a new one.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Chat App With Next.js. All rights reserved.</p>
            <p>If you have any questions, please contact our support team at snehthakkar19@gmail.com</p>
        </div>
    </div>
</body>
</html>`;
  } catch (error) {
    return "";
  }
};
