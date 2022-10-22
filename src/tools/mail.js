import nodemailer from 'nodemailer';
import { htmlResponseVerificationEmail } from './htmlResponseGenerator.js';

export const sendEmailVerificationMail = (email, url) => (name)=>{
  const mailer = nodemailer.createTransport(
    {
    
      host: process.env.smartbrain_mail_host,
      port: 587,
      secure: false,
      auth: {
        user: process.env.smartbrain_mail_user,
        pass: process.env.smartbrain_mail_password,
      },
    }
  );

  mailer.sendMail({
    from: '"SmartBrain" <auth@smartbrain.vrkcreations.in>', // sender address
    to: email, // list of receivers
    subject: "Email Verification", // Subject line
    html: htmlResponseVerificationEmail(name,url), // html body
  }).then(res => {
    console.log(res.accepted);
  })
    .catch(err => {
      console.log('sendemailverification-err', err);
    });




}
