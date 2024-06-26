import { useQuery } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import MyHotelCard from '../../components/MyHotelCard'
import Button from './../../components/Button'
import { useNavigate } from 'react-router-dom'

const MyHotels = () => {
  const {
    data: myHotelData,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['myHotels'],
    queryFn: apiClient.getMyHotels,
    retry: false,
  })

  const navigate = useNavigate()
  const handleClick = () => navigate('../add-hotel')

  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          My hotels
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Have an overview of all your hotels. You can simply select one hotel
          to view its details or edit it.
        </p>
      </span>
      {isLoading && <Loading loadingMsg="Fetching your hotels..." />}
      {isError && <Error errMsg={error.message} />}
      {isSuccess && myHotelData.length > 0 && (
        <div className="flex flex-col gap-6 w-full pt-4">
          {myHotelData.map((hotel) => (
            <MyHotelCard hotel={hotel} />
          ))}
        </div>
      )}
      :
      {isSuccess && myHotelData.length === 0 && (
        <div className="mx-auto max-w-screen-sm text-center flex flex-col">
          <h1 className="mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-neutral-800">
            No Hotels Found
          </h1>
          <p className="mb-4 text-lg font-light text-neutral-600">
            Sorry, we couldn't find any hotels associated with your account.
          </p>
          <span className="mx-auto flex-1">
            <Button onClick={handleClick}>Go to Add a New Hotel</Button>
          </span>
        </div>
      )}
    </section>
  )
}

export default MyHotels
