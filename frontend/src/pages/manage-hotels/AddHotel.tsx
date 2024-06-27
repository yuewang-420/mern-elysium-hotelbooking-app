import { useMutation } from '@tanstack/react-query'
import ManageHotelForm from './manage-hotel-form/ManageHotelForm'
import { toast } from 'react-toastify'
import * as apiClient from '../../api-client'
import { useNavigate } from 'react-router-dom'

const AddHotel = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.addNewHotel,
    onSuccess: () => {
      toast.success('Hotel added successfully.')
      navigate('../my-hotels')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleSave = (formData: FormData) => {
    mutate(formData)
  }
  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          Add a new hotel
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Simply provide some basic information and we will review your
          submission and post it to our platform upon approval.
        </p>
      </span>
      <ManageHotelForm onSave={handleSave} isPending={isPending} />
    </section>
  )
}

export default AddHotel
