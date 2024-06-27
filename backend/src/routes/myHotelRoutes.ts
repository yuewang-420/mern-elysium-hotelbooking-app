import express from 'express'
import verifyToken from './../middleware/authMiddleware'
import multer from 'multer'
import {
  addNewHotel,
  getAllMyHotels,
  getMyHotelById,
  updateMyHotelById,
} from '../controllers/myHotelController'

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 850 * 1024, // 850 KB in bytes
  },
}).array('imageFiles', 6)

const router = express.Router()

//  POST    User add new hotel
router.post('/', upload, addNewHotel)

//  GET     User get all their hotels
router.get('/', getAllMyHotels)

// GET      User get hotel by id
router.get('/:id', getMyHotelById)

//PUT       User update hotel by id
router.put('/:id', upload, updateMyHotelById)

export default router
