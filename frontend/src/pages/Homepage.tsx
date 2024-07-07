import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useQuery } from '@tanstack/react-query'
import * as apiClient from '../api-client'
import SearchResultCard from '../components/SearchResultCard'
import Loading from '../components/Loading'
import Error from '../components/Error'

const HomePage = () => {
  const {
    data: popular,
    isFetching: popularFetching,
    isError: popularError,
    isSuccess: popularSuccess,
    error: popularErr,
  } = useQuery({
    queryKey: ['fetchPopular'],
    queryFn: () => apiClient.fetchMostPopularHotels(),
  })

  const {
    data: latest,
    isFetching: latestFetching,
    isError: latestError,
    isSuccess: latestSuccess,
    error: latestErr,
  } = useQuery({
    queryKey: ['fetchLatest'],
    queryFn: () => apiClient.fetchLatestUpdatedHotels(),
  })

  return (
    <div className="custom-container py-6 flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-neutral-800">
          Most Popular Hotels
        </h2>
        {popularFetching && <Loading />}
        {popularError && <Error errMsg={popularErr?.message} />}
        {popularSuccess && popular && (
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showStatus={false}
            showThumbs={false}
            autoPlay={true}
            interval={2000}
            stopOnHover={true}
            showIndicators={true}
          >
            {popular?.map((hotel) => (
              <SearchResultCard key={hotel._id} hotel={hotel} />
            ))}
          </Carousel>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-neutral-800">
          Latest Updated Hotels
        </h2>
        {latestFetching && <Loading />}
        {latestError && <Error errMsg={latestErr?.message} />}
        {latestSuccess && latest && (
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showStatus={false}
            showThumbs={false}
            interval={2000}
            stopOnHover={true}
            showIndicators={true}
          >
            {latest?.map((hotel) => (
              <SearchResultCard key={hotel._id} hotel={hotel} />
            ))}
          </Carousel>
        )}
      </section>
    </div>
  )
}

export default HomePage
