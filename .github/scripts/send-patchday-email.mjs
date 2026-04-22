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
  const email = 'david.goldmann@drv-bund.de';

  const htmlBody = copilotResponse
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  try {
    await transporter.sendMail({
      from: '"Patchday Analysis | Copilot" <davidgoldmann2@gmail.com>',
      to: email,
      subject: 'Microsoft Patchday Analyse \u2013 Windows 11 24H2, Edge & WebView2',
      html: `<meta charset="utf-8"><p>${htmlBody}</p>`,
    });
    console.log('E-Mail erfolgreich versendet.');
  } catch (error) {
    console.error('Fehler beim Versenden:', error.message || error);
  }
})();
