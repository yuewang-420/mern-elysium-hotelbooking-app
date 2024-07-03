import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define types for search slice
type SearchState = {
  destination?: string
  checkIn?: string | null
  checkOut?: string | null
  adultCount?: string | null
  childCount?: string | null
}

const storedSearchState = sessionStorage.getItem('searchState')
const initialSearchState: SearchState = storedSearchState
  ? JSON.parse(storedSearchState)
  : {
      destination: '',
      checkIn: null,
      checkOut: null,
      adultCount: null,
      childCount: null,
    }

const initialState: SearchState = {
  ...initialSearchState,
  // Ensure any missing keys are properly initialized
  destination: initialSearchState.destination || '',
  checkIn: initialSearchState.checkIn || null,
  checkOut: initialSearchState.checkOut || null,
  adultCount: initialSearchState.adultCount || null,
  childCount: initialSearchState.childCount || null,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchState(state, action: PayloadAction<SearchState>) {
      const { destination, checkIn, checkOut, adultCount, childCount } =
        action.payload
      state.destination = destination !== undefined ? destination : ''
      state.checkIn = checkIn !== undefined ? checkIn : null
      state.checkOut = checkOut !== undefined ? checkOut : null
      state.adultCount =
        adultCount !== undefined
          ? isNaN(Number(adultCount))
            ? null
            : Number(adultCount).toString()
          : null
      state.childCount =
        childCount !== undefined
          ? isNaN(Number(childCount))
            ? null
            : Number(childCount).toString()
          : null

      // sessionStorage.removeItem('searchState')
      sessionStorage.setItem('searchState', JSON.stringify(state))
    },
    clearSearchState() {
      sessionStorage.removeItem('searchState')
      return initialState
    },
  },
})

export const { setSearchState, clearSearchState } = searchSlice.actions

export default searchSlice.reducer
