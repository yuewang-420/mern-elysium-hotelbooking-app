import { Request, Response } from 'express'
import User from '../models/userModel'
import checkUnexpectedFields from '../utils/checkUnexpectedFields'
import { validateUserRouteFields } from '../utils/validateFields'
import assignAuthToken from '../utils/assignAuthToken'
import comparePassword from '../utils/comparePassword'
import EmailToken from '../models/emailTokenModel'
import generateOTP from '../utils/generateOTP'
import jwt, { JwtPayload } from 'jsonwebtoken'
import verifyToken from '../utils/verifyToken'
import { sendVerifyEmail, sendResetPasswordEmail } from '../utils/emailServices'
import bcrypt from 'bcryptjs'

const userRoutesAllowedKeys: { [key: string]: { [key: string]: string[] } } = {
  POST: {
    '/register': ['email', 'password', 'firstName', 'lastName'],
    '/email': ['email'],
    '/email/verify': ['token'],
    '/forgot-password': ['email'],
    '/reset-password': ['token'],
    '/auth': ['email', 'password'],
    '/auth/google': ['email', 'firstName', 'lastName'],
    '/logout': [],
  },
  GET: { '/profile': [] },
  PUT: {
    '/reset-password': ['email', 'prevPassword', 'otp', 'password'],
    '/profile': ['firstName', 'lastName'],
  },
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { email } = req.body

  try {
    // Check if the email already exists in the database
    let user = await User.findOne({ email: email.toLowerCase() })
    if (user) {
      return res.status(400).json({ message: 'The email has been registered.' })
    }

    // Register the user, then save registration data to db
    user = new User(req.body)
    await user.save()

    // // Assign token to cookie
    // assignAuthToken(res, user._id)

    return res.status(201).json({
      message: 'Your registration form is submitted successfully.',
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong, please try again later...',
    })
  }
}

// @desc    Send a verification email
// @route   POST /api/users/email
// @access  Public
export const sendVerificationEmail = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { email } = req.body

  try {
    // Check if the email already exists in the user database
    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // If not exists
      return res
        .status(404)
        .json({ message: 'This email has not been registered yet.' })
    } else if (user.verified === true) {
      // If exists and verified
      return res
        .status(403)
        .json({ message: 'Your account has been verified.' })
    }

    // User exists and not verified yet
    let emailToken = await EmailToken.findOne({ email: email.toLowerCase() })
    if (!emailToken || emailToken.expiresAt < new Date()) {
      // Delete old OTP if exists and is expired
      if (emailToken) {
        await emailToken.deleteOne({ email: email.toLowerCase() })
      }
      let newEmailToken = new EmailToken({
        email,
        otp: generateOTP(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      })

      await newEmailToken.save()

      const urlParam = jwt.sign(
        {
          email: newEmailToken.email,
          firstName: user.firstName,
          otp: newEmailToken.otp,
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '900s' }
      )

      await sendVerifyEmail(
        user.firstName,
        `${process.env.FRONTEND_URL}/user/verify-email/${urlParam}`,
        email
      )

      return res.status(201).json({
        message: 'Verification link has been sent to your email.',
      })
    } else {
      return res.status(409).json({
        message:
          'Verification link has been sent to your email. Please request another link in 15 minutes.',
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong, please try again later...',
    })
  }
}

