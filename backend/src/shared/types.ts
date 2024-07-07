// TypeScript definition for the User object
export type UserType = {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  verified: boolean
} & Document

export type HotelType = {
  _id: string
  userId: string
  name: string
  description: string
  type: string
  adultCount: number
  childCount: number
  facilities: string[]
  pricePerNight: number
  starRating: number
  imageUrls: string[]
  lastUpdated: Date
  roomNumber: number
  streetAddress: string
  city: string
  country: string
}

export type BookingType = {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  adultCount: number
  childCount: number
  checkIn: Date
  checkOut: Date
  totalCost: number
  hotel: string // hotel Id
}

export type HotelSearchResponse = {
  data: HotelType[]
  pagination: {
    totalHotelNum: number
    page: number
    pages: number
  }
}

export type PaymentIntentResponse = {
  paymentIntentId: string
  clientSecret: string
  totalCost: number
}
