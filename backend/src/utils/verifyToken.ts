import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import 'dotenv/config'

type TokenValidationResult = {
  isValid: boolean
  isExpired?: boolean
  payload?: JwtPayload
}

const verifyToken = (token: string): TokenValidationResult => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string, {
      ignoreExpiration: true,
    }) as JwtPayload

    const isExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : false
    return {
      isValid: true,
      isExpired,
      payload: decoded,
    }
  } catch (err) {
    return {
      isValid: false,
    }
  }
}

export default verifyToken
