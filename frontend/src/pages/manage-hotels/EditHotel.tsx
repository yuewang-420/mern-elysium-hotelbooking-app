import { useQuery, useMutation } from '@tanstack/react-query'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import ManageHotelForm from './manage-hotel-form/ManageHotelForm'
import { toast } from 'react-toastify'
import * as apiClient from '../../api-client'
import { useNavigate, useParams } from 'react-router-dom'

const EditHotel = () => {
  const { hotelId } = useParams()
  const navigate = useNavigate()

  const {
    data: hotel,
    isPending: isFetchPending,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['fetchMyHotelById'],
    queryFn: () => apiClient.fetchMyHotelById(hotelId as string),
    retry: false,
    enabled: !!hotelId,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.updateMyHotelById,
    onSuccess: () => {
      toast.success('Hotel updated successfully.')
      navigate('../my-hotels')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleSave = (data: FormData) => {
    mutate(data)
  }

  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          Edit an existing hotel
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Simply update some information and we will review your posts and post
          it to our platform upon approval.
        </p>
      </span>
      {isFetchPending && <Loading loadingMsg="Fetching your hotel..." />}
      {isError && <Error errMsg={error.message} />}
      {isSuccess && hotel && (
        <ManageHotelForm
          hotel={hotel}
          onSave={handleSave}
          isPending={isPending}
          imageUrls={hotel.imageUrls}
        />
      )}
    </section>
  )
}

export default EditHotel
