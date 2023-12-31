import nodemailer, { SentMessageInfo } from 'nodemailer';
import { env } from '../env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

export type sendMailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendMail = (
  options: sendMailOptions,
): Promise<SentMessageInfo> => {
  return transporter
    .sendMail({
      from: `"Bas & Jessie" <${env.SMTP_SENDER}>`,
      ...options,
    })
    .then((info) => {
      if (env.NODE_ENV === 'development') {
        console.info(
          `Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(info)}`,
        );
        console.log(info);
      }
      return info;
    });
};

export const sendRSVPMail = (options: { id: string; email: string }) => {
  return sendMail({
    to: options.email,
    subject: 'RSVP bruiloft van Bas & Jessie is ontvangen',
    text: `Bedankt!
    
We hebben jouw RSVP ontvangen.
Mocht je deze willen wijzigen dan kan dat via onderstaande link
https://www.basenjessie.nl/rsvp?id=${options.id}`,
    html: `<span>Bedankt!<span>
<br />
<span>We hebben jouw RSVP ontvangen.<span>
<span>Mocht je deze willen wijzigen dan kan dat via onderstaande link<span>
<a href="https://www.basenjessie.nl/rsvp?rsvp=${options.id}">https://www.basenjessie.nl/rsvp?id=${options.id}</a>`,
  });
};
