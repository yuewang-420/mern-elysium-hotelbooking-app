import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type PriceFilterProps = {
  selectedMaxPrice: number | string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
export const pricesOptions = [
  ...Array.from(
    { length: Math.floor((500 - 100) / 100) + 1 },
    (_, index) => 100 + index * 100
  ),
  ...Array.from(
    { length: Math.floor((2000 - 750) / 250) + 1 },
    (_, index) => 750 + index * 250
  ),
]

const PriceFilter = ({ selectedMaxPrice, onChange }: PriceFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm md:text-base font-medium text-neutral-800">
          Price Range
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
        <span className="flex flex-col w-full text-neutral-600 text-xs md:text-sm mt-2">
          Select max price
          <select
            className="text-sm md:text-base border bg-white border-neutral-300 rounded w-full py-1 px-2 mt-1"
            defaultValue={selectedMaxPrice.toString() || ''}
            onChange={onChange}
          >
            <option
              key={`max_null`}
              value=""
              className="text-sm md:text-base font-medium text-neutral-700"
              hidden
            >
              Max price
            </option>
            {pricesOptions.map((price) => (
              <option
                key={`max_${price}`}
                value={price}
                className="text-sm md:text-base font-medium text-neutral-700"
              >
                {price}
              </option>
            ))}
          </select>
        </span>
      </div>
    </div>
  )
}

export default PriceFilter
