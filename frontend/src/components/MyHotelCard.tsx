import { HotelType } from '../../../backend/src/shared/types'
import Button from './Button'
import {
  FaMapLocation,
  FaBuilding,
  FaMoneyCheck,
  FaPeopleRoof,
  FaChild,
  FaStar,
} from 'react-icons/fa6'

type MyHotelCardProps = {
  hotel: HotelType
}

const MyHotelCard = ({ hotel }: MyHotelCardProps) => {
  return (
    <div className="flex flex-col justify-between w-full border border-neutral-200 rounded px-8 py-6 gap-4">
      <h2 className="text-lg md:text-xl font-bold text-neutral-700">
        {hotel.name}
      </h2>
      <p className="text-sm md:text-base font-normal text-neutral-700 whitespace-pre-line line-clamp-3">
        {hotel.description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        <span className="border border-neutral-200 rounded-sm p-4 flex items-center text-sm md:text-base font-light tracking-tight text-neutral-500 line-clamp-1">
          <FaMapLocation className="mr-2" />
          {hotel.city}
        </span>
        <span className="border border-neutral-200 rounded-sm p-4 flex items-center text-sm md:text-base font-light tracking-tight text-neutral-500 line-clamp-1">
          <FaBuilding className="mr-2" />
          {hotel.type}
        </span>
        <span className="border border-neutral-200 rounded-sm p-4 flex items-center text-sm md:text-base font-light tracking-tight text-neutral-500 line-clamp-1">
          <FaMoneyCheck className="mr-2" />
          {`\$${hotel.pricePerNight} per night`}
        </span>
        <span className="border border-neutral-200 rounded-sm p-4 flex items-center text-sm md:text-base font-light tracking-tight text-neutral-500 line-clamp-1">
          <FaPeopleRoof className="mr-2" />
          {hotel.adultCount} adults
        </span>
        {hotel.childCount !== 0 && (
          <span className="border border-neutral-200 rounded-sm p-4 flex items-center text-sm md:text-base font-light tracking-tight text-neutral-500 line-clamp-1">
            <FaChild className="mr-2" />
            {hotel.childCount} children
          </span>
        )}
        <span className="border border-neutral-200 rounded-sm p-4 flex items-center text-sm md:text-base font-light tracking-tight text-neutral-500 line-clamp-1">
          <FaStar className="mr-2" />
          {hotel.starRating} stars
        </span>
      </div>
      <span className="flex flex-col justify-center gap-2 md:flex-row md:justify-between md:gap-0">
        <Button>Detail page</Button>
        <Button>Edit</Button>
      </span>
    </div>
  )
}

export default MyHotelCard
