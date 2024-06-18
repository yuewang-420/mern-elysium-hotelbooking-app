import { check, ValidationChain, validationResult } from 'express-validator'
import { Request } from 'express'

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/

const alphaRegex = /^[A-Za-z]+$/

type ValidationFunctions = {
  [key: string]: ValidationChain
}

const validations: ValidationFunctions = {
  email: check('email', 'A valid email address is required.').isEmail().trim(),
  password: check('password', 'Password must be a string.')
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters long.')
    .matches(passwordRegex)
    .withMessage(
      'Password must contain at least one lowercase, uppercase, number, special character (!@#$%^&*).'
    )
    .trim(),
  prevPassword: check('prevPassword', 'Password must be a string.')
    .isString()
    .notEmpty(),
  firstName: check('firstName', 'A valid first name is required.')
    .isString()
    .matches(alphaRegex)
    .withMessage('First name must contain only English letters.')
    .isLength({ min: 2, max: 20 })
    .withMessage('First name must be between 2 and 20 characters.')
    .trim(),
  lastName: check('lastName', 'A valid last name is required.')
    .isString()
    .matches(alphaRegex)
    .withMessage('Last name must contain only English letters.')
    .isLength({ min: 2, max: 20 })
    .withMessage('Last name must be between 2 and 20 characters.')
    .trim(),
  token: check('token', 'A valid token is required.').notEmpty(),
  otp: check('otp', 'A valid otp is required.').isString().notEmpty(),
}

/**
 * Utility function to validate request body fields based on allowed keys.
 * @param req The Express request object.
 * @param allowedKeys The allowed keys for the request body.
 */
const validateFields = async (req: Request, allowedKeys: string[]) => {
  const undefinedFields: string[] = []
  allowedKeys.forEach((key) => {
    if (!validations[key]) {
      undefinedFields.push(key)
    }
  })

  if (undefinedFields.length > 0) {
    throw new Error(
      `Validation for field ${undefinedFields.join(', ')} not defined.`
    )
  } else {
    await Promise.all(allowedKeys.map((key) => validations[key].run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errors.array().map((errItem) => errItem.msg)
    } else {
      return []
    }
  }
}

export default validateFields
