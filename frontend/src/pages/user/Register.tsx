import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import { Link } from 'react-router-dom'
import { MdOutlinePermIdentity } from 'react-icons/md'
import { AiOutlineMail } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/Button'
import OAuthButton from '../../components/OAuthButton'

export const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
export const alphaRegex = /^[A-Za-z]+$/

export const registerFormSchema = z
  .object({
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
    email: z
      .string()
      .nonempty({ message: 'This field is required.' })
      .email({ message: 'A valid email address is required.' }),
    password: z
      .string()
      .nonempty({ message: 'This field is required.' })
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(20, { message: 'Password must be at most 20 characters long.' })
      .regex(passwordRegex, {
        message:
          'At least one lowercase, uppercase, number, and special character.',
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'This field is required.' }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Your passwords do not match.',
        code: 'custom',
      })
    }
  })

export type RegFormData = z.infer<typeof registerFormSchema>

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const registerMutation = useMutation({
    mutationFn: apiClient.register,
    retry: false,
    onSuccess: async (data, formData: RegFormData) => {
      toast.success(data.message)
      verifyMutation.mutate({ email: formData.email })
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const verifyMutation = useMutation({
    mutationFn: apiClient.sendVerifyEmail,
    retry: false,
    onSuccess: async (data) => {
      toast.info(data.message)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const onRegisterFormSubmit = handleSubmit((data: RegFormData) => {
    registerMutation.mutate(data)
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <section className="custom-container">
      <form
        className="form-container flex flex-col md:gap-4 gap-6 my-12 py-6 shadow rounded-md"
        onSubmit={onRegisterFormSubmit}
      >
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800 pb-4">
          Create a new account
        </h2>
        <div className="flex flex-col md:gap-4 md:flex-row gap-6">
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
        </div>
        <label className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
          Email
          <input
            type="email"
            className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
            {...register('email')}
          />
          <AiOutlineMail className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
          {errors.email && (
            <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
              {errors.email.message}
            </span>
          )}
        </label>
        <label className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
          Password
          <input
            type={showPassword ? 'text' : 'password'}
            className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
            {...register('password')}
          />
          <RiLockPasswordLine className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
          {showPassword ? (
            <FiEye
              onClick={togglePasswordVisibility}
              className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 right-2"
            />
          ) : (
            <FiEyeOff
              onClick={togglePasswordVisibility}
              className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 right-2"
            />
          )}
          {errors.password && (
            <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
              {errors.password.message}
            </span>
          )}
        </label>
        <label className="text-sm md:text-basee font-medium text-neutral-700 flex-1 relative">
          Confirm Password
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
            {...register('confirmPassword')}
          />
          <RiLockPasswordLine className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 left-2" />
          {showConfirmPassword ? (
            <FiEye
              onClick={toggleConfirmPasswordVisibility}
              className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 right-2"
            />
          ) : (
            <FiEyeOff
              onClick={toggleConfirmPasswordVisibility}
              className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-0.5 md:translate-y-1 right-2"
            />
          )}
          {errors.confirmPassword && (
            <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
        <span className="flex flex-col gap-3 items-start">
          <p className="text-sm font-medium text-neutral-600">
            Already have an account?{' '}
            <Link
              className="text-sky-600 underline hover:opacity-50 btn-transition"
              to="../signin"
            >
              Sign in
            </Link>{' '}
            here.
          </p>
        </span>
        <div className="border-t border-neutral-200 flex-1" />
        <span className="grid gap-3 w-full">
          <Button
            type="submit"
            isPending={registerMutation.isPending}
            pendingMessage="Submitting"
          >
            Register
          </Button>
          <OAuthButton />
        </span>
      </form>
    </section>
  )
}

export default Register
