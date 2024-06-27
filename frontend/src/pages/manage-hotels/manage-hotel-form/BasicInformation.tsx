import { useFormContext } from 'react-hook-form'
import { ManageHotelFormData } from './ManageHotelForm'

const hotelTypes = [
  'Budget',
  'Boutique',
  'Luxury',
  'Ski Resort',
  'Business',
  'Family',
  'Romantic',
  'Hiking Resort',
  'Cabin',
  'Beach Resort',
  'Golf Resort',
  'Motel',
  'All Inclusive',
  'Pet Friendly',
  'Self Catering',
]
const hotelFacilities = [
  'Free WiFi',
  'Parking',
  'Airport Shuttle',
  'Family Rooms',
  'Non-Smoking Rooms',
  'Outdoor Pool',
  'Spa',
  'Fitness Center',
]

const BasicInformation = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ManageHotelFormData>()

  const [typeWatch, facilitiesWatch] = [
    watch('type'),
    watch('facilities') || [],
  ]

  return (
    <>
      {/* Name, type, startrating, description */}
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Name
        <input
          type="text"
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter hotel name here..."
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Star rating
        <select
          className="text-sm md:text-base border bg-white border-neutral-300 rounded w-full py-1 px-2 mt-1"
          {...register('starRating', { valueAsNumber: true })}
          defaultValue={5}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option
              value={num}
              key={num}
              className="text-sm md:text-base font-medium text-neutral-700"
            >
              {num}
            </option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.starRating.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        {'Type (Single choice)'}
        <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
          {hotelTypes.map((type) => (
            <label
              key={type}
              htmlFor={`type-${type}`}
              className={`${
                typeWatch === type
                  ? 'bg-neutral-800 text-neutral-200'
                  : 'text-neutral-800 bg-neutral-200'
              } cursor-pointer  text-xs md:text-sm items-center tracking-tight rounded-sm px-4 py-1.5 font-semibold`}
            >
              <input
                type="radio"
                id={`type-${type}`}
                value={type}
                {...register('type')}
                className="hidden"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
        {errors.type && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.type.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        {'Facilities (Multiple choice)'}
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
          {hotelFacilities.map((facility) => (
            <label
              key={facility}
              htmlFor={`facility-${facility}`}
              className={`${
                facilitiesWatch.includes(facility)
                  ? 'bg-neutral-800 text-neutral-200'
                  : 'text-neutral-800 bg-neutral-200'
              } cursor-pointer text-xs md:text-sm items-center tracking-tight rounded-sm px-4 py-1.5 font-semibold flex gap-2`}
            >
              <input
                type="checkbox"
                id={`facility-${facility}`}
                value={facility}
                className="hidden"
                {...register('facilities')}
              />
              {facility}
            </label>
          ))}
        </div>
        {errors.facilities && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.facilities.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Description
        <textarea
          rows={10}
          className="resize-none text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter description here..."
          {...register('description')}
        />
        {errors.description && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.description.message}
          </span>
        )}
      </div>
    </>
  )
}

export default BasicInformation
