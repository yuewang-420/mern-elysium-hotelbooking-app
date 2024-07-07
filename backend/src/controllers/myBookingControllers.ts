import { Request, Response } from 'express'
import Hotel from '../models/hotelModel'
import Booking from '../models/bookingModel'

export const getAllMyBookings = async (req: Request, res: Response) => {
  try {
    const myBookings = await Booking.find({ userId: req.userId }).select('-__v')

    if (myBookings.length === 0) {
      return res
        .status(404)
        .json({ message: 'No booking records found under your user id.' })
    }

    const bookingsWithHotels = await Promise.all(
      myBookings.map(async (booking) => {
        const hotel = await Hotel.findById(booking.hotel).select('-__v')
        return {
          ...booking.toObject(),
          hotel: hotel ? { ...hotel.toObject() } : null,
        }
      })
    )

    return res.status(200).json(bookingsWithHotels)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}
