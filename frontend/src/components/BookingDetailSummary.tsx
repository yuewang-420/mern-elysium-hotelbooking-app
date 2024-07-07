import { useQuery } from '@tanstack/react-query'
import * as apiClient from '../api-client'
import { useAppSelector, RootState } from '../store'
import Loading from './Loading'
import Error from './Error'

type BookingDetailSummaryProps = {
  hotelId: string
}

const BookingDetailSummary = ({ hotelId }: BookingDetailSummaryProps) => {
  const {
    data: hotelByIdResponse,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['fetchHotelById', hotelId],
    queryFn: () => apiClient.fetchHotelById(hotelId as string),
  })

  const { checkIn, checkOut, adultCount, childCount } = useAppSelector(
    (state: RootState) => state.search
  )

  const checkInDate = new Date(checkIn as string)
  const checkOutDate = new Date(checkOut as string)
  const adultNum = parseInt(adultCount as string)
  const childNum = parseInt((childCount as string) || '0')

  const nightNum = Math.ceil(
    Math.abs(checkInDate.getTime() - checkOutDate.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div className="flex flex-col gap-2 px-6 py-4 w-full md:basis-2/5 border border-neutral-200 rounded-md shadow-sm shadow-neutral-50 divide-y">
      <h2 className="text-lg md:text-xl font-bold text-neutral-800">
        Your Booking Details
      </h2>
      {isFetching && <Loading loadingMsg="Fetching hotel details..." />}
      {isError && <Error errMsg={error.message} />}
      {isSuccess && (
        <>
          <div className="pt-2 flex flex-col gap-1">
            <h6 className="text-sm md:text-base font-semibold text-neutral-700">
              Location
            </h6>
            <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">{`Room ${hotelByIdResponse.hotel.roomNumber} ${hotelByIdResponse.hotel.name}`}</p>
            <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">{`${hotelByIdResponse.hotel.streetAddress}, ${hotelByIdResponse.hotel.city}, ${hotelByIdResponse.hotel.country}`}</p>
          </div>
          <div className="flex pt-2">
            <span className="basis-1/2 flex flex-col gap-1">
              <h6 className="text-sm md:text-base font-semibold text-neutral-700">
                Check-in
              </h6>
              <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">
                {checkInDate.toDateString()}
              </p>
            </span>
            <span className="basis-1/2 flex flex-col gap-1">
              <h6 className="text-sm md:text-base font-semibold text-neutral-700">
                Check-out
              </h6>
              <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">
                {checkOutDate.toDateString()}
              </p>
            </span>
          </div>
          <div className="flex flex-col pt-2 gap-1">
            <h6 className="text-sm md:text-base font-semibold text-neutral-700">
              Total length of stay
            </h6>
            <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">
              {`${nightNum} ${nightNum > 1 ? 'nights' : 'night'}`}
            </p>
          </div>
          <div className="flex flex-col pt-2 gap-1">
            <h6 className="text-sm md:text-base font-semibold text-neutral-700">
              Guests
            </h6>

            <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">
              {`${adultNum} ${adultNum > 1 ? 'adults' : 'adult'}`}
              {childNum > 0 &&
                `, ${childNum} ${childNum > 1 ? 'children' : 'child'}`}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default BookingDetailSummary
