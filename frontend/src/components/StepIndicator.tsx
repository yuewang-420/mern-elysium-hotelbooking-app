import { FaCheck } from 'react-icons/fa'

type StepIndicatorProps = {
  step: number
  currentStep: number
  description: string
  isValid: boolean
}

const StepIndicator = ({
  step,
  currentStep,
  description,
  isValid,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
          step === currentStep
            ? 'border-neutral-800 text-neutral-800'
            : isValid
            ? 'border-green-500 text-green-500'
            : 'border-neutral-300 text-neutral-300'
        }`}
      >
        {(step === currentStep || !isValid) && (
          <span className="text-sm items-center justify-center">{step}</span>
        )}
        {isValid && <FaCheck />}
      </div>

      {/* Step Description */}
      <span
        className={`ml-2 text-sm md:text-base items-center text-center justify-center md:block hidden ${
          step === currentStep
            ? 'border-neutral-800 text-neutral-800'
            : isValid
            ? 'border-green-500 text-green-500'
            : 'border-neutral-300 text-neutral-300'
        }`}
      >
        {description}
      </span>
    </div>
  )
}

export default StepIndicator
