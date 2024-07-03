import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import OAuthButton from '../../components/OAuthButton'
import { AiOutlineMail } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { toast } from 'react-toastify'
import { setCredentials } from '../../slices/authSlice'
import confetti from 'canvas-confetti'
import { passwordRegex } from './Register'

const signInFormSchema = z.object({
  email: z
    .string({ message: 'This field is required.' })
    .email({ message: 'A valid email address is required.' }),
  password: z
    .string({ message: 'This field is required.' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(passwordRegex, {
      message:
        'At least one lowercase, uppercase, number, and special character (!@#$%^&*).',
    }),
})

export type SignInFormData = z.infer<typeof signInFormSchema>

const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    mode: 'all',
  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const authMutation = useMutation({
    mutationFn: apiClient.signIn,
    retry: false,
    onSuccess: async (data) => {
      dispatch(setCredentials(data))
      navigate('/')
      toast(`🎉 Welcome onboard ${data.firstName}`)
      confetti({
        particleCount: 200,
        spread: 120,
        gravity: 0.75,
      })
      if (typeof location.state?.from === 'string') {
        toast.info(`You will be redirected to the last page in seconds.`)
        setTimeout(() => {
          navigate(location.state.from)
        }, 6000)
      }
    },
    onError: async (err: Error, data: SignInFormData) => {
      if (err.message === 'Your email has not been verified yet.') {
        toast.info(err.message)
        verifyMutation.mutate({ email: data.email })
      } else {
        toast.error(err.message)
      }
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

  const onSignInFormSumit = handleSubmit((data: SignInFormData) => {
    authMutation.mutate(data)
  })

  return (
    <section className="custom-container">
      <form
        className="form-container flex flex-col gap-6 my-12 py-6 shadow shadow-neutral-200 rounded-md flex-grow"
        onSubmit={onSignInFormSumit}
      >
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800 pb-4">
          Sign in as a current user
        </h2>
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
        <span className="flex flex-col w-full gap-1 items-start">
          <p className="text-sm font-medium text-neutral-600">
            Haven't registered yet?{' '}
            <Link
              className="text-blue-600 underline hover:opacity-50 btn-transition"
              to="../register"
            >
              Register
            </Link>
            here.
          </p>
          <Link
            className="text-sm font-medium text-blue-600 underline hover:opacity-50 btn-transition"
            to="../forgot-password"
          >
            Forgot Password?
          </Link>
        </span>
        <div className="border-t border-neutral-200 flex-1" />
        <span className="grid gap-3 w-full">
          <Button type="submit" isPending={authMutation.isPending}>
            Log In
          </Button>
          <OAuthButton />
        </span>
      </form>
    </section>
  )
}

export default SignIn
