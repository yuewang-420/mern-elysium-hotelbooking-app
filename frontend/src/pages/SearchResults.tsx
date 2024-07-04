import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import * as apiClient from '../api-client'
import { useState, useEffect } from 'react'
import Loading from '../components/Loading'
import Error from '../components/Error'
import Button from './../components/Button'
import { FaBars, FaTimes } from 'react-icons/fa'
import SearchResultCard from '../components/SearchResultCard'
import Pagination from '../components/Pagination'
import StarRatingFilter from '../components/StarRatingFilter'
import HotelTypeFilter from '../components/HotelTypeFilter'
import FacilityFilter from '../components/FacilityFilter'
import PriceFilter, { pricesOptions } from '../components/PriceFilter'
import SortDropDown, { sortOptions } from '../components/SortDropDown'
import { FaArrowRotateLeft } from 'react-icons/fa6'
import { useAppDispatch } from '../store'
import { clearSearchState } from '../slices/searchSlice'

const SearchResults = () => {
  const [page, setPage] = useState<number>(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setSearchParams((params) => {
      params.set('page', page.toString())

      // Check if selectedMaxPrice is not in pricesOptions, then remove maxPrice from params
      const maxPrice = params.get('maxPrice')
      if (maxPrice && !pricesOptions.includes(Number(maxPrice))) {
        params.delete('maxPrice')
      }

      // Check if selectedSortOption is not in sortOptions, then remove sortOption from params
      const sortOption = params.get('sortOption')
      if (sortOption && !sortOptions.includes(sortOption)) {
        params.delete('sortOption')
      }

      return params
    })
  }, [page, searchParams])

  const handleStarFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Get the changed value and copy a current search params
    const starValue = event.target.value
    const newParams = new URLSearchParams(searchParams)
    const stars = newParams.getAll('stars')

    // If checked new stars, append to current search params
    if (event.target.checked) {
      newParams.append('stars', starValue)
    } else {
      // Find the unchecked stars and delete
      const index = stars.indexOf(starValue)
      if (index > -1) {
        stars.splice(index, 1)
      }

      // Assign new stars into the current search params
      newParams.delete('stars')
      stars.forEach((star) => newParams.append('stars', star))
    }

    setSearchParams(newParams)
  }

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const typeValue = event.target.value
    const newParams = new URLSearchParams(searchParams)
    const types = newParams.getAll('types')

    if (event.target.checked) {
      newParams.append('types', typeValue)
    } else {
      const index = types.indexOf(typeValue)
      if (index > -1) {
        types.splice(index, 1)
      }
      newParams.delete('types')
      types.forEach((type) => newParams.append('types', type))
    }

    setSearchParams(newParams)
  }

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facilityValue = event.target.value
    const newParams = new URLSearchParams(searchParams)
    const facilities = newParams.getAll('facilities')

    if (event.target.checked) {
      newParams.append('facilities', facilityValue)
    } else {
      const index = facilities.indexOf(facilityValue)
      if (index > -1) {
        facilities.splice(index, 1)
      }
      newParams.delete('facilities')
      facilities.forEach((facility) => newParams.append('facilities', facility))
    }

    setSearchParams(newParams)
  }

  const handlePriceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Get the changed value and copy a current search params
    const currentmaxPrice = event.target.value
    const newParams = new URLSearchParams(searchParams)
    const prevMaxprice = newParams.get('maxPrice')

    if (currentmaxPrice !== prevMaxprice) {
      newParams.set('maxPrice', currentmaxPrice)
    }

    setSearchParams(newParams)
  }

  const handleSortOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Get the changed value and copy a current search params
    const currentSortOption = event.target.value
    const newParams = new URLSearchParams(searchParams)
    const prevSortOption = newParams.get('sortOption')

    if (currentSortOption !== prevSortOption) {
      newParams.set('sortOption', currentSortOption)
    }

    setSearchParams(newParams)
  }

  const {
    data: hotelData,
    isPending,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['searchHotels', searchParams.toString()],
    queryFn: () => apiClient.getSearchHotels(searchParams),
  })

  const handleReset = () => {
    // Refresh the page
    setSearchParams({})
    dispatch(clearSearchState())
    navigate(0)
  }

  return (
    // Two column layout
    <div className="custom-container py-6 w-full justify-center md:justify-between items-center md:items-start flex flex-col md:flex-row gap-6">
      {/* Side filter menu */}
      <div
        className="md:hidden w-full flex flex-row justify-end cursor-pointer"
        onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
      >
        <p className="text-sm text-neutral-600 font-semibold align-middle mr-1">
          Expand filter
        </p>
        <button className="p-1 text-base text-neutral-600">
          {isSideMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div
        className={`${
          isSideMenuOpen ? 'opacity-100 block' : 'opacity-0 hidden'
        } w-full md:block md:w-1/4 flex md:h-fit md:opacity-100 justify-start rounded border border-neutral-300 p-5 md:sticky top-24 shadow shadow-neutral-200`}
      >
        <div className="flex flex-col flex-1 gap-2 divide-y">
          <h3 className="text-sm md:text-base font-semibold text-neutral-800">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={searchParams.getAll('stars') || []}
            onChange={handleStarFilterChange}
          />
          <HotelTypeFilter
            selectedHotelTypes={searchParams.getAll('types') || []}
            onChange={handleHotelTypeChange}
          />
          <FacilityFilter
            selectedFacilities={searchParams.getAll('facilities') || []}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedMaxPrice={searchParams.get('maxPrice') || ''}
            onChange={handlePriceFilterChange}
          />
        </div>
      </div>
      {/* Search results */}
      <div className="w-full md:w-3/4 flex justify-start">
        {isPending && <Loading loadingMsg="Searching hotels..." />}
        {isError && <Error errMsg={error.message} />}
        {isSuccess && (
          <div className="flex w-full flex-col gap-4">
            {hotelData.pagination.totalHotelNum > 0 ? (
              <span className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 items-end sm:items-center">
                <span className="text-sm md:text-base font-semibold text-neutral-700">
                  {hotelData.pagination.totalHotelNum} Hotels found
                  {searchParams.get('destination')
                    ? ` in ${searchParams.get('destination')}`
                    : ''}
                </span>
                <SortDropDown
                  selectedSortOption={searchParams.get('sortOption') || ''}
                  onChange={handleSortOptionChange}
                />
              </span>
            ) : (
              <div className="flex flex-col justify-start">
                <span className="text-lg md:text-xl font-semibold text-neutral-700 mb-2">
                  No hotels found
                  {searchParams.get('destination')
                    ? ` in ${searchParams.get('destination')}`
                    : ''}
                </span>
                <span className="text-sm md:text-base text-neutral-600 mb-4">
                  Try adjusting your search criteria or browse through our
                  popular destinations. Or click the button below to reset all
                  search criteria.
                </span>
                <span className="self-start mt-4">
                  {/* <Button
                    icon={FaHome}
                    onClick={() => {
                      navigate('/')
                    }}
                  >
                    Expore More Options in the Homepage
                  </Button> */}
                  <Button
                    type="reset"
                    icon={FaArrowRotateLeft}
                    isPureIconButton={true}
                    onClick={handleReset}
                  />
                </span>
              </div>
            )}
            {hotelData?.data.length > 0 && (
              <>
                {hotelData.data.map((hotel) => (
                  <SearchResultCard
                    hotel={hotel}
                    key={`${hotel._id}_${hotel.userId}`}
                  />
                ))}
                <div className="flex justify-center">
                  <Pagination
                    page={hotelData.pagination.page || 1}
                    pages={hotelData.pagination.pages || 1}
                    onPageChange={(page) => setPage(page)}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
