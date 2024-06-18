import { useQuery, useMutation } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import { useForm } from 'react-hook-form'
import Loading from '../../components/Loading'
import { toast } from 'react-toastify'
import Error from '../../components/Error'
import Button from '../../components/Button'
import { MdOutlinePermIdentity } from 'react-icons/md'
import { AiOutlineMail } from 'react-icons/ai'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { queryClient } from '../../main'
import { alphaRegex } from './Register'
import { useAppDispatch } from '../../store'
import { setCredentials } from '../../slices/authSlice'
import Badge from '../../components/Badge'

export const updateProfileFormSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: 'This field is required.' })
    .regex(alphaRegex, {
      message: 'Only English letters are accepted.',
    })
    .min(2, { message: 'At least 2 characters.' })
    .max(20, { message: 'At most 20 characters.' }),
  lastName: z
    .string()
    .nonempty({ message: 'This field is required.' })
    .regex(alphaRegex, {
      message: 'Only English letters are accepted.',
    })
    .min(2, { message: 'At least 2 characters.' })
    .max(20, { message: 'At most 20 characters.' }),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

const PersonalDetails = () => {
  const dispatch = useAppDispatch()

  const {
    data: profileData,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: apiClient.getProfile,
    retry: false,
    // staleTime: 1000 * 60 * 10,
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  useEffect(() => {
    if (isSuccess) {
      setValue('firstName', profileData.firstName || '')
      setValue('lastName', profileData.lastName || '')
    }
  }, [isSuccess, profileData, setValue])

  const isFormChanged = Object.keys(dirtyFields).length > 0

  const updateProfileMutation = useMutation({
    mutationFn: apiClient.updateProfile,
    retry: false,
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      dispatch(setCredentials(updatedData))
      reset(updatedData)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const onUpdateProfileFormSubmit = handleSubmit(
    (data: UpdateProfileFormData) => {
      updateProfileMutation.mutate(data)
    }
  )

  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <span className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          Personal details
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Keep your personal information up to date and learn how we use it.
        </p>
      </span>
      <form
        className="w-full flex flex-col py-4 md:gap-4 gap-6"
        onSubmit={onUpdateProfileFormSubmit}
      >
        {isLoading && <Loading loadingMsg="Fetching personal details..." />}
        {isError && <Error errMsg={error.message} />}
        {isSuccess && (
          <>
            <p className="text-xs md:text-sm text-neutral-600">
              This is your sign-in email. We also use it to send booking
              confirmations.
            </p>
            <label className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
              Email
              <p className="text-clip text-sm md:text-base border border-neutral-300 rounded w-full py-1 pl-8 pr-24 mt-1 select-none">
                <AiOutlineMail className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 md:translate-y-1.5 left-2" />
                {profileData.verified && (
                  <span className="absolute text-clip -translate-y-7 right-2 top-1/2 transform sm:translate-y-0">
                    <Badge badgeInfo="Verified" />
                  </span>
                )}
                {profileData.email}
              </p>
            </label>

            <p className="text-xs md:text-sm text-neutral-600">
              Update your personal details below.
            </p>
            <label className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
              First Name
              <input
                type="text"
                className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                {...register('firstName')}
              />
              <MdOutlinePermIdentity className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
              {errors.firstName && (
                <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                  {errors.firstName.message}
                </span>
              )}
            </label>
            <label className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
              Last Name
              <input
                type="text"
                className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                {...register('lastName')}
              />
              <MdOutlinePermIdentity className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
              {errors.lastName && (
                <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                  {errors.lastName.message}
                </span>
              )}
            </label>

            <span className="flex flex-row justify-center w-full">
              <Button type="submit" isFormStatusChanged={isFormChanged}>
                Update
              </Button>
            </span>
          </>
        )}
      </form>
    </section>
  )
}

export default PersonalDetails
