import express from 'express'
import verifyToken from '../middleware/authMiddleware'
import {
  registerUser,
  sendVerificationEmail,
  verifyEmail,
  authUser,
  googleAuthUser,
  logoutUser,
  sendResetLink,
  verifyResetLink,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController'

const router = express.Router()

// POST   User register
router.post('/register', registerUser)

// POST     Request email verification link, Send link to user email
router.post('/email', sendVerificationEmail)

// POST     Verify the email link
router.post('/email/verify', verifyEmail)

// POST   User authentication
router.post('/auth', authUser)

// POST   Google authentication
router.post('/auth/google', googleAuthUser)

// POST   User log out
router.post('/logout', logoutUser)

// POST   User request to reset password, send reset link to user email
router.post('/forgot-password', sendResetLink)

// POST    Verify the password link
router.post('/reset-password', verifyResetLink)

// PUT    Update/reset the user password
router.put('/reset-password', resetPassword)

// GET    Get user profile
router.get('/profile', verifyToken, getUserProfile)

// PUT    Update user profile
router.put('/profile', verifyToken, updateUserProfile)

export default router
