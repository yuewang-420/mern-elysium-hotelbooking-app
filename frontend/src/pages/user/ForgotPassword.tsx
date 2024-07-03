import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import { Link } from 'react-router-dom'
import { AiOutlineMail } from 'react-icons/ai'
import Button from '../../components/Button'
import { toast } from 'react-toastify'

const forgotPasswordFormSchema = z.object({
  email: z
    .string({ message: 'This field is required.' })
    .email({ message: 'A valid email address is required.' }),
})
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: 'all',
  })

  const forgotPasswordMutation = useMutation({
    // mutationFn: apiClient.sendResetPasswordEmail,
    mutationFn: apiClient.requestPasswordResetLink,
    retry: false,
    onSuccess: async (data) => {
      toast.info(data.message)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const onForgotPasswordFormSubmit = handleSubmit(
    (data: ForgotPasswordFormData) => {
      forgotPasswordMutation.mutate(data)
    }
  )

  return (
    <section className="custom-container">
      <form
        className="form-container flex flex-col gap-4 my-12 py-6 shadow shadow-neutral-200 rounded-md"
        onSubmit={onForgotPasswordFormSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800">
          Forgot your password?
        </h2>
        <p className="text-md font-medium text-neutral-600 pb-2">
          Don't worry. Enter your email to reset.
        </p>

        <div className="flex flex-col gap-6">
          {' '}
          <label className="text-base font-medium text-neutral-700 flex-1 relative">
            Email
            <input
              type="email"
              className="text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
              {...register('email')}
            />
            <AiOutlineMail className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 left-2" />
            {errors.email && (
              <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                {errors.email.message}
              </span>
            )}
          </label>
          <span className="w-full items-start">
            <p className="text-sm font-medium text-neutral-600">
              Haven't registered yet?{' '}
              <Link
                className="text-sky-600 underline hover:opacity-50 btn-transition"
                to="../register"
              >
                Sign up
              </Link>{' '}
              here.
            </p>
          </span>
          <div className="border-t border-neutral-200 flex-1" />
          <span className="grid w-full">
            <Button
              type="submit"
              isPending={forgotPasswordMutation.isPending}
              pendingMessage="Submitting"
            >
              Submit
            </Button>
          </span>
        </div>
      </form>
    </section>
  )
}

export default ForgotPassword