// @desc    Verify a user's email
// @route   POST /api/users/email/verify
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { token } = req.body

  if (!token) {
    // Token not exists
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided.' })
  } else {
    const { isValid, isExpired, payload } = verifyToken(token)
    if (!isValid) {
      // If token is invalid or other errors occur, return invalid URL message
      return res.status(403).json({ message: 'Invalid URL.' })
    } else {
      try {
        const { email, firstName, otp } = payload as JwtPayload
        const emailToken = await EmailToken.findOne({
          email,
          otp,
        })
        // If emailToken doesn't exist, return invalid URL message
        if (!emailToken) {
          return res.status(403).json({
            exists: false,
            isValid,
            isExpired,
            message: 'Invalid URL.',
          })
        } else if (!isExpired) {
          // If everything is fine, update verified field of the user, return success message, delete email token
          await User.updateOne({ email }, { $set: { verified: true } })
          await res.status(200).json({
            message: 'Your email has been verified successfully.',
          })
          await emailToken.deleteOne({ email })
          return
        } else if (isExpired) {
          // If token expired, refresh the token and resend user another verification email with link
          const newOTP = generateOTP()
          await EmailToken.updateOne(
            { email, otp },
            {
              $set: {
                otp: newOTP,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
              },
            }
          )

          const urlParam = jwt.sign(
            {
              email: email,
              firstName: firstName,
              otp: newOTP,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '900s' }
          )

          await sendVerifyEmail(
            firstName,
            `${process.env.FRONTEND_URL}/user/verify-email/${urlParam}`,
            email
          )

          // If token is expired, return expired URL message
          return res.status(403).json({
            exists: true,
            isValid,
            isExpired,
            message:
              'The verification link has expired. A new one has been sent to your email.',
          })
        }
      } catch (err: any) {
        return res.status(500).json({ message: err.message as string })
      }
    }
  }
}

// @desc    Auth user and assign token
// @route   POST api/users/auth
// @access  Public
export const authUser = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { email, password } = req.body
  try {
    // If user exists and password is correct, auth user and assign token to cookie
    const user = await User.findOne({ email })
    if (user && user.verified === false) {
      if (!(await comparePassword(password, user.password))) {
        return res.status(401).json({
          message: 'Credentials are incorrect.',
        })
      }
      return res.status(401).json({
        message: 'Your email has not been verified yet.',
      })
    } else if (user && (await comparePassword(password, user.password))) {
      assignAuthToken(res, user._id)

      return res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      })
    } else {
      // Else return unauthorized request
      return res.status(401).json({ message: 'Credentials are incorrect.' })
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// @desc    Auth user and assign token
// @route   POST api/users/auth/google
// @access  Public
export const googleAuthUser = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }

  const { email, firstName, lastName } = req.body
  try {
    // If user exists, auth user and assign token to cookie
    const user = await User.findOne({ email })
    if (user) {
      // Verify the email
      if (user.verified === false) {
        user.verified = true
        await user.save()
      }

      assignAuthToken(res, user._id)
      return res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      })
    } else {
      // If user not exists, register
      const newRegister = new User({
        email,
        password:
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        firstName,
        lastName,
        verified: true,
      })

      const newUser = await newRegister.save()

      assignAuthToken(res, newUser._id)
      return res.status(200).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      })
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// @desc    Log out user and clear cookie
// @route   POST api/users/logout
// @access  Public
export const logoutUser = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  res.cookie('authToken', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  return res.status(200).json({ message: 'User logged out successfully.' })
}

// @desc    Send user link for password reset
// @route   POST api/users/forgot-password
// @access  Public
export const sendResetLink = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { email } = req.body

  try {
    // Check if the email already exists in the user database
    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // If not exists
      return res
        .status(404)
        .json({ message: 'This email has not been registered yet.' })
    } else if (user.verified !== true) {
      // If exists and not verified
      return res
        .status(403)
        .json({ message: 'Your account has not been verified.' })
    }

    // User exists and not verified yet
    let token = await EmailToken.findOne({ email: email.toLowerCase() })

    if (!token || token.expiresAt < new Date()) {
      // Delete old OTP if exists and is expired
      if (token) {
        await token.deleteOne({ email: email.toLowerCase() })
      }
      let newToken = new EmailToken({
        email,
        otp: generateOTP(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      })

      await newToken.save()

      const urlParam = jwt.sign(
        {
          email: newToken.email,
          firstName: user.firstName,
          prevPassword: user.password,
          otp: newToken.otp,
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '900s' }
      )

      await sendResetPasswordEmail(
        user.firstName,
        `${process.env.FRONTEND_URL}/user/reset-password/${urlParam}`,
        email
      )

      return res.status(201).json({
        message: 'Password reset link has been sent to your email.',
      })
    } else {
      return res.status(409).json({
        message:
          'Password reset link has been sent to your email. Please request another link in 15 minutes.',
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong, please try again later...',
    })
  }
}

