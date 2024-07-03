import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdTravelExplore } from 'react-icons/md'
import Button from './Button'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaMagnifyingGlass, FaArrowRotateLeft } from 'react-icons/fa6'
import { useAppDispatch, useAppSelector, RootState } from '../store'
import { setSearchState, clearSearchState } from '../slices/searchSlice'

const searchSchema = z.object({
  destination: z.string().optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  adultCount: z.union([z.number().min(1).max(6), z.nan()]).optional(),
  childCount: z.union([z.number().min(0).max(2), z.nan()]).optional(),
})

type SearchFormValues = z.infer<typeof searchSchema>

const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const search = useAppSelector((state: RootState) => state.search)

  const { register, control, handleSubmit, setValue, watch } =
    useForm<SearchFormValues>({
      resolver: zodResolver(searchSchema),
      defaultValues: {
        destination:
          searchParams.get('destination') ||
          (search.destination as string) ||
          undefined,
        checkIn:
          (searchParams.get('checkIn')
            ? new Date(searchParams.get('checkIn') as string)
            : undefined) ||
          (search.checkIn ? new Date(search.checkIn as string) : undefined),
        checkOut:
          (searchParams.get('checkOut')
            ? new Date(searchParams.get('checkOut') as string)
            : undefined) ||
          (search.checkOut ? new Date(search.checkOut as string) : undefined),
        adultCount:
          (searchParams.get('adultCount')
            ? parseInt(searchParams.get('adultCount') as string)
            : undefined) ||
          (search.adultCount
            ? parseInt(search.adultCount as string)
            : undefined),
        childCount:
          (searchParams.get('childCount')
            ? parseInt(searchParams.get('childCount') as string)
            : undefined) ||
          (search.childCount
            ? parseInt(search.childCount as string)
            : undefined),
      },
    })

  const onSearchFormSubmit = handleSubmit((data: SearchFormValues) => {
    // Create a URLSearchParams object
    const queryParams = new URLSearchParams()

    // Add each field to the queryParams if it has a valid value
    if (data.destination) queryParams.append('destination', data.destination)
    if (data.checkIn) queryParams.append('checkIn', data.checkIn.toISOString())
    if (data.checkOut)
      queryParams.append('checkOut', data.checkOut.toISOString())
    if (data.adultCount)
      queryParams.append('adultCount', data.adultCount.toString())
    if (data.childCount)
      queryParams.append('childCount', data.childCount.toString())

    navigate(`/search?${queryParams}`)
    dispatch(
      setSearchState({
        destination: data?.destination,
        checkIn: data.checkIn?.toISOString(),
        checkOut: data.checkOut?.toISOString(),
        adultCount: data.adultCount?.toString(),
        childCount: data.childCount?.toString(),
      })
    )
  })

  const handleClear = () => {
    setSearchParams({})

    setValue('destination', undefined)
    setValue('checkIn', undefined)
    setValue('checkOut', undefined)
    setValue('adultCount', undefined)
    setValue('childCount', undefined)

    dispatch(clearSearchState())
  }

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }

  return (
    <div className="custom-container">
      <form
        onSubmit={onSearchFormSubmit}
        className="w-full -mt-8 p-3 bg-neutral-50 rounded-md shadow-lg shadow-neutral-200 grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 items-center gap-3"
      >
        <span className="col-span-2 md:col-span-1 flex flex-row items-center bg-white p-2 relative">
          <MdTravelExplore className="mr-2 text-xl text-neutral-700" />
          <input
            placeholder="Destination"
            className="text-sm md:text-base font-medium text-neutral-700 w-full focus:outline-none"
            {...register('destination')}
          />
        </span>
        <span className="col-span-2 flex gap-3">
          <label className="w-full text-sm md:text-base font-medium bg-white px-2 py-1 text-neutral-700 items-center flex">
            Adult:
            <input
              className="w-full p-1 focus:outline-none text-sm md:text-base font-medium text-neutral-700"
              type="number"
              placeholder="count"
              min={1}
              max={6}
              onKeyDown={handleKeyDown}
              {...register('adultCount', { valueAsNumber: true })}
            />
          </label>
          <label className="w-full text-sm md:text-base font-medium bg-white px-2 py-1 text-neutral-700 items-center flex">
            Child:
            <input
              className="w-full p-1 focus:outline-none text-sm md:text-base font-medium text-neutral-700"
              type="number"
              placeholder="count"
              min={0}
              max={2}
              onKeyDown={handleKeyDown}
              {...register('childCount', { valueAsNumber: true })}
            />
          </label>
        </span>
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
                  startDate={field.value}
                  minDate={minDate}
                  maxDate={watch('checkOut')}
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
                  startDate={field.value}
                  minDate={watch('checkIn')}
                  maxDate={maxDate}
                  placeholderText="Check-out Date"
                  className="w-full bg-white p-2 focus:outline-none"
                  wrapperClassName="w-full"
                />
              )}
            />
          </span>
        </div>
        <span className="flex gap-0 justify-around md:gap-3 md:justify-center col-span-2 md:col-span-1">
          <Button
            type="submit"
            icon={FaMagnifyingGlass}
            isPureIconButton={true}
          />
          <Button
            type="reset"
            icon={FaArrowRotateLeft}
            isPureIconButton={true}
            onClick={handleClear}
          />
        </span>
      </form>
    </div>
  )
}

export default SearchBar
