import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import userRoutes from './routes/userRoutes'
import myHotelRoutes from './routes/myHotelRoutes'
import hotelRoutes from './routes/hotelRoutes'
import myBookingRoutes from './routes/myBookingRoutes'
import { notFound, errorHandler } from './middleware/errorMiddleware'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import verifyToken from './middleware/authMiddleware'

// Initiate a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
})

// Connect to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Connect to database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

// Initiate express backend server
const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(cookieParser())
// Enable trust proxy to correctly read client IP from headers
app.set('trust proxy', 1)
app.use(limiter)

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.use('/api/users', userRoutes)
app.use('/api/my-hotels', verifyToken, myHotelRoutes)
app.use('/api/my-bookings', verifyToken, myBookingRoutes)
app.use('/api/hotels', hotelRoutes)

// Route all other requests to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

app.listen(7000, () => {
  console.log('Server running on port 7000')
})
