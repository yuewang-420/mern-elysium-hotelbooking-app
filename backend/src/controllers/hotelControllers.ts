import { Request, Response } from 'express'
import Hotel from '../models/hotelModel'
import { HotelType, HotelSearchResponse } from '../shared/types'

export const getHotelSearchResults = async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query)

    let sortOptions = {}
    switch (req.query.sortOption) {
      case 'starRating':
        sortOptions = { starRating: -1 }
        break
      case 'pricePerNightAsc':
        sortOptions = { pricePerNight: 1 }
        break
      case 'pricePerNightDesc':
        sortOptions = { pricePerNight: -1 }
        break
    }

    // Implement pagination
    const pageSize = 5
    const pageNum = parseInt(req.query.page ? req.query.page.toString() : '1')

    // Defined the skip item num
    const skipHotelNum = (pageNum - 1) * pageSize
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skipHotelNum)
      .limit(pageSize)
    const totalHotelNum = await Hotel.countDocuments(query)

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        totalHotelNum,
        page: pageNum,
        pages: Math.ceil(totalHotelNum / pageSize),
      },
    }

    return res.status(200).json(response)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {}

  if (queryParams.destination) {
    constructedQuery.$or = [
      { streetAddress: new RegExp(queryParams.destination, 'i') },
      { city: new RegExp(queryParams.destination, 'i') },
      { country: new RegExp(queryParams.destination, 'i') },
    ]
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    }
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    }
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    }
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    }
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars)

    constructedQuery.starRating = { $in: starRatings }
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    }
  }

  return constructedQuery
}
