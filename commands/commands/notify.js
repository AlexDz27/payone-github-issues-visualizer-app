/*
  Purpose of this code: notify people from 'notifications-recipients.json' file about the current state of our issues.
  Currently, notification happens via email.
*/

const { ROOT_PATH, DATA_PATH } = require('../../globals')
require('dotenv').config({ path: ROOT_PATH + '/commands/.env' })
const { EMAIL_TRANSPORT_USER, EMAIL_TRANSPORT_PASSWORD, EMAIL_APP_URL } = process.env

const fs = require('fs')
const nodemailer = require('nodemailer');

(async () => {
  let notificationsRecipients = JSON.parse(fs.readFileSync(DATA_PATH + '/notifications-recipients.json'))
  notificationsRecipients = notificationsRecipients.map(recipient => recipient.email)
  const generalData = JSON.parse(fs.readFileSync(DATA_PATH + '/latest/general_data.json'))

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_TRANSPORT_USER,
      pass: EMAIL_TRANSPORT_PASSWORD
    }
  })
  const info = await transporter.sendMail({
    from: '"PAYONE docs Google account" <payonedocs@gmail.com>',
    to: notificationsRecipients,
    subject: "We have " + generalData.stale_issues_total + " stale issues [PAYONE GitHub issues notification]",
    html: `
      <p>This is a weekly notification informing you about the current issues we have in our PAYONE GitHub account.</p>
      <p>We've got:</p>
      <ul>
        <li>${generalData.issues_total} issues in total</li>
        <li>${generalData.stale_issues_total} stale [*1] issues in total</li>
      </ul>

      <p>You can check <a href="${EMAIL_APP_URL}">this page</a> to view the issues</p>

      <small>*1 - 'stale' means that we haven’t responded to an issue for more than 4 weeks</small>
    `,
  })
  console.log("Message sent: %s", info.messageId);
})()