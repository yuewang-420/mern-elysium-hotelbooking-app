import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

// TypeScript definition for the emailToken object
export type EmailTokenType = {
  email: string
  otp: string
  createdAt: Date
  expiresAt: Date
}

// Mongoose schema for the  emailToken object
const emailTokenSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
})

// Encrypt the otp
emailTokenSchema.pre('save', async function (next) {
  if (this.isModified('otp')) {
    const hashedOTP = await bcrypt.hash(this.otp, 10)
    this.otp = hashedOTP
  }

  // Convert email to lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase()
  }

  next()
})

// Mongoose model for the email token object
const EmailToken: Model<EmailTokenType> = mongoose.model<EmailTokenType>(
  'EmailToken',
  emailTokenSchema
)

export default EmailToken
