import { useParams } from 'react-router-dom'
import BookingDetailSummary from '../components/BookingDetailSummary'
import BookingForm from '../components/BookingForm'
import NotFound from './NotFound'

const HotelBooking = () => {
  const { hotelId } = useParams()
  if (!hotelId) {
    return <NotFound />
  }

  return (
    <div className="custom-container py-6 w-full justify-center md:justify-between items-center md:items-start flex flex-col md:flex-row gap-6">
      <BookingDetailSummary hotelId={hotelId as string} />
      <BookingForm hotelId={hotelId as string} />
    </div>
  )
}

export default HotelBooking
