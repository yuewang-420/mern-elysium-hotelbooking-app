import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

type NotFoundProps = {
  statusCode?: number
  mainText?: string
  subText?: string
  buttonText?: string
  onButtonClick?: () => void
}

const NotFound = ({
  statusCode = 404,
  mainText = "Something's missing.",
  subText = "Sorry, we can't find that page. You'll find a lot to explore on the homepage.",
  buttonText = 'Back to Homepage',
  onButtonClick,
}: NotFoundProps) => {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else {
      navigate('/')
    }
  }

  return (
    <section className="custom-container">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center flex flex-col">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-neutral-800">
            {statusCode}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-700 md:text-4xl">
            {mainText}
          </p>
          <p className="mb-4 text-lg font-light text-neutral-600">{subText}</p>
          <span className="mx-auto flex-1">
            <Button onClick={handleButtonClick}>{buttonText}</Button>
          </span>
        </div>
      </div>
    </section>
  )
}
export default NotFound
