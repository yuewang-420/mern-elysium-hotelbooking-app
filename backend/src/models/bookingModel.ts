import mongoose, { Schema } from 'mongoose'

export type BookingType = {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  adultCount: number
  childCount: number
  checkIn: Date
  checkOut: Date
  totalCost: number
  hotel: Schema.Types.ObjectId // hotel Id
}

const bookingSchema = new mongoose.Schema<BookingType>({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCount: { type: Number, required: true, min: 1, max: 6 },
  childCount: { type: Number, required: true, min: 0, max: 2 },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalCost: { type: Number, required: true },
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
})

const Booking = mongoose.model<BookingType>('Booking', bookingSchema)
export default Booking
