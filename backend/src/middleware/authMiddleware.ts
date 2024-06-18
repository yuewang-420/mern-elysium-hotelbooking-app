import { Request, Response, NextFunction } from 'express'
import { verify, JwtPayload } from 'jsonwebtoken'
import User from '../models/userModel'

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.cookies?.authToken
  // Have token
  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET_KEY as string)

      const user = await User.findById((decoded as JwtPayload).userId).select(
        '-password'
      )

      // User not exists
      if (!user) {
        return res.status(401).json({ message: 'No user found.' })
      }

      req.userId = (decoded as JwtPayload).userId
      next()
    } catch (err) {
      // Invaid token, cannot be verified
      res.status(401).json({ message: 'Not authorized, invalid token.' })
    }
  } else {
    // Token not exists
    res.status(401).json({ message: 'Not authorized, no token provided.' })
  }
}

export default verifyToken
