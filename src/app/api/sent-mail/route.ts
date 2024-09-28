import nodemailer from "nodemailer";

export async function POST(req: Request) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "snehthakkar19@gmail.com",
      pass: "hozh mzcb mduq istm",
    },
  });

  var mailOptions = {
    from: "snehthakkar19@gmail.com",
    to:"snehthakkar2222@gmail.com",
    subject: "OTP For Login",
    text: "That was easy!",
    html: "<h1>Hello World</h1>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return Response.json({ message: "Email not sent" });
    } else {
      console.log("Email sent: " + info.response);
      return Response.json({ message: "Email sent" });
    }
  });
}
