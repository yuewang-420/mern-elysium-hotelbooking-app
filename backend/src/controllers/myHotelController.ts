import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import Hotel, { HotelType } from '../models/hotelModel'
import { validateMyHotelRouteFields } from '../utils/validateFields'
import checkUnexpectedFields from '../utils/checkUnexpectedFields'

const myHotelRoutesAllowedKeys: { [key: string]: { [key: string]: string[] } } =
  {
    POST: {
      '/': [
        'name',
        'starRating',
        'type',
        'facilities',
        'description',
        'streetAddress',
        'city',
        'country',
        'roomNumber',
        'adultCount',
        'childCount',
        'pricePerNight',
      ],
    },
    GET: {},
    PUT: {},
  }

// @desc    Add a new hotel
// @route   POST /api/my-hotels/
// @access  Private
export const addNewHotel = async (req: Request, res: Response) => {
  const { method, path } = req
  const allowedKeys = myHotelRoutesAllowedKeys[method][path] || []
  const unmatchedFieldErrors = checkUnexpectedFields(req, allowedKeys)
  if (unmatchedFieldErrors.length !== 0) {
    return res.status(400).json({ message: unmatchedFieldErrors })
  }
  const validationErrors = await validateMyHotelRouteFields(req, allowedKeys)
  if (validationErrors.length !== 0) {
    return res.status(400).json({ message: validationErrors })
  }

  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ message: 'Accommodation images are required.' })
  }

  try {
    const imageFiles = req.files as Express.Multer.File[]
    const newHotel: HotelType = req.body

    // Upload the images, get the urls
    const imageUrls = await uploadImages(imageFiles)

    // Add the required field to the new hotel object
    newHotel.imageUrls = imageUrls
    newHotel.lastUpdated = new Date()
    newHotel.userId = req.userId

    // Save the new hotel object to the database
    const hotel = new Hotel(newHotel)
    await hotel.save()

    res.status(201).json({ hotel })
  } catch (err) {
    console.log('Error creating hotel', err)
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again later...' })
  }
}

// Helper function for uploading images
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64')
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64
    // Prevent same figure upload twice
    const res = await cloudinary.uploader.upload(dataURI, {
      unique_filename: false,
      overwrite: false,
    })
    return res.url
  })

  const imageUrls = await Promise.all(uploadPromises)
  return imageUrls
}
