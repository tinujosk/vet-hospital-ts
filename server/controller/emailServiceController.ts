import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordEmail = async (email, password) => {
  const htmlFilePath = path.join(
    __dirname,
    '..',
    'templates',
    'userCreationEmail.html'
  );
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  const emailHtml = htmlContent
    .replace('{{email}}', email || 'Customer')
    .replace('{{password}}', password || 'Password Generation Issue');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your New Account Password',
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
    console.log('Password email sent successfully');
  } catch (error) {
    console.error('Error sending password email:', error);
    return { success: false, error: error.message };
  }
};

export const sendResetEmail = async (email, resetLink) => {
  const htmlFilePath = path.join(
    __dirname,
    '..',
    'templates',
    'forgotPasswordEmail.html'
  );
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

  const emailHtml = htmlContent
    .replace('{{email}}', email || 'Customer')
    .replace('{{resetLink}}', resetLink || 'Link Generation Issue');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return { success: true };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error };
  }
};
