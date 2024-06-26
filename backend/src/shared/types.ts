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
