import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useState } from 'react'
import Button from '../../../components/Button'
import StepIndicator from '../../../components/StepIndicator'
import StepConnector from '../../../components/StepConnector'
import BasicInformation from './BasicInformation'
import AddressInformation from './AddressInformation'
import GuestRoomInformation from './GuestRoomInformation'
import UploadImages from './UploadImages'
import { HotelType } from '../../../../../backend/src/shared/types'
import { useEffect } from 'react'

const streetAddressRegex = /^(?=.*\d)(?=.*[a-zA-Z]).+$/

const manageHotelSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters.' })
      .max(50, { message: 'Name cannot exceed 50 characters.' })
      .nonempty('Name is required.'),
    roomNumber: z
      .number({ message: 'A valid room number is required.' })
      .int()
      .min(0, { message: 'Room number must be a non-negative integer.' }),
    streetAddress: z
      .string({ message: 'Street address is required.' })
      .regex(streetAddressRegex, {
        message: 'Street address must contain street number and name.',
      }),
    city: z.string({ message: 'City is required.' }),
    country: z.string({ message: 'Country is required.' }),
    description: z
      .string({ message: 'Description is required.' })
      .min(10, { message: 'Description must be at least 10 characters.' })
      .max(5000, { message: 'Description cannot exceed 5000 characters.' }),
    type: z.string({ message: 'Hotel type is required.' }),
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
    imageFiles: z.union([z.array(z.instanceof(File)), z.any()]),
    imageUrls: z.union([z.array(z.string()), z.any()]),
  })
  .superRefine(({ imageFiles, imageUrls }, ctx) => {
    const imageFilesLength = Array.isArray(imageFiles) ? imageFiles.length : 0
    const imageUrlsLength = Array.isArray(imageUrls) ? imageUrls.length : 0
    if (imageFilesLength + imageUrlsLength < 1) {
      ctx.addIssue({
        path: ['imageFiles'],
        message: 'At least one image is required.',
        code: 'custom',
      })
    }

    if (imageFilesLength + imageUrlsLength > 6) {
      ctx.addIssue({
        path: ['imageFiles'],
        message: 'At most six images can be uploaded.',
        code: 'custom',
      })
    }
  })

type ManageHotelFormProps = {
  hotel?: HotelType
  onSave: (hotelFormData: FormData) => void
  isPending: boolean
  imageUrls?: string[]
}

export type ManageHotelFormData = z.infer<typeof manageHotelSchema>

const ManageHotelForm = ({
  hotel,
  onSave,
  isPending,
  imageUrls,
}: ManageHotelFormProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const formMethods = useForm<ManageHotelFormData>({
    resolver: zodResolver(manageHotelSchema),
    defaultValues: {},
  })

  const {
    trigger,
    handleSubmit,
    reset,
    watch,
    formState: { dirtyFields },
  } = formMethods

  useEffect(() => {
    reset(hotel)
  }, [hotel, reset])

  const [isFormChanged, setIsFormChanged] = useState<boolean>(
    Object.keys(dirtyFields).length > 0
  )

  useEffect(() => {
    if (
      hotel &&
      (JSON.stringify(hotel.imageUrls) !== JSON.stringify(watch('imageUrls')) ||
        watch('imageFiles') instanceof FileList)
    ) {
      setIsFormChanged(true)
    }
  }, [watch('imageFiles'), watch('imageUrls')])

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

  const onSubmit = handleSubmit((manageHotelFormData: ManageHotelFormData) => {
    const formData = new FormData()
    if (hotel) {
      formData.append('hotelId', hotel._id)
    }

    formData.append('name', manageHotelFormData.name)
    formData.append('starRating', manageHotelFormData.starRating.toString())
    formData.append('type', manageHotelFormData.type)
    manageHotelFormData.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility)
    })
    formData.append('description', manageHotelFormData.description)

    formData.append('streetAddress', manageHotelFormData.streetAddress)
    formData.append('city', manageHotelFormData.city)
    formData.append('country', manageHotelFormData.country)

    formData.append('roomNumber', manageHotelFormData.roomNumber.toString())
    formData.append('adultCount', manageHotelFormData.adultCount.toString())
    formData.append('childCount', manageHotelFormData.childCount.toString())
    formData.append(
      'pricePerNight',
      manageHotelFormData.pricePerNight.toString()
    )

    if (
      manageHotelFormData.imageUrls &&
      manageHotelFormData.imageUrls.length !== 0
    ) {
      ;(manageHotelFormData.imageUrls as string[]).forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url)
      })
    } else {
      formData.append('imageUrls', 'EMPTY_ARRAY')
    }

    if (
      manageHotelFormData.imageFiles &&
      manageHotelFormData.imageFiles.length !== 0
    ) {
      ;(Array.from(manageHotelFormData.imageFiles) as File[]).forEach(
        (imageFile) => {
          formData.append(`imageFiles`, imageFile)
        }
      )
    }

    onSave(formData)
  })
  return (
    <FormProvider {...formMethods}>
      <div>
        <div className="flex flex-1 justify-center pt-4 gap-2">
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
          {currentStep === 4 && <UploadImages initialImageUrls={imageUrls} />}
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
              onClick={onSubmit}
              isPending={isPending}
              pendingMessage="Submitting..."
              isFormStatusChanged={isFormChanged}
            >
              Submit
            </Button>
          )}
        </span>
      </div>
    </FormProvider>
  )
}

export default ManageHotelForm
