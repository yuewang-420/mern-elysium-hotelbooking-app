import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import { FetchError } from '../../api-client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaQuestionCircle, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Button from '../../components/Button'
import { passwordRegex } from './Register'

export const resetPasswordFormSchema = z
  .object({
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

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>

export type ResetPasswordRequestData = {
  email: string
  prevPassword: string
  otp: string
  password: string
}

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [resBody, setResBody] = useState<{
    email: string
    prevPassword: string
    otp: string
  }>({ email: '', prevPassword: '', otp: '' })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'all',
  })

  const verifyMutation = useMutation({
    mutationFn: apiClient.verifyResetLink,
    onSuccess: async (data) => {
      setResBody(data)
    },
    onError: async (err: FetchError) => {
      if (err.body?.isExpired && err.body?.exists) {
        toast.info(err.message)
        setTimeout(() => {
          navigate('../forgot-password')
        }, 8000)
      } else {
        toast.error(err.message)
        navigate('/')
      }
    },
  })

  const resetMutation = useMutation({
    mutationFn: apiClient.resetPassword,
    retry: false,
    onSuccess: async (data) => {
      toast.success(data.message)
      setTimeout(() => {
        navigate('../signin')
      }, 8000)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token })
    } else {
      toast.error('Invalid URL.')
      navigate('/')
    }
  }, [])

  const onResetPasswordSubmit = handleSubmit((data: ResetPasswordFormData) => {
    const { password } = data
    const { email, prevPassword, otp } = resBody
    if (email && prevPassword && otp && password) {
      resetMutation.mutate({
        email,
        prevPassword,
        otp,
        password,
      })
    } else {
      // Handle the case where these properties are missing in resBody
      throw new Error('Missing required properties in request body')
    }
  })

  return (
    <section className="custom-container">
      <form
        className="form-container flex flex-col gap-4 my-12 py-6 shadow shadow-neutral-200 rounded-md"
        onSubmit={onResetPasswordSubmit}
      >
        {verifyMutation.isPending && (
          <>
            <AiOutlineLoading3Quarters className="text-6xl md:text-8xl text-sky-500 animate-spin" />
            <p className="text-base font-meidum text-neutral-700 pb-4 text-start">
              We are verifying this link. Please be patient.
            </p>
          </>
        )}
        {verifyMutation.isError && (
          <>
            <FaQuestionCircle className="text-6xl md:text-8xl text-yellow-500" />
            <p className="text-base font-meidum text-neutral-700 pb-4 text-start">
              Something went wrong. You will be redirected to forgot password
              page in seconds...
            </p>
          </>
        )}

        {verifyMutation.isSuccess && !resetMutation.isSuccess && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 pb-4">
              Reset your password
            </h2>
            <div className="flex flex-col gap-6">
              <label className="text-base font-medium text-neutral-700 flex-1 relative">
                Password
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                  {...register('password')}
                />
                <RiLockPasswordLine className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 left-2" />
                {showPassword ? (
                  <FiEye
                    onClick={togglePasswordVisibility}
                    className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 right-2"
                  />
                ) : (
                  <FiEyeOff
                    onClick={togglePasswordVisibility}
                    className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 right-2"
                  />
                )}
                {errors.password && (
                  <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                    {errors.password.message}
                  </span>
                )}
              </label>
              <label className="text-base font-medium text-neutral-700 flex-1 relative">
                Confirm Password
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="text-base border border-neutral-300 rounded w-full py-1 px-8 mt-1"
                  {...register('confirmPassword')}
                />
                <RiLockPasswordLine className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 left-2" />
                {showConfirmPassword ? (
                  <FiEye
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 right-2"
                  />
                ) : (
                  <FiEyeOff
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-xl text-neutral-700 absolute top-1/2 transform translate-y-1 right-2"
                  />
                )}
                {errors.confirmPassword && (
                  <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </label>
              <div className="border-t border-neutral-200 flex-1" />
              <span className="grid w-full">
                <Button
                  type="submit"
                  isPending={resetMutation.isPending}
                  pendingMessage="Submitting"
                >
                  Submit
                </Button>
              </span>
            </div>
          </>
        )}
        {verifyMutation.isSuccess && resetMutation.isSuccess && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 pb-4">
              Reset your password
            </h2>
            <FaCheckCircle className="text-6xl md:text-8xl text-green-500" />
            <p className="text-base font-meidum text-neutral-700 pb-4 text-start">
              Your password has been updated successfully. You will be
              redirected to sign in page in seconds...
            </p>
          </>
        )}
      </form>
    </section>
  )
}

export default ResetPassword
