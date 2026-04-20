const nodeMailer = require('nodemailer')
const config = require("./../config")

const listemail = [
	`noreply@${config.DOMAIN.replace('https://', '')}`, `no-reply@${config.DOMAIN.replace('https://', '')}`
];

const adminEmail = config.MAIL_USERNAME
const adminPassword = config.MAIL_PASSWORD
const sendMail = (to, subject, htmlContent) => {
  const rd = Math.floor(Math.random() * 2);
  const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })
  const options = {
    from: `${config.TITLE_SITE} <${listemail[rd]}>`,
    to: to,
    subject: subject,
    html: htmlContent,
  }
  return transporter.sendMail(options)
}
module.exports = {
  sendMail
}