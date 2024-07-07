import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../components/Button'
import * as apiClient from '../../api-client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const feedbackFormSchema = z.object({
  feedback: z.string().nonempty({ message: 'Please enter your feedback.' }),
  sendCopy: z.boolean().optional(),
})

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>

const Feedback = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedback: '',
      sendCopy: false,
    },
    mode: 'all',
  })

  const mutation = useMutation({
    mutationFn: apiClient.sendFeedback,
    onSuccess: async (data) => {
      navigate('/user/manage-account')
      toast.success(data.message)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const onSubmit = (data: FeedbackFormData) => {
    mutation.mutate(data)
  }

  return (
    <section className="w-full px-8 py-4 divide-y flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-3xl font-semibold text-neutral-800">
          Your Feedback Makes a Difference!
        </h2>
        <p className="text-xs md:text-sm font-medium text-neutral-800">
          Share your thoughts to help us improve our services.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col py-4 md:gap-4 gap-6"
      >
        <div className="flex flex-col gap-4 relative">
          <label
            htmlFor="feedback"
            className="text-xs md:text-sm text-neutral-600"
          >
            How can we serve you better?
          </label>
          <textarea
            id="feedback"
            {...register('feedback')}
            rows={10}
            className="resize-none p-2 text-sm md:text-base border border-neutral-300 rounded w-full"
            placeholder="Enter your feedback here..."
            required
          />
          {errors.feedback && (
            <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
              {errors.feedback.message}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="sendCopy"
            {...register('sendCopy')}
            className="h-4 w-4 mr-2"
          />
          <label
            htmlFor="sendCopy"
            className="text-xs md:text-sm text-neutral-600"
          >
            Send me a copy of this feedback
          </label>
        </div>

        <div className="flex justify-start">
          <Button
            type="submit"
            isFormStatusChanged={dirtyFields.hasOwnProperty('feedback')}
            isPending={mutation.isPending}
            pendingMessage="Sending feedback via email..."
          >
            Submit Feedback
          </Button>
        </div>
      </form>
    </section>
  )
}

export default Feedback
