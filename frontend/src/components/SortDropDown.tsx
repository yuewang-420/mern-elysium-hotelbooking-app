type SortDropDownProps = {
  selectedSortOption: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const sortOptions = [
  'starRating',
  'pricePerNightAsc',
  'pricePerNightDesc',
]

const SortDropDown = ({ selectedSortOption, onChange }: SortDropDownProps) => {
  return (
    <select
      value={selectedSortOption || ''}
      className="text-sm md:text-base border bg-white border-neutral-300 rounded py-1 px-2 mt-1"
      onChange={onChange}
    >
      <option
        key={`sort_null`}
        value=""
        className="text-sm md:text-base font-medium text-neutral-700"
        hidden
      >
        Sort By
      </option>
      <option
        value="starRating"
        className="text-sm md:text-base font-medium text-neutral-700"
      >
        Star Rating
      </option>
      <option
        value="pricePerNightAsc"
        className="text-sm md:text-base font-medium text-neutral-700"
      >
        Price Per Night (low to high)
      </option>
      <option
        value="pricePerNightDesc"
        className="text-sm md:text-base font-medium text-neutral-700"
      >
        Price Per Night (high to low)
      </option>
    </select>
  )
}

export default SortDropDown
