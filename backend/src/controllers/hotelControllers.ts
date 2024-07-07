import { Request, Response } from 'express'
import Hotel from '../models/hotelModel'
import Booking from '../models/bookingModel'
import { HotelType, HotelSearchResponse, BookingType } from '../shared/types'
import checkUnexpectedFields, {
  checkUnexpectedParams,
} from './../utils/checkUnexpectedFields'
import { stripe } from '../stripe'
import { startOfDay, endOfDay } from 'date-fns'

// @desc    Get searched hotels
// @route   GET /api/hotels/search?
// @access  Public
export const getHotelSearchResults = async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query)

    let sortOption = {}
    switch (req.query.sortOption) {
      case 'starRating':
        sortOption = { starRating: -1 }
        break
      case 'pricePerNightAsc':
        sortOption = { pricePerNight: 1 }
        break
      case 'pricePerNightDesc':
        sortOption = { pricePerNight: -1 }
        break
      default:
        sortOption = { lastUpdated: -1 }
    }

    // Implement pagination
    const pageSize = 5
    const pageNum = parseInt(req.query.page ? req.query.page.toString() : '1')

    // Defined the skip item num
    const skipHotelNum = (pageNum - 1) * pageSize

    // Resolve booking conflicts
    let matchStage: any = { $match: query }
    const checkIn = req.query.checkIn as string
    const checkOut = req.query.checkOut as string

    const combinedQuery = [
      { $match: query },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'hotel',
          as: 'bookings',
        },
      },
    ]

    if (
      checkIn &&
      checkOut &&
      !isNaN(Date.parse(checkIn)) &&
      !isNaN(Date.parse(checkOut))
    ) {
      combinedQuery.push({
        $match: {
          bookings: {
            $not: {
              $elemMatch: {
                $or: [
                  {
                    checkIn: { $lte: new Date(checkOut as string) },
                    checkOut: { $gte: new Date(checkIn as string) },
                  },
                ],
              },
            },
          },
        },
      })
    }

    const hotels = await Hotel.aggregate([
      ...combinedQuery,
      { $sort: sortOption },
      { $skip: skipHotelNum },
      { $limit: pageSize },
    ])
    const totalHotelCountResult = await Hotel.aggregate([
      ...combinedQuery,
      { $count: 'total' },
    ])
    const totalHotelNum = totalHotelCountResult[0]?.total || 0

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        totalHotelNum,
        page: pageNum,
        pages: Math.ceil(totalHotelNum / pageSize),
      },
    }

    return res.status(200).json(response)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// @desc    Get hotel by Id
// @route   GET /api/hotels/:hotelId
// @access  Public
export const getHotelById = async (req: Request, res: Response) => {
  const unmatchedFieldErrors = checkUnexpectedFields(req, [])
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }

  const unmatchedParamErrors = checkUnexpectedParams(req, ['hotelId'])
  if (unmatchedParamErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedParamErrors })
  }

  try {
    const id = req.params.hotelId.toString()
    // Find hotel by id
    const hotel = await Hotel.findById(id)
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' })
    }

    // Find bookings related to this hotel
    const bookings = await Booking.find({ hotel: id })

    // Extract check-in and check-out dates from bookings
    const excludeDateIntervals = bookings.map((booking) => ({
      start: startOfDay(new Date(booking.checkIn)),
      end: endOfDay(new Date(booking.checkOut)),
    }))

    // Construct response JSON including hotel and exclusion intervals
    const response = {
      hotel,
      excludeDateIntervals,
    }

    return res.status(200).json(response)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// @desc    Create a payment intent
// @route   GET /api/hotels/:hotelId/bookings/payment-intent
// @access  Private
export const createBookingPaymentIntent = async (
  req: Request,
  res: Response
) => {
  // TODO: Body validation

  try {
    // Total cost
    const { nightNum } = req.body
    const hotelId = req.params.hotelId
    const hotel = await Hotel.findById(hotelId)
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' })
    }
    const totalCost = nightNum * hotel.pricePerNight

    // Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: 'aud',
      metadata: {
        hotelId,
        userId: req.userId,
      },
    })

    if (!paymentIntent.client_secret) {
      return res.status(500).json({
        message: 'Failed to create payment intent via stripe.',
      })
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: (paymentIntent.client_secret as string).toString(),
      totalCost,
    }

    return res.status(201).json(response)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// @desc    Create a booking record
// @route   GET /api/hotels/:hotelId/bookings
// @access  Private
export const createBooking = async (req: Request, res: Response) => {
  // TODO: Body validation
  try {
    const { checkIn, checkOut, ...bookingData } = req.body
    const hotelId = req.params.hotelId

    const paymentIntentId = req.body.paymentIntentId
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    )

    // Cannot find the paymentIntent
    if (!paymentIntent.client_secret) {
      return res.status(404).json({
        message: 'Failed to retrieve payment intent via stripe.',
      })
    }

    // The paymentIntent and actual user mismatch
    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return res.status(400).json({ message: 'Payment intent mismatch' })
    }

    // Payment intent not successful
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
      })
    }

    // Retrieve hotel
    const hotel = await Hotel.findById(hotelId)
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' })
    }

    // Check for booking conflicts
    const overlappingBooking = await Booking.findOne({
      hotel: hotelId,
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      ],
    })

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: 'Booking conflicts with existing bookings.' })
    }

    // Create new booking document
    const newBooking: BookingType = {
      ...bookingData,
      hotel: hotelId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      userId: req.userId,
    }

    // Save new booking document
    const createdBooking = await Booking.create(newBooking)

    return res.status(201).json({
      message: 'Booking created successfully.',
      booking: createdBooking,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// @desc    Get the latest updated hotels
// @route   GET /api/hotels/latest
// @access  Public
export const getLatestUpdatedHotels = async (req: Request, res: Response) => {
  try {
    const latestHotels = await Hotel.find().sort({ lastUpdated: -1 }).limit(5)

    return res.status(200).json(latestHotels)
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong, please try again later...111111',
    })
  }
}

// @desc    Get the most popular accommodations
// @route   GET /api/hotels/popular
// @access  Public
export const getMostPopularHotels = async (req: Request, res: Response) => {
  try {
    const popularHotels = await Hotel.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'hotel',
          as: 'bookings',
        },
      },
      {
        $addFields: {
          bookingCount: { $size: '$bookings' },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
    ])

    return res.status(200).json(popularHotels)
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong, please try again later...',
    })
  }
}

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {}

  if (queryParams.destination) {
    constructedQuery.$or = [
      { streetAddress: new RegExp(queryParams.destination, 'i') },
      { city: new RegExp(queryParams.destination, 'i') },
      { country: new RegExp(queryParams.destination, 'i') },
    ]
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    }
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    }
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    }
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    }
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)]

    constructedQuery.starRating = { $in: starRatings }
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    }
  }

  return constructedQuery
}
