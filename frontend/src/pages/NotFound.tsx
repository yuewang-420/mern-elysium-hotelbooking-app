import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  const handleClick = () => navigate('/')

  return (
    <section className="custom-container">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center flex flex-col">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-neutral-800">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-700 md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-neutral-600">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{' '}
          </p>
          <span className="mx-auto flex-1">
            <Button onClick={handleClick}>Back to Homepage</Button>
          </span>
        </div>
      </div>
    </section>
  )
}
export default NotFound
