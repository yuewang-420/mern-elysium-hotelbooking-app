import { NextFunction, Request, Response } from 'express'
import { ErrorRequestHandler } from 'express-serve-static-core' // Interface for error handler

// Define a custom error interface
interface CustomError extends Error {
  statusCode?: number
  kind?: string
}

// `notFound` middleware
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404 // Set custom property for error status

  next(error)
}

// `errorHandler` middleware
const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode)
  let message = err.message || 'Internal Server Error' // Default message if none provided

  // Handle Mongoose CastError specifically
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export { notFound, errorHandler }
