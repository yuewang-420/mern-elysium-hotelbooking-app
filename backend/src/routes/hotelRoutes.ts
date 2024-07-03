import express from 'express'
import { getHotelSearchResults } from '../controllers/hotelControllers'

const router = express.Router()

// GET      User search and get hotel results
router.get('/search', getHotelSearchResults)

// GET

export default router
