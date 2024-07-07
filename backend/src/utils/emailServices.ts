import nodemailer from 'nodemailer'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendVerifyEmail = async (
  firstName: string,
  link: string,
  email: string
): Promise<void> => {
  try {
    const templatePath = path.join(
      __dirname,
      'emailTemplates',
      'emailVerifyTemplate.ejs'
    )
    const verifyEmailTemplate: string = await fs.promises.readFile(
      templatePath,
      'utf8'
    )

    const renderedTemplate = ejs.render(verifyEmailTemplate, {
      name: firstName,
      verificationLink: link,
    })

    const mailOptions = {
      from: {
        name: 'Elysium Official',
        address: process.env.EMAIL_USERNAME as string,
      },
      to: email,
      subject: "Welcome to Elysium! Here's Your Account Verification Link.",
      html: renderedTemplate,
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error('Error sending verification email:', err)
    throw new Error('Failed to send verification email')
  }
}

export const sendResetPasswordEmail = async (
  firstName: string,
  link: string,
  email: string
): Promise<void> => {
  try {
    const templatePath = path.join(
      __dirname,
      'emailTemplates',
      'passwordResetTemplate.ejs'
    )
    const passwordResetTemplate: string = await fs.promises.readFile(
      templatePath,
      'utf8'
    )

    const renderedTemplate = ejs.render(passwordResetTemplate, {
      name: firstName,
      resetPasswordLink: link,
    })

    const mailOptions = {
      from: {
        name: 'Elysium Official',
        address: process.env.EMAIL_USERNAME as string,
      },
      to: email,
      subject: 'Elysium Password Reset Request',
      html: renderedTemplate,
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error('Error sending password reset email:', err)
    throw new Error('Failed to send password reset email')
  }
}

export const sendFeedbackEmail = async (
  firstName: string,
  feedback: string,
  email: string,
  sendCopy: boolean
): Promise<void> => {
  try {
    const templatePath = path.join(
      __dirname,
      'emailTemplates',
      'feedbackTemplate.ejs'
    )
    const feedbackTemplate: string = await fs.promises.readFile(
      templatePath,
      'utf8'
    )

    const renderedTemplate = ejs.render(feedbackTemplate, {
      name: firstName,
      feedback,
    })

    // Send feedback to admin
    const adminMailOptions = {
      from: {
        name: 'Elysium Official',
        address: process.env.EMAIL_USERNAME as string,
      },
      to: process.env.EMAIL_USERNAME as string,
      subject: `User Feedback from ${firstName}`,
      html: renderedTemplate,
    }

    if (sendCopy) {
      // Send a copy of feedback to the user
      const userMailOptions = {
        from: {
          name: 'Elysium Official',
          address: process.env.EMAIL_USERNAME as string,
        },
        to: email,
        subject: 'Copy of Your Feedback',
        html: renderedTemplate,
      }

      await transporter.sendMail(userMailOptions)
    }
  } catch (err) {
    throw new Error('Failed to send feedback email')
  }
}
