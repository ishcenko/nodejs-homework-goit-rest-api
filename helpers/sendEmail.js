const nodemailer = require("nodemailer");
require("dotenv").config();
const { MAIL_PASSWORD, EMAIL_USER, EMAIL_HOST, EMAIL_PORT } = process.env;

const nodemailerConfig = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: MAIL_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (email) =>
  transport
    .sendMail(email)
    .then(() => console.log("Email sent successfully"))
    .catch((err) => console.log(err.message));

module.exports = sendEmail;
