import { HotelType } from '../../../backend/src/shared/types'
import { FaStar } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Badge from './Badge'
import Button from './Button'
import Carousel from './Carousel'
import { useState } from 'react'

type SearchResultCardprops = {
  hotel: HotelType
}

const SearchResultCard = ({ hotel }: SearchResultCardprops) => {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_5fr] border border-neutral-300 rounded shadow bg-neutral-50 shadow-neutral-200 px-3 py-4 gap-4">
      <div className="h-48 md:h-64 items-center">
        <Carousel slides={hotel.imageUrls} />
      </div>
      <div className="flex flex-col flex-wrap">
        <div className="flex flex-col gap-0.5 mb-4 justify-start">
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between md:items-center">
            <span className="flex items-center">
              {Array.from({ length: hotel.starRating }).map((_, index) => (
                <FaStar
                  key={`${hotel._id}_${index}`}
                  className="fill-yellow-400 text-xs md:text-sm drop-shadow-sm shadow-yellow-400"
                />
              ))}
              <span className="ml-2 text-xs md:text-sm font-medium text-neutral-700">
                {hotel.type}
              </span>
            </span>
            <p className="self-start text-xs md:text-sm font-medium text-neutral-700">
              {`${hotel.adultCount} ${
                hotel.adultCount > 1 ? 'adults' : 'adult'
              }`}
              {hotel.childCount > 0 &&
                `, ${hotel.childCount} ${
                  hotel.childCount > 1 ? 'children' : 'child'
                }`}
            </p>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="self-start text-xl md:text-2xl font-bold text-neutral-800 cursor-pointer hover:opacity-25 hover: btn-transition"
          >
            {hotel.name}
          </Link>
          <p className="self-start text-start text-xs text-wrap md:text-sm text-neutral-600 font-light tracking-tight">
            Room {hotel.roomNumber}, {hotel.streetAddress}, {hotel.city},{' '}
            {hotel.country}
          </p>
        </div>
        <div className="self-start flex justify-start">
          <p className="self-start text-start text-xs text-wrap md:text-sm font-normal text-neutral-700 line-clamp-3 md:line-clamp-4 2xl:line-clamp-4">
            {hotel.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mt-4 sm:mt-6 items-end sm:items-start whitespace-nowrap">
          <div className="flex basis-3/5 flex-col gap-1 items-start">
            <span className="w-full flex flex-wrap-reverse sm:flex-wrap gap-1 itemds-end self-end sm:self-start">
              {expanded
                ? hotel.facilities.map((facility, index) => (
                    <Badge
                      key={`${hotel._id}_${index}`}
                      badgeInfo={facility}
                      bgColor={'bg-blue-600'}
                      textColor={'text-white'}
                    />
                  ))
                : hotel.facilities
                    .slice(0, 3)
                    .map((facility, index) => (
                      <Badge
                        key={`${hotel._id}_${index}`}
                        badgeInfo={facility}
                        bgColor={'bg-blue-600'}
                        textColor={'text-white'}
                      />
                    ))}
            </span>
            {hotel.facilities.length > 3 && (
              <span
                className="text-xs self-end sm:self-start text-neutral-700 tracking-tighter cursor-pointer hover:opacity-25 hover: btn-transition drop-shadow-sm"
                onClick={toggleExpand}
              >
                {expanded ? `- Less` : `+${hotel.facilities.length - 3} more`}
              </span>
            )}
          </div>
          <div className="flex basis-2/5 flex-col sm:items-end">
            <p className="text-sm md:text-base font-semibold text-neutral-800 mb-1">
              ${hotel.pricePerNight} per night
            </p>
            <span className="self-start sm:self-end">
              <Button
                onClick={() => navigate(`/detail/${hotel._id}`)}
                textColor="text-white"
                bgColor="bg-blue-600"
                textHoverColor="hover:text-blue-600"
                bgHoverColor="hover:bg-white"
              >
                View More
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultCard
