import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import capitalize from '../utils/capitalizeInput'

// TypeScript definition for the User object
export type UserType = {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  verified: boolean
} & Document

// Mongoose schema for the User object
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  verified: { type: Boolean, default: false },
})

// Encrypt the password, modify the capitlization
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
  }

  // Convert email to lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase()
  }

  // Modify the capitlization of first name and last name
  if (this.isModified('firstName')) {
    this.firstName = capitalize(this.firstName)
  }

  if (this.isModified('lastName')) {
    this.lastName = capitalize(this.lastName)
  }

  next()
})

// Mongoose model for the User object
const User: Model<UserType> = mongoose.model<UserType>('User', userSchema)

export default User
