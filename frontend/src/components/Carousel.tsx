import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface CarouselProps {
  autoSlide?: boolean
  autoSlideInterval?: number
  slides: string[]
}

export default function Carousel({
  autoSlide = false,
  autoSlideInterval = 3000,
  slides,
}: CarouselProps) {
  const [curr, setCurr] = useState(0)

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [])

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div
        className="flex flex-3 w-full h-full transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide) => (
          <img
            key={slide}
            src={slide}
            className="flex-1 object-cover self-center md:h-full"
          />
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-1">
          <button
            onClick={prev}
            className="p-1 rounded-full shadow bg-white opacity-70 hover:opcaity-90"
          >
            <FiChevronLeft className="text-xs md:text-sm text-neutral-600" />
          </button>
          <button
            onClick={next}
            className="p-1 rounded-full shadow bg-white opacity-70 hover:opcaity-90"
          >
            <FiChevronRight className="text-xs md:text-sm text-neutral-600" />
          </button>
        </div>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-2 right-0 left-0">
          <div className="flex items-center justify-center gap-1">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`
                transition-all w-1 h-1 bg-neutral-300 rounded-full
                ${curr === i ? 'p-1' : 'bg-opacity-75 bg-neutral-200'}
              `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
