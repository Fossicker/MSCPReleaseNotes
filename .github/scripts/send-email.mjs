import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'davidgoldmann2@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

(async () => {
  const copilotResponse = process.env.COPILOT_RESPONSE || '(keine Antwort erhalten)';
  const email = 'davidgoldmann2@gmail.com';

  try {
    await transporter.sendMail({
      from: '"Daily Summary | Copilot" <davidgoldmann2@gmail.com>',
      to: email,
      subject: 'Daily Copilot Summary',
      html: `<pre>${copilotResponse}</pre>`,
    });
  } catch (error) {
    console.error(error);
  }
})();