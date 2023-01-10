const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    //service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    // secure: true, // true for 465, false for other ports
    // secureConnection: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
