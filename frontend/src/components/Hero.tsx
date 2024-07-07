import { useLocation } from 'react-router-dom'

const Hero = () => {
  const location = useLocation()
  const isBookingPage = location.pathname.includes('/booking')

  return (
    <section
      className={`${
        isBookingPage ? 'pb-6' : 'pb-12 lg:pb-16'
      } pt-4 px-6 bg-neutral-100`}
    >
      <div className="custom-container flex-col gap-2">
        <h1 className="text-2xl md:text-4xl font-semibold text-neutral-800">
          Book your dream stay
        </h1>
        <p className="text-sm md:text-base font-semi-bold text-neutral-800">
          Unlock unforgettable experiences with our curated hotel selection
        </p>
      </div>
    </section>
  )
}

export default Hero
