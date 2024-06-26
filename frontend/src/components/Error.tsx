import { FaQuestionCircle } from 'react-icons/fa'

type ErrorProps = {
  errMsg?: string
}

const Error = ({ errMsg = 'Something went wrong.' }: ErrorProps) => {
  return (
    <div>
      <FaQuestionCircle className="text-6xl md:text-8xl text-yellow-500" />
      <p className="text-lg md:text-base font-medium md:font-semibold text-neutral-800">
        {errMsg}
      </p>
    </div>
  )
}

export default Error
