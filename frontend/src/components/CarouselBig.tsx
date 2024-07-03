import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type CarouselBigProps = {
  slides: string[]
  hotelName: string
}

const CarouselBig = ({ slides, hotelName }: CarouselBigProps) => {
  const [curr, setCurr] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(1)

  const updateItemsPerPage = () => {
    if (window.innerWidth >= 1024) {
      setItemsPerPage(3)
      // Adjust curr to stay within bounds of new itemsPerPage
      setCurr((curr) => Math.min(curr, slides.length % 3))
    } else {
      setItemsPerPage(1)
    }
  }

  useEffect(() => {
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [curr])

  const maxIndex = Math.ceil(slides.length / itemsPerPage) - 1

  const prev = () => {
    setCurr((curr) => (curr === 0 ? maxIndex : curr - 1))
  }

  const next = () => {
    setCurr((curr) => (curr === maxIndex ? 0 : curr + 1))
  }

  const containerClasses = slides.length <= itemsPerPage ? 'justify-center' : ''

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={`${containerClasses} flex transition-transform ease-out duration-500`}
        style={{ transform: `translateX(-${curr * (100 / itemsPerPage)}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full"
            style={{ width: `${100 / itemsPerPage}%` }}
          >
            <img
              src={slide}
              alt={hotelName}
              className="w-full h-[300px] object-cover"
            />
          </div>
        ))}
      </div>
      {slides.length > itemsPerPage && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <button
              onClick={prev}
              className="p-1 rounded-full shadow bg-white opacity-50 hover:opacity-90 btn-transition"
            >
              <FiChevronLeft className="text-sm md:text-base text-neutral-600" />
            </button>
            <button
              onClick={next}
              className="p-1 rounded-full shadow bg-white opacity-50 hover:opacity-90 btn-transition"
            >
              <FiChevronRight className="text-sm md:text-base text-neutral-600" />
            </button>
          </div>
          <div className="absolute bottom-2 right-0 left-0">
            <div className="flex items-center justify-center gap-1">
              {[...Array(maxIndex + 1)].map((_, i) => (
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
        </>
      )}
    </div>
  )
}

export default CarouselBig
