import { hotelFacilities } from '../pages/manage-hotels/manage-hotel-form/BasicInformation'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type FacilityFilterProps = {
  selectedFacilities: string[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FacilityFilter = ({
  selectedFacilities,
  onChange,
}: FacilityFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm md:text-base font-medium text-neutral-800">
          Facilities
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
            ? 'max-h-48 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className="flex items-center gap-3 text-neutral-600"
          >
            <input
              type="checkbox"
              value={facility}
              defaultChecked={selectedFacilities.includes(facility)}
              onChange={onChange}
            />
            {facility}
          </label>
        ))}
      </div>
    </div>
  )
}

export default FacilityFilter
