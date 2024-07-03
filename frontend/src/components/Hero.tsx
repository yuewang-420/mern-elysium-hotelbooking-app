import { useLocation } from 'react-router-dom'

const Hero = () => {
  const location = useLocation()
  const isSearchOrDetailPage =
    location.pathname.includes('/search') ||
    location.pathname.includes('/detail')
  return isSearchOrDetailPage ? (
    <div className="w-full h-8 bg-neutral-50"></div>
  ) : (
    <section className="px-6 pt-4 pb-8 bg-neutral-50">
      <div className="custom-container flex-col gap-4">
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
