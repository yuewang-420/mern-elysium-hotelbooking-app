import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import userRoutes from './routes/userRoutes'
import { notFound, errorHandler } from './middleware/errorMiddleware'
import path from 'path'

// Initiate a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
})

// Connect to database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

// Initiate express backend server
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(limiter)

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.use('/api/users', userRoutes)

// Route all other requests to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

app.listen(7000, () => {
  console.log('Server running on port 7000')
})
