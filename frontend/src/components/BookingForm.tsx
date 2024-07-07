import { useEffect } from 'react'
import * as apiClient from '../api-client'
import { useAppSelector, RootState } from '../store'
import { UserInfo } from '../slices/authSlice'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { alphaRegex } from '../pages/user/Register'
import { zodResolver } from '@hookform/resolvers/zod'
import { AiOutlineMail } from 'react-icons/ai'
import { MdOutlinePermIdentity } from 'react-icons/md'
import { stripePromise } from '../globalInstance/stripe'
import { StripeCardElement } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Loading from './Loading'
import Error from './Error'
import { PaymentIntentResponse } from '../../../backend/src/shared/types'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

type BookingFormComponentProps = {
  hotelId: string
  paymentIntentData: PaymentIntentResponse
}

const bookingFormSchema = z.object({
  firstName: z
    .string({ message: 'This field is required.' })
    .regex(alphaRegex, {
      message: 'Only English letters are accepted.',
    })
    .min(2, { message: 'At least 2 characters.' })
    .max(20, { message: 'At most 20 characters.' }),
  lastName: z
    .string({ message: 'This field is required.' })
    .regex(alphaRegex, {
      message: 'Only English letters are accepted.',
    })
    .min(2, { message: 'At least 2 characters.' })
    .max(20, { message: 'At most 20 characters.' }),
  email: z.string().email({ message: 'Invalid email address' }),
  adultCount: z.number().int(),
  childCount: z.number().int(),
  checkIn: z.string(),
  checkOut: z.string(),
  hotelId: z.string(),
  paymentIntentId: z.string(),
  totalCost: z.number().min(0, { message: 'Total cost cannot be negative' }),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

const BookingFormComponent = ({
  hotelId,
  paymentIntentData,
}: BookingFormComponentProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const { checkIn, checkOut, adultCount, childCount } = useAppSelector(
    (state: RootState) => state.search
  )
  const userInfo = useAppSelector(
    (state: RootState) => state.auth.userInfo
  ) as UserInfo
  const { firstName, lastName, email } = userInfo

  const checkInDate = new Date(checkIn as string)
  const checkOutDate = new Date(checkOut as string)
  const checkInDateString = checkInDate.toISOString()
  const checkOutDateString = checkOutDate.toISOString()
  const adultNum = parseInt(adultCount as string)
  const childNum = parseInt((childCount as string) || '0')

  const {
    mutate: createBooking,
    isPending,
    error,
  } = useMutation({
    mutationFn: apiClient.createBooking,
    onSuccess: () => {
      toast.success('Booking successful 🎉')
      navigate('/my-bookings')
    },
    onError: () => {
      toast.error(error?.message || 'Failed booking. Maybe try later?')
    },
  })

  const onSubmit = async (bookingFormData: BookingFormData) => {
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const result = await stripe.confirmCardPayment(
      paymentIntentData.clientSecret,
      {
        payment_method: {
          card: cardElement as StripeCardElement,
        },
      }
    )

    if (result.error) {
      toast.error(result.error.message)
    } else if (result.paymentIntent?.status === 'succeeded') {
      createBooking({
        ...bookingFormData,
        paymentIntentId: result.paymentIntent.id,
      })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      adultCount: adultNum,
      childCount: childNum,
      checkIn: checkInDateString,
      checkOut: checkOutDateString,
      hotelId: hotelId,
      totalCost: paymentIntentData.totalCost,
      paymentIntentId: paymentIntentData.paymentIntentId,
    },
    mode: 'all',
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 last:divide-y-0 px-6 py-4 w-full md:basis-3/5 border border-neutral-200 rounded-md shadow-sm shadow-neutral-50"
    >
      <div className="flex flex-col gap-2 pb-6 border-b border-neutral-200">
        <h2 className="text-lg md:text-xl font-bold text-neutral-800">
          Confirm Personal Information
        </h2>
        <div className="flex flex-col gap-2">
          <span className="flex flex-col gap-1">
            <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">
              This email address is used for signing in and sending booking
              confirmations.
            </p>
            <label className="text-sm md:text-base font-semibold text-neutral-700 relative">
              Email
              <input
                type="text"
                readOnly
                disabled
                className="focus:outline-none text-xs md:text-sm font-semibold md:font-medium text-neutral-600 bg-neutral-200 border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                {...register('email')}
              />
              <AiOutlineMail className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
            </label>
          </span>
          <span className="flex flex-col gap-1">
            <p className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600">
              Your name will be verified when you check in at the accommodation.
            </p>
            <span className="flex flex-col gap-2">
              <label className="text-sm md:text-base font-semibold text-neutral-700 relative">
                First name
                <input
                  type="text"
                  className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600 border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                  {...register('firstName')}
                />
                <MdOutlinePermIdentity className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
                {errors.firstName && (
                  <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                    {errors.firstName.message}
                  </span>
                )}
              </label>
              <label className="text-sm md:text-base font-semibold text-neutral-700 relative">
                Last name
                <input
                  type="text"
                  className="text-xs md:text-sm font-semibold md:font-medium text-neutral-600 border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                  {...register('lastName')}
                />
                <MdOutlinePermIdentity className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
                {errors.lastName && (
                  <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                    {errors.lastName.message}
                  </span>
                )}
              </label>
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg md:text-xl font-bold text-neutral-800">
          Pay with Stripe
        </h2>
        <span className="flex flex-col gap-2">
          <h3 className="text-sm md:text-base font-semibold text-neutral-700">
            Your total price will be
          </h3>
          <span className="bg-blue-100 p-4 rounded">
            <p className="font-semibold text-base md:text-lg text-neutral-800">
              Total Cost: $ {paymentIntentData.totalCost.toFixed(2)} AUD
            </p>
            <p className="text-sm md:text-base text-neutral-600 font-normal">
              Includes taxes and charges
            </p>
          </span>
        </span>
        <span className="flex flex-col gap-2">
          <h3 className="text-sm md:text-base font-semibold text-neutral-700">
            Payment method
          </h3>
          <CardElement id="payment-element" className="border rounded-md p-2" />
        </span>
      </div>
      <Button
        type="submit"
        textColor="text-white"
        bgColor="bg-blue-600"
        textHoverColor="hover:text-blue-600"
        bgHoverColor="hover:bg-white"
        isPending={isPending}
      >
        Pay Now
      </Button>
    </form>
  )
}

type BookingFormProps = {
  hotelId: string
}

const BookingForm = ({ hotelId }: BookingFormProps) => {
  const { checkIn, checkOut } = useAppSelector(
    (state: RootState) => state.search
  )
  const checkInDate = new Date(checkIn as string)
  const checkOutDate = new Date(checkOut as string)

  const nightNum = Math.ceil(
    Math.abs(checkInDate.getTime() - checkOutDate.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const {
    data: paymentIntentData,
    error,
    isError,
    isPending,
    mutate: intentMutate,
  } = useMutation({
    mutationFn: () =>
      apiClient.createPaymentIntent(hotelId as string, nightNum),
    onError: () => {
      toast.error(error?.message || 'Stripe service failed.')
    },
  })

  useEffect(() => {
    intentMutate()
  }, [])

  if (isPending) {
    return (
      <form className="flex flex-col gap-2 px-6 py-4 w-full md:basis-3/5 border border-neutral-200 rounded-md shadow-sm shadow-neutral-50">
        <h2 className="text-lg md:text-xl font-bold text-neutral-800">
          Confirm and Pay Now
        </h2>
        <Loading loadingMsg="Creating payment intent. Please be patient..." />
      </form>
    )
  }

  if (isError) {
    return (
      <form className="flex flex-col gap-2 px-6 py-4 w-full md:basis-3/5 border border-neutral-200 rounded-md shadow-sm shadow-neutral-50">
        <h2 className="text-lg md:text-xl font-bold text-neutral-800">
          Confirm and Pay Now
        </h2>
        <Error errMsg={error.message} />
      </form>
    )
  }

  if (paymentIntentData) {
    return (
      <Elements stripe={stripePromise}>
        <BookingFormComponent
          hotelId={hotelId}
          paymentIntentData={paymentIntentData}
        />
      </Elements>
    )
  }
}

export default BookingForm
