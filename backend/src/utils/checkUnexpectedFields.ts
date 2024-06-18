import { Request } from 'express'

/**
 * Utility function to check for unexpected fields in the request body.
 * @param req The Express request object.
 * @param allowedKeys The allowed keys for the request body.
 */
const checkUnexpectedFields = (req: Request, allowedKeys: string[]) => {
  // Get keys in req.body that are not in allowedKeys
  const extraKeys = Object.keys(req.body).filter(
    (key) => !allowedKeys.includes(key)
  )

  // Get keys in allowedKeys that are not in req.body
  const missingKeys = allowedKeys.filter(
    (key) => !Object.keys(req.body).includes(key)
  )

  // Build error message
  let errorMessage = []
  if (missingKeys.length > 0) {
    errorMessage.push(
      `Missing field in request body: ${missingKeys.join(', ')}`
    )
  }
  if (extraKeys.length > 0) {
    errorMessage.push(
      `Unexpected field in request body: ${extraKeys.join(', ')}`
    )
  }

  // If there are missing or extra keys, return a 400 error
  if (errorMessage.length !== 0) {
    return errorMessage
  } else {
    return []
  }
}

export default checkUnexpectedFields
