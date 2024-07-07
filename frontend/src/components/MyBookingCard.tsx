import { Link } from 'react-router-dom'
import Carousel from './Carousel'
import { HotelType } from '../../../backend/src/shared/types'

type MyBookingCardProps = {
  booking: {
    _id: string
    userId: string
    firstName: string
    lastName: string
    email: string
    adultCount: number
    childCount: number
    checkIn: string
    checkOut: string
    totalCost: number
    hotel: HotelType
  }
}

const MyBookingCard = ({ booking }: MyBookingCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_4fr] border border-neutral-300 rounded shadow shadow-neutral-200 px-3 py-4 gap-4">
      <div className="h-48 md:h-64 items-center">
        <Carousel slides={booking.hotel.imageUrls} />
      </div>
      <div className="flex flex-col flex-wrap">
        <div className="flex flex-col gap-3 mb-4">
          <Link
            to={`/detail/${booking.hotel._id}`}
            className="text-xl md:text-2xl font-bold text-neutral-800 cursor-pointer hover:opacity-25 hover: btn-transition"
          >
            {booking.hotel.name}
          </Link>
          <span className="flex flex-col gap-1">
            <p className="text-sm md:text-base font-medium text-neutral-700">
              {`${booking.adultCount} ${
                booking.adultCount > 1 ? 'adults' : 'adult'
              }`}
              {booking.childCount > 0 &&
                `, ${booking.childCount} ${
                  booking.childCount > 1 ? 'children' : 'child'
                }`}
            </p>
            <p className="text-sm text-wrap md:text-base text-neutral-700 font-medium tracking-tight">
              Room {booking.hotel.roomNumber}, {booking.hotel.streetAddress},{' '}
              {booking.hotel.city}, {booking.hotel.country}
            </p>
            <p className="text-sm text-wrap md:text-base text-neutral-700 font-medium tracking-tight">
              Check-in: {new Date(booking.checkIn).toLocaleDateString()}
            </p>
            <p className="text-sm text-wrap md:text-base text-neutral-700 font-medium tracking-tight">
              Check-out: {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-sm text-wrap md:text-base text-neutral-700 font-medium tracking-tight">
              Total Cost: $ {booking.totalCost} AUD
            </p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default MyBookingCard
