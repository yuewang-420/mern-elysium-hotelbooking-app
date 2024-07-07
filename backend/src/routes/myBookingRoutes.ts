import express from 'express'
import { getAllMyBookings } from '../controllers/myBookingControllers'

const router = express.Router()

// GET      User get all bookings
router.get('/', getAllMyBookings)

export default router
