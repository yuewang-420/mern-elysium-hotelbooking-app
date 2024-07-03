import express from 'express'
import {
  getHotelSearchResults,
  getHotelById,
} from '../controllers/hotelControllers'

const router = express.Router()

// GET      User search and get hotel results
router.get('/search', getHotelSearchResults)

// GET      User get hotel by id
router.get('/:hotelId', getHotelById)

export default router
