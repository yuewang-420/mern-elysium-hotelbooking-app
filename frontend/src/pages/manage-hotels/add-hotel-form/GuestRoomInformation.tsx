import { useFormContext } from 'react-hook-form'
import { AddHotelFormData } from '../AddHotel'

const GuestRoomInformation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddHotelFormData>()
  return (
    <>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Room number
        <input
          type="number"
          min={0}
          max={9999}
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter room number here..."
          style={{
            WebkitAppearance: 'textfield',
            MozAppearance: 'textfield',
          }}
          {...register('roomNumber', { valueAsNumber: true })}
        />
        {errors.roomNumber && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.roomNumber.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Adult
        <input
          type="number"
          min={1}
          max={6}
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter adult count here..."
          {...register('adultCount', { valueAsNumber: true })}
        />
        {errors.adultCount && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.adultCount.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Children
        <input
          type="number"
          min={0}
          max={2}
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter child count here..."
          {...register('childCount', { valueAsNumber: true })}
        />
        {errors.childCount && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.childCount.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Price per night
        <input
          type="number"
          min={1}
          max={10000}
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter price per night here..."
          style={{
            WebkitAppearance: 'textfield',
            MozAppearance: 'textfield',
          }}
          {...register('pricePerNight', { valueAsNumber: true })}
        />
        {errors.pricePerNight && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.pricePerNight.message}
          </span>
        )}
      </div>
    </>
  )
}
export default GuestRoomInformation
