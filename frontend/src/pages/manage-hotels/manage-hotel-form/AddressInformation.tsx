import { useFormContext } from 'react-hook-form'
import { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { ManageHotelFormData } from './ManageHotelForm'

const AddressInformation = () => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ManageHotelFormData>()

  const streetAddressWatch = watch('streetAddress')

  const addressRef = useRef<HTMLInputElement | null>(null)
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null)
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])

  useEffect(() => {
    if (streetAddressWatch && addressRef.current) {
      addressRef.current.value = streetAddressWatch
    }
  }, [streetAddressWatch])

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    })

    loader.load().then(() => {
      if (window.google && window.google.maps) {
        setAutocompleteService(new google.maps.places.AutocompleteService())
      }
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: inputValue,
          types: ['address'],
          componentRestrictions: {
            country: 'AU', // Limit to Australia
          },
        },
        (
          predictions: google.maps.places.AutocompletePrediction[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            // Only get street address
            const filteredPredictions = predictions.filter((prediction) =>
              prediction.types.includes('street_address')
            )
            setSuggestions(filteredPredictions)
          } else {
            setSuggestions([])
          }
        }
      )
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (placeId: string) => {
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    )
    placesService.getDetails(
      { placeId },
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.address_components
        ) {
          const addressComponents = place.address_components
          const streetNumber = addressComponents.find(
            (component: google.maps.GeocoderAddressComponent) =>
              component.types.includes('street_number')
          )?.long_name
          const route = addressComponents.find(
            (component: google.maps.GeocoderAddressComponent) =>
              component.types.includes('route')
          )?.long_name
          const suburb = addressComponents.find(
            (component: google.maps.GeocoderAddressComponent) =>
              component.types.includes('locality')
          )?.long_name
          const city = addressComponents.find(
            (component: google.maps.GeocoderAddressComponent) =>
              component.types.includes('administrative_area_level_2')
          )?.long_name
          const country = addressComponents.find(
            (component: google.maps.GeocoderAddressComponent) =>
              component.types.includes('country')
          )?.long_name

          if (streetNumber && route) {
            const streetAddress = `${streetNumber} ${route}, ${suburb}`
            if (addressRef.current) {
              addressRef.current.value = streetAddress
            }
            setValue('streetAddress', streetAddress)
          }

          setValue('city', city || '')
          setValue('country', country || '')
          setSuggestions([])
        }
      }
    )
  }

  return (
    <>
      {/* street address, city, country */}
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        <span className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
          Street address
          <p className="text-xs md:text-sm font-normal text-neutral-400">
            {'(must contain street number and street name)'}
          </p>
        </span>
        <input
          type="text"
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Enter street address here..."
          {...register('streetAddress')}
          onChange={handleInputChange}
          ref={addressRef}
        />
        {errors.streetAddress && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.streetAddress.message}
          </span>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-neutral-300 rounded w-full mt-1 divide-y overflow-y-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="cursor-pointer px-2 py-1 hover:bg-neutral-200"
                onClick={() => handleSelectSuggestion(suggestion.place_id)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        City
        <input
          type="text"
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Will be auto-filled from Street address."
          readOnly
          {...register('city')}
        />
        {errors.city && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.city.message}
          </span>
        )}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 flex-1 relative">
        Country
        <input
          type="text"
          className="text-sm md:text-base border border-neutral-300 rounded w-full py-1 px-2 mt-1"
          placeholder="Will be auto-filled from Street address."
          readOnly
          {...register('country')}
        />
        {errors.country && (
          <span className="text-red-600 text-xs font-normal tracking-wide absolute bottom-0 left-0 transform translate-y-full">
            {errors.country.message}
          </span>
        )}
      </div>
    </>
  )
}
export default AddressInformation
