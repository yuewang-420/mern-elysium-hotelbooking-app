import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useState } from 'react'
import Button from '../../components/Button'
import StepIndicator from '../../components/StepIndicator'
import StepConnector from '../../components/StepConnector'
import BasicInformation from './add-hotel-form/BasicInformation'
import AddressInformation from './add-hotel-form/AddressInformation'
import GuestRoomInformation from './add-hotel-form/GuestRoomInformation'
import UploadImages from './add-hotel-form/UploadImages'
import * as apiClient from '../../api-client'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const addHotelSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .nonempty('Name is required.'),
  roomNumber: z
    .number({ message: 'A valid room number is required.' })
    .int()
    .min(0, { message: 'Room number must be a non-negative integer.' }),
  streetAddress: z.string().nonempty('Street address is required.'),
  city: z.string().nonempty('City is required.'),
  country: z.string().nonempty('Country is required.'),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(5000, { message: 'Description cannot exceed 5000 characters.' })
    .nonempty('Description is required.'),
  type: z.string({ message: 'Hotel type is required.' }).nonempty(),
  adultCount: z
    .number({ message: 'Adult count is required.' })
    .int()
    .min(1, { message: 'Adult count must be an integer greater than 1.' })
    .max(6, {
      message: 'Adult count must be an integer equal or smaller than 6.',
    }),
  childCount: z
    .number({ message: 'child count is required.' })
    .int()
    .min(0, { message: 'Child count must be a non-negative integer.' })
    .max(2, {
      message: 'Child count must be an integer equal or smaller than 2.',
    }),
  starRating: z
    .number()
    .int({ message: 'Star rating is required.' })
    .min(1)
    .max(5, { message: 'Star rating must be between 1 and 5.' }),
  pricePerNight: z
    .number({ message: 'A valid price per night is required.' })
    .min(1, { message: 'Price per night must be at least 1.' })
    .max(10000, { message: 'Price per night cannot exceed 10000.' }),
  facilities: z
    .array(z.string(), { message: 'Facilities are required.' })
    .nonempty(),
  imageFiles: z
    .array(z.instanceof(File), {
      message: 'At least one image should be added',
    })
    .min(1, { message: 'At least one image should be added' })
    .max(6, { message: 'Total number of images cannot be more than 6' }),
})

export type AddHotelFormData = z.infer<typeof addHotelSchema>

const AddHotel = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const formMethods = useForm<AddHotelFormData>({
    resolver: zodResolver(addHotelSchema),
    defaultValues: {},
  })

  const { trigger, handleSubmit } = formMethods

  const stepFields = [
    ['name', 'starRating', 'type', 'facilities', 'description'],
    ['streetAddress', 'city', 'country'],
    ['roomNumber', 'adultCount', 'childCount', 'pricePerNight'],
  ]

  const stepFormDescription = ['Basic', 'Address', 'Room', 'Images']

  const nextStep = () => {
    trigger(stepFields[currentStep - 1] as any[]).then((isValid) => {
      if (isValid) {
        setCurrentStep(currentStep + 1)
      }
    })
  }

  const prevStep = () => {
    if (currentStep !== 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: apiClient.addNewHotel,
    onSuccess: () => {
      toast.success('Hotel added successfully.')
      navigate('../my-hotels')
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const onAddHotelSubmit = handleSubmit(
    (addHotelFormData: AddHotelFormData) => {
      const formData = new FormData()

      formData.append('name', addHotelFormData.name)
      formData.append('starRating', addHotelFormData.starRating.toString())
      formData.append('type', addHotelFormData.type)
      addHotelFormData.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility)
      })
      formData.append('description', addHotelFormData.description)

      formData.append('streetAddress', addHotelFormData.streetAddress)
      formData.append('city', addHotelFormData.city)
      formData.append('country', addHotelFormData.country)

      formData.append('roomNumber', addHotelFormData.roomNumber.toString())
      formData.append('adultCount', addHotelFormData.adultCount.toString())
      formData.append('childCount', addHotelFormData.childCount.toString())
      formData.append(
        'pricePerNight',
        addHotelFormData.pricePerNight.toString()
      )

      Array.from(addHotelFormData.imageFiles).forEach((imageFile) => {
        formData.append(`imageFiles`, imageFile)
      })

      mutation.mutate(formData)
    }
  )

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
      <FormProvider {...formMethods}>
        <div>
          <div className="flex flex-1 justify-center mt-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex justify-between items-center">
                <StepIndicator
                  step={step}
                  currentStep={currentStep}
                  description={stepFormDescription[step - 1]}
                  isValid={currentStep > step}
                />
                {step < 4 && <StepConnector isValid={currentStep > step} />}
              </div>
            ))}
          </div>
          <form className="flex flex-col md:gap-4 gap-6 py-4">
            {currentStep === 1 && <BasicInformation />}
            {currentStep === 2 && <AddressInformation />}
            {currentStep === 3 && <GuestRoomInformation />}
            {currentStep === 4 && <UploadImages />}
          </form>
          <span
            className={`flex flex-row mt-4 ${
              currentStep === 1 ? 'justify-end' : 'justify-between'
            }`}
          >
            {currentStep !== 1 && <Button onClick={prevStep}>Prev</Button>}

            {currentStep !== 4 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button
                type="submit"
                onClick={onAddHotelSubmit}
                isPending={mutation.isPending}
                pendingMessage="Submitting..."
              >
                Submit
              </Button>
            )}
          </span>
        </div>
      </FormProvider>
    </section>
  )
}

export default AddHotel
