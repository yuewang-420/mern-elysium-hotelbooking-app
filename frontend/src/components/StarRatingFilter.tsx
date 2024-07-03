import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type StarRatingFilterProps = {
  selectedStars: string[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const StarRatingFilter = ({
  selectedStars,
  onChange,
}: StarRatingFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm md:text-base font-medium text-neutral-800">
          Hotel Rating
        </h4>
        <button
          className="text-sm md:text-base text-neutral-600"
          onClick={toggleExpand}
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        {[5, 4, 3, 2, 1].map((star) => {
          return (
            <label
              key={star}
              className="flex items-center gap-3 text-neutral-600"
            >
              <input
                type="checkbox"
                value={star}
                defaultChecked={selectedStars.includes(star.toString())}
                onChange={onChange}
              />
              {`${star} Star${star > 1 ? 's' : ''}`}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default StarRatingFilter
