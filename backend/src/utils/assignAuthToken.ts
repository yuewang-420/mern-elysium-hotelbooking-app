import { Response } from 'express'
import jwt from 'jsonwebtoken'

const assignAuthToken = (res: Response, userId: string): void => {
  // Generate token
  const authToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  })

  // Assign token to cookie
  res.cookie('authToken', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
}

export default assignAuthToken
