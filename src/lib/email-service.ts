import nodemailer from "nodemailer";

interface AttachmentProps {
  file: string;
  fileName: string;
  fileType: string;
}
interface EmailProps {
  to: string;
  type: string;
  htmlContent: string;
  attachments?: AttachmentProps[];
}

export const sendMail = ({
  to,
  type,
  htmlContent,
  attachments = [],
}: EmailProps) => {
    try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "snehthakkar19@gmail.com",
        pass: "hozh mzcb mduq istm",
      },
    });

    const mailOptions = {
      from: "snehthakkar19@gmail.com",
      to,
      subject: "OTP For Login",
      text: "That was easy!",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error",error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};
