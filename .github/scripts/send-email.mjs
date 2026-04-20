import nodemailer from 'nodemailer';
import fs from 'fs';
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

  const attachments = [];
  if (fs.existsSync('releasenotes.csv')) {
    attachments.push({
      filename: 'releasenotes.csv',
      path: 'releasenotes.csv',
      contentType: 'text/csv',
    });
  }

  try {
    await transporter.sendMail({
      from: '"Daily Summary | Copilot" <davidgoldmann2@gmail.com>',
      to: email,
      subject: 'Daily Copilot Summary – Releasenotes',
      html: `<p>Die generierten Releasenotes sind als CSV-Datei angehängt.</p>`,
      attachments,
    });
  } catch (error) {
    console.error(error);
  }
})();
