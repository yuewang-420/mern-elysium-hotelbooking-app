import { check, ValidationChain, validationResult } from 'express-validator'
import { Request } from 'express'

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/

const alphaRegex = /^[A-Za-z]+$/

type ValidationFunctions = {
  [key: string]: ValidationChain
}

const userRouteValidations: ValidationFunctions = {
  // Register, Auth
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
  // Verify email, reset password
  token: check('token', 'A valid token is required.').notEmpty(),
  otp: check('otp', 'A valid otp is required.').isString().notEmpty(),
}

const myHotelValidations: ValidationFunctions = {
  hotelId: check('hotelId', 'Hotel id is required.')
    .isString()
    .notEmpty()
    .trim(),
  // My hotels
  name: check('name', 'Name is required.')
    .isString()
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.')
    .trim(),
  description: check('description', 'Description is required.')
    .isString()
    .notEmpty()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters.')
    .trim(),
  type: check('type', 'Hotel type is required').isString().notEmpty().trim(),
  adultCount: check('adultCount', 'Adult count is required.')
    .isInt({ min: 1 })
    .withMessage('Adult count must be an integer greater than 1.')
    .notEmpty()
    .trim(),
  childCount: check('childCount', 'Child count is required.')
    .isInt({ min: 0 })
    .withMessage('Child count must be a non-negative integer.')
    .notEmpty()
    .trim(),
  starRating: check('starRating', 'Star rating count is required.')
    .isInt({ min: 1, max: 5 })
    .withMessage('Star rating must be between 1 and 5.')
    .notEmpty()
    .trim(),
  pricePerNight: check('pricePerNight', 'A valid price per night is required.')
    .isNumeric()
    .notEmpty()
    .isFloat({ min: 1, max: 10000 })
    .withMessage('Price per night must be between 1 and 10000.')
    .trim(),
  facilities: check('facilities', 'Facilities are required.')
    .isArray()
    .notEmpty(),
  // Address fields
  roomNumber: check('roomNumber', 'Room number is required.')
    .isInt({ min: 0 })
    .withMessage('Room number must be a non-negative integer.')
    .notEmpty()
    .trim(),
  streetAddress: check('streetAddress', 'Street address is required.')
    .isString()
    .notEmpty()
    .trim(),
  city: check('city', 'City is required.').isString().notEmpty().trim(),
  country: check('country', 'Country is required.')
    .isString()
    .notEmpty()
    .trim(),
  // Optional imageUrls
  imageUrls: check('imageUrls')
    .optional()
    .custom((value) => {
      if (typeof value === 'string' && value === 'EMPTY_ARRAY') {
        return true
      } else if (Array.isArray(value)) {
        value.forEach((url) => {
          if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)) {
            throw new Error('Invalid image URL format.')
          }
        })
        return true
      } else {
        throw new Error(
          'Image URLs must be an array of image URL or  string of "EMPTY_ARRAY".'
        )
      }
    }),
}

/**
 * Utility function to validate user routes request body fields based on allowed keys.
 * @param req The Express request object.
 * @param allowedKeys The allowed keys for the request body.
 */
const validateUserRouteFields = async (req: Request, allowedKeys: string[]) => {
  const undefinedFields: string[] = []
  allowedKeys.forEach((key) => {
    if (!userRouteValidations[key]) {
      undefinedFields.push(key)
    }
  })

  if (undefinedFields.length > 0) {
    throw new Error(
      `Validation for field ${undefinedFields.join(', ')} not defined.`
    )
  } else {
    await Promise.all(
      allowedKeys.map((key) => userRouteValidations[key].run(req))
    )

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errors.array().map((errItem) => errItem.msg)
    } else {
      return []
    }
  }
}

/**
 * Utility function to validate my hotel routes request body fields based on allowed keys.
 * @param req The Express request object.
 * @param allowedKeys The allowed keys for the request body.
 */
const validateMyHotelRouteFields = async (
  req: Request,
  allowedKeys: string[]
) => {
  const undefinedFields: string[] = []
  allowedKeys.forEach((key) => {
    if (!myHotelValidations[key]) {
      undefinedFields.push(key)
    }
  })

  if (undefinedFields.length > 0) {
    throw new Error(
      `Validation for field ${undefinedFields.join(', ')} not defined.`
    )
  } else {
    await Promise.all(
      allowedKeys.map((key) => myHotelValidations[key].run(req))
    )

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errors.array().map((errItem) => errItem.msg)
    } else {
      return []
    }
  }
}

export { validateUserRouteFields, validateMyHotelRouteFields }
