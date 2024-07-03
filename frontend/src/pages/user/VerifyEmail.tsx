import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../../api-client'
import { FetchError } from '../../api-client'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'
import confetti from 'canvas-confetti'
import { FaQuestionCircle, FaCheckCircle } from 'react-icons/fa'

const VerifyEmail = () => {
  const { emailToken } = useParams()
  const navigate = useNavigate()
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: apiClient.verifyEmail,
    retry: false,
  })

  useEffect(() => {
    if (emailToken) {
      mutate(
        { token: emailToken },
        {
          onSuccess: async (data) => {
            toast.success(data.message)
            confetti({
              particleCount: 200,
              spread: 120,
              gravity: 0.75,
            })
            setTimeout(() => {
              navigate('../signin')
            }, 8000)
          },
          onError: async (error: Error) => {
            const err = error as FetchError
            if (err.body?.isExpired && err?.body?.exists) {
              toast.info(err.message)
              setTimeout(() => {
                navigate('/')
              }, 8000)
            } else {
              toast.error(err.message)

              navigate('/')
            }
          },
        }
      )
    } else {
      toast.error('Invalid URL.')
      navigate('/')
    }
  }, [])

  return (
    <section className="custom-container">
      <form className="form-container flex flex-col gap-4 my-12 py-6 shadow shadow-neutral-200 rounded-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 pb-4">
          Email verification
        </h2>
        <div className="flex flex-col gap-6">
          {isPending && (
            <>
              <AiOutlineLoading3Quarters className="text-6xl md:text-8xl text-sky-500 animate-spin" />
              <p className="text-base font-meidum text-neutral-700 pb-4 text-start">
                We are verifying this link. Please be patient.
              </p>
            </>
          )}
          {isSuccess && (
            <>
              <FaCheckCircle className="text-6xl md:text-8xl text-green-500" />
              <p className="text-base font-meidum text-neutral-700 pb-4 text-start">
                Your email verification is successfully. You will be redirected
                to sign in page in seconds...
              </p>
            </>
          )}
          {isError && (
            <>
              <FaQuestionCircle className="text-6xl md:text-8xl text-yellow-500" />
              <p className="text-base font-meidum text-neutral-700 pb-4 text-start">
                Something went wrong. You will be redirected to homepage in
                seconds...
              </p>
            </>
          )}
        </div>
      </form>
    </section>
  )
}

export default VerifyEmail
