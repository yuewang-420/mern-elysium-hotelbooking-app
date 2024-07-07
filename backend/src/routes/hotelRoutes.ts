import express from 'express'
import verifyToken from '../middleware/authMiddleware'
import {
  getHotelSearchResults,
  getHotelById,
  createBookingPaymentIntent,
  createBooking,
  getLatestUpdatedHotels,
  getMostPopularHotels,
} from '../controllers/hotelControllers'

const router = express.Router()

// GET      User search and get hotel results
router.get('/search', getHotelSearchResults)

// GET      Get the latest updated hotels
router.get('/latest', getLatestUpdatedHotels)

// GET      Get the most popular accommodations
router.get('/popular', getMostPopularHotels)

// GET      User get hotel by id
router.get('/:hotelId', getHotelById)

// POST     Create a payment intent
router.post(
  '/:hotelId/bookings/payment-intent',
  verifyToken,
  createBookingPaymentIntent
)

// POST     Book a hotel
router.post('/:hotelId/bookings', verifyToken, createBooking)

export default router
