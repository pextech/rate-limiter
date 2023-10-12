import * as nodemailer from 'nodemailer';
import { senderEmail, senderEmailPassword } from '../config';

export const emailService = async (
  to: string,
  subject: string,
  htmlTemplate: string
) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: senderEmailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: `${senderEmail}`,
    to: to,
    subject: subject,
    html: htmlTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Email could not be sent to ${to} \n ${error}`);
    }
    console.log('Message sent: %s', info.messageId);
  });
};