// @desc    Verify a reset link
// @route   POST /api/users/reset-password/verify
// @access  Public
export const verifyResetLink = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { token } = req.body
  if (!token) {
    // Token not exists
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided.' })
  } else {
    const { isValid, isExpired, payload } = verifyToken(token)

    if (!isValid) {
      // If token is invalid or other errors occur, return invalid URL message
      return res
        .status(403)
        .json({ isValid, isExpired, message: 'Invalid URL.' })
    } else {
      try {
        const { email, firstName, prevPassword, otp } = payload as JwtPayload
        const emailToken = await EmailToken.findOne({
          email,
          otp,
        })

        // If emailToken doesn't exist, return invalid URL message
        if (!emailToken) {
          return res.status(403).json({
            exists: false,
            isValid,
            isExpired,
            message: 'Invalid URL.',
          })
        } else if (!isExpired) {
          return res
            .status(200)
            .json({ isValid, isExpired, email, prevPassword, otp })
        } else if (isExpired) {
          // If token expired, refresh the token and resend user another verification email with link
          const newOTP = generateOTP()
          await EmailToken.updateOne(
            { email, otp },
            {
              $set: {
                otp: newOTP,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
              },
            }
          )

          const urlParam = jwt.sign(
            {
              email: email,
              firstName: firstName,
              prevPassword: prevPassword,
              otp: newOTP,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '900s' }
          )

          await sendResetPasswordEmail(
            firstName,
            `${process.env.FRONTEND_URL}/user/reset-password/${urlParam}`,
            email
          )

          // If token is expired, return expired URL message
          return res.status(403).json({
            exists: true,
            isValid,
            isExpired,
            message:
              'The link has expired. A new one has been sent to your email.',
          })
        }
      } catch (err: any) {
        return res.status(500).json({
          message:
            err.message || 'Something went wrong, please try again later...',
        })
      }
    }
  }
}

// @desc    Reset password
// @route   PUT api/users/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const { email, prevPassword, otp, password } = req.body
  if (await comparePassword(password, prevPassword)) {
    // Old and new passwords are the same
    return res.status(400).json({ message: 'Passwords can not be the same.' })
  } else {
    // Passwords not same
    const hashedNewPassword = await bcrypt.hash(password, 10)
    await User.updateOne({ email }, { $set: { password: hashedNewPassword } })
    await res.status(200).json({
      message: 'Your password has been updated successfully.',
    })
    const emailToken = await EmailToken.findOne({
      email,
      otp,
    })
    if (emailToken) {
      await emailToken.deleteOne()
    } else {
      throw new Error('Email token not found.')
    }
    return
  }
  try {
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || 'Something went wrong, please try again later...',
    })
  }
}

// @desc    Get user profile
// @route   GET api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  try {
    const user = await User.findById(req.userId).select('-_id -password -__v')
    if (user) {
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(404).json({ message: 'User not found.' })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  // First check the request body content
  const { method, path } = req
  const allowedKeys = userRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateUserRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  const user = await User.findById(req.userId).select('-password')

  if (user) {
    const { firstName, lastName } = req.body

    // Check if any changes were made
    const isFirstNameChanged = firstName && firstName !== user.firstName
    const isLastNameChanged = lastName && lastName !== user.lastName

    if (!isFirstNameChanged && !isLastNameChanged) {
      return res
        .status(304)
        .json({ message: 'No changes detected. Profile not updated.' })
    }

    // Update user fields
    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName

    const updatedUser = await user.save()

    res.json({
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    })
  } else {
    res.status(404).json({ message: 'User not found.' })
  }
}
