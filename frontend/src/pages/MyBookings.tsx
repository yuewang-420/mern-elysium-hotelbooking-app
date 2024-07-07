import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as apiClient from '../api-client'
import Loading from './../components/Loading'
import NotFound from './NotFound'
import MyBookingCard from '../components/MyBookingCard'

const MyBookings = () => {
  const navigate = useNavigate()
  const {
    data: myBookingData,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['fetchMyBookings'],
    queryFn: () => apiClient.fetchMyBookings(),
  })

  const mainText = 'Opps. No bookings found.'
  const subText =
    "Sorry, we can't find any booking records by your user id. You can now explore the home page and decide what to book."
  const buttonText = 'Back to Home Page'
  const onButtonClick = () => navigate('/')

  return (
    <div className="custom-container py-6 w-full flex flex-col divide-y gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          My bookings
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Have an overview of all your bookings. You can simply select one hotel
          to view its details.
        </p>
      </span>
      <span className="pt-4 flex flex-col gap-6">
        {isFetching && (
          <Loading loadingMsg="Fetching your booking records..." />
        )}
        {isError && !myBookingData && (
          <NotFound
            mainText={mainText}
            subText={subText}
            buttonText={buttonText}
            onButtonClick={onButtonClick}
          />
        )}
        {isSuccess &&
          myBookingData &&
          myBookingData.map((booking: any) => (
            <MyBookingCard booking={booking} key={booking._id} />
          ))}
      </span>
    </div>
  )
}

export default MyBookings
