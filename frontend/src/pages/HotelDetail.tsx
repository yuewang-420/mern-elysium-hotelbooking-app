import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import * as apiClient from './../api-client'
import NotFound from './NotFound'
import { FaStar } from 'react-icons/fa'
import CarouselBig from '../components/CarouselBig'
import Badge from '../components/Badge'
import Loading from './../components/Loading'
import BookNowForm from '../components/BookNowForm'

const HotelDetail = () => {
  const { hotelId } = useParams()
  const navigate = useNavigate()

  const {
    data: hotel,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['fetchHotelById', hotelId],
    queryFn: () => apiClient.fetchHotelById(hotelId as string),
    enabled: !!hotelId,
  })

  if (isFetching) {
    return (
      <div className="custom-container flex justify-center">
        <Loading loadingMsg="Fetching the hotel..." />
      </div>
    )
  }

  if (isSuccess && hotel) {
    return (
      <div className="custom-container flex flex-col my-4 gap-4">
        <div className="flex flex-col my-2">
          <div className="flex items-center align-middle">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map((_, index) => (
                <FaStar
                  key={`${hotel._id}_${index}`}
                  className="fill-yellow-400 text-sm md:text-base drop-shadow shadow-yellow-400"
                />
              ))}
            </span>
            <span className="ml-2 text-sm md:text-base font-semibold text-neutral-700">
              {hotel.type}
            </span>
          </div>
          <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between">
            <span className="flex flex-col gap-2">
              <h1 className="text-xl md:text-3xl text-neutral-800 font-bold">
                {hotel.name}
              </h1>
              <p className="text-xs md:text-sm text-neutral-600 font-semibold">
                Room {hotel.roomNumber}
              </p>
              <p className="text-xs md:text-sm text-neutral-600 font-semibold">
                {hotel.streetAddress}, {hotel.city}, {hotel.country}
              </p>
            </span>
            <span className="flex flex-col md:items-end md:justify-end">
              <p className="text-xs md:text-sm font-meidum text-neutral-600">
                {`${hotel.adultCount} ${
                  hotel.adultCount > 1 ? 'adults' : 'adult'
                }`}
                {hotel.childCount > 0 &&
                  `, ${hotel.childCount} ${
                    hotel.childCount > 1 ? 'children' : 'child'
                  }`}
              </p>
              <p className="text-sm md:text-base font-semibold text-neutral-800">
                ${hotel.pricePerNight} per night
              </p>
              <p className="text-xs md:text-sm font-light text-neutral-400">
                Additional charges may apply
              </p>
            </span>
          </div>
        </div>
        <CarouselBig slides={hotel.imageUrls} hotelName={hotel.name} />
        <div className="flex flex-col gap-2">
          <h5 className="text-base md:text-lg text-neutral-700 font-semibold">
            Facilities
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 drop-shadow shadow-neutral-200">
            {hotel.facilities.map((facility) => (
              <Badge
                key={`${hotel._id}_${facility}`}
                bgColor={'bg-blue-600'}
                textColor={'text-white'}
                badgeInfo={facility}
                isBig
              ></Badge>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] mt-2 mb-8">
          <span className="flex flex-col gap-2 pr-2">
            <h5 className="text-base md:text-lg text-neutral-700 font-semibold">
              Accommodation description
            </h5>
            <p className="whitespace-pre-line line-clamp-none leading-loose tracking-wide text-sm md:text-base text-neutral-600 font-medium">
              {hotel.description}
            </p>
          </span>

          <div className="h-fit">
            <BookNowForm
              hotelId={hotel._id}
              pricePerNight={hotel.pricePerNight}
              maxAdultCount={hotel.adultCount}
              maxChildCount={hotel.childCount}
            />
          </div>
        </div>
      </div>
    )
  }

  const mainText = 'Opps. No such hotel found.'
  const subText =
    "Sorry, we can't find the hotel according to the hotel id you provided. You'll find a lot to explore in the search page."
  const buttonText = 'Back to Search Page'
  const onButtonClick = () => navigate('/search')
  if (isError && !hotel) {
    return (
      <NotFound
        mainText={mainText}
        subText={subText}
        buttonText={buttonText}
        onButtonClick={onButtonClick}
      />
    )
  }
}

export default HotelDetail
