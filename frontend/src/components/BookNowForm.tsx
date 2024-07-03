import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch, RootState } from '../store'
import Button from './Button'
import { FaRegHandPointRight } from 'react-icons/fa6'
import { FaSignInAlt } from 'react-icons/fa'
import { setSearchState } from '../slices/searchSlice'

type BookNowFormProps = {
  hotelId: string
  pricePerNight: number
  maxAdultCount: number
  maxChildCount: number
}

type GuestInfoFormData = {
  checkIn: Date
  checkOut: Date
  adultCount: number
  childCount: number
}

const BookNowForm = ({
  hotelId,
  pricePerNight,
  maxAdultCount,
  maxChildCount,
}: BookNowFormProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = useAppSelector((state: RootState) => state.auth?.userInfo)
  const search = useAppSelector((state: RootState) => state.search)
  const dispatch = useAppDispatch()

  const {
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn ? new Date(search.checkIn) : undefined,
      checkOut: search.checkOut ? new Date(search.checkOut) : undefined,
      adultCount: search.adultCount ? parseInt(search.adultCount) : undefined,
      childCount: search.childCount ? parseInt(search.childCount) : undefined,
    },
  })

  const checkIn = watch('checkIn')
  const checkOut = watch('checkOut')

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  const onSignInClick = (data: GuestInfoFormData) => {
    dispatch(
      setSearchState({
        destination: search?.destination || '',
        checkIn:
          typeof data.checkIn === 'object' && data.checkIn instanceof Date
            ? data.checkIn.toISOString()
            : typeof data.checkIn === 'string'
            ? data.checkIn
            : undefined,
        checkOut:
          typeof data.checkOut === 'object' && data.checkOut instanceof Date
            ? data.checkOut.toISOString()
            : typeof data.checkOut === 'string'
            ? data.checkOut
            : undefined,
        adultCount: data.adultCount ? data.adultCount.toString() : undefined,
        childCount: data.childCount ? data.childCount.toString() : undefined,
      })
    )
    navigate('/user/signin', { state: { from: location.pathname } })
  }

  const handleSignInClick = () => {
    onSignInClick({
      checkIn: watch('checkIn'),
      checkOut: watch('checkOut'),
      adultCount: watch('adultCount'),
      childCount: watch('childCount'),
    })
  }

  const onSubmit = (data: GuestInfoFormData) => {
    dispatch(
      setSearchState({
        destination: search?.destination || '',
        checkIn:
          typeof data.checkIn === 'object' && data.checkIn instanceof Date
            ? data.checkIn.toISOString()
            : typeof data.checkIn === 'string'
            ? data.checkIn
            : undefined,
        checkOut:
          typeof data.checkOut === 'object' && data.checkOut instanceof Date
            ? data.checkOut.toISOString()
            : typeof data.checkOut === 'string'
            ? data.checkOut
            : undefined,
        adultCount: data.adultCount ? data.adultCount.toString() : undefined,
        childCount: data.childCount ? data.childCount.toString() : undefined,
      })
    )
    navigate(`/hotel/${hotelId}/booking`)
  }

  return (
    <div className="flex flex-col p-4 gap-4 bg-neutral-50 rounded-md drop-shadow shadow-neutral-200">
      <h3 className="text-xl md:text-2xl text-neutral-700 font-semibold drop-shadow-sm">
        Book now
      </h3>
      <h5 className="text-base md:text-lg text-neutral-700 font-semibold">
        $ {pricePerNight} AUD per night
      </h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full gap-4 items-center">
          <div className="col-span-2 flex w-full gap-3">
            <span className="col-span-1 flex flex-1 text-sm md:text-base font-medium text-neutral-700">
              <Controller
                control={control}
                name="checkIn"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={checkOut}
                    placeholderText="Check-in Date"
                    className="w-full bg-white p-2 focus:outline-none"
                    wrapperClassName="w-full"
                  />
                )}
              />
            </span>
            <span className="col-span-1 flex flex-1 text-sm md:text-base font-medium text-neutral-700">
              <Controller
                control={control}
                name="checkOut"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn}
                    maxDate={maxDate}
                    placeholderText="Check-out Date"
                    className="w-full bg-white p-2 focus:outline-none"
                    wrapperClassName="w-full"
                  />
                )}
              />
            </span>
          </div>
          <span className="col-span-2 flex gap-3">
            <label className="w-full text-sm md:text-base font-medium bg-white px-2 py-1 text-neutral-700 items-center flex">
              Adult:
              <input
                className="w-full p-1 focus:outline-none text-sm md:text-base font-medium text-neutral-700"
                type="number"
                placeholder="count"
                min={1}
                max={maxAdultCount}
                onKeyDown={handleKeyDown}
                {...register('adultCount', {
                  required: 'Adult count is required',
                  min: {
                    value: 1,
                    message: 'There must be at least one adult.',
                  },
                  max: {
                    value: maxAdultCount,
                    message: `Adult count cannot exceed ${maxAdultCount}.`,
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="w-full text-sm md:text-base font-medium bg-white px-2 py-1 text-neutral-700 items-center flex">
              Child:
              <input
                className="w-full p-1 focus:outline-none text-sm md:text-base font-medium text-neutral-700"
                type="number"
                placeholder="count"
                min={0}
                max={maxChildCount}
                onKeyDown={handleKeyDown}
                {...register('childCount', {
                  min: {
                    value: 0,
                    message: 'Child count cannot be non-negative.',
                  },
                  max: {
                    value: maxChildCount,
                    message: `Child count cannot exceed ${maxChildCount}.`,
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
          </span>
          {errors.checkIn && (
            <p className="text-red-500 text-sm self-start">
              {errors.checkIn.message}
            </p>
          )}
          {errors.checkOut && (
            <p className="text-red-500 text-sm self-start">
              {errors.checkOut.message}
            </p>
          )}
          {errors.adultCount && (
            <p className="text-red-500 text-sm self-start">
              {errors.adultCount.message}
            </p>
          )}
          {errors.childCount && (
            <p className="text-red-500 text-sm self-start">
              {errors.childCount.message}
            </p>
          )}
          {userInfo ? (
            <Button
              type="submit"
              icon={FaRegHandPointRight}
              textColor="text-white"
              bgColor="bg-yellow-400"
              textHoverColor="hover:text-yellow-400"
              bgHoverColor="hover:bg-white"
            >
              Book Now
            </Button>
          ) : (
            <Button
              type="button"
              icon={FaSignInAlt}
              textColor="text-white"
              bgColor="bg-blue-600"
              textHoverColor="hover:text-blue-600"
              bgHoverColor="hover:bg-white"
              onClick={handleSignInClick}
            >
              Sign in to Book
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default BookNowForm
