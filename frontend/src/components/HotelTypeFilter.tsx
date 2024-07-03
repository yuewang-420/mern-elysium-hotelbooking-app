import { hotelTypes } from '../pages/manage-hotels/manage-hotel-form/BasicInformation'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type HotelTypeFilterProps = {
  selectedHotelTypes: string[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const HotelTypeFilter = ({
  selectedHotelTypes,
  onChange,
}: HotelTypeFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm md:text-base font-medium text-neutral-800">
          Hotel Type
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
          isExpanded
            ? 'max-h-64 opacity-100 overflow-y-auto'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {hotelTypes.map((type) => (
          <label
            key={type}
            className="flex items-center gap-3 text-neutral-600"
          >
            <input
              type="checkbox"
              value={type}
              defaultChecked={selectedHotelTypes.includes(type)}
              onChange={onChange}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  )
}

export default HotelTypeFilter
