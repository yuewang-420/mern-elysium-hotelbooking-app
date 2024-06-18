import { AiOutlineLoading3Quarters } from 'react-icons/ai'
type LoadingProps = {
  loadingMsg?: string
}

const Loading = ({ loadingMsg = 'Loading...' }: LoadingProps) => {
  return (
    <>
      <AiOutlineLoading3Quarters className="text-6xl md:text-8xl text-sky-500 animate-spin" />
      <p className="text-lg md:text-base font-medium md:font-semibold text-neutral-800">
        {loadingMsg}
      </p>
    </>
  )
}

export default Loading
