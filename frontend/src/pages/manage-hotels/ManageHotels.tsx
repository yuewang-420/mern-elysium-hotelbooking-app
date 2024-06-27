import SideMenu from '../../components/SideMenu'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import MyHotels from './MyHotels'
import AddHotel from './AddHotel'
import EditHotel from './EditHotel'
import NotFound from '../NotFound'
import { useEffect, useState } from 'react'

const ManageHotels = () => {
  const location = useLocation()

  const [sideMenuItems, setSideMenuItems] = useState([
    { title: 'Show my hotels', path: 'my-hotels' },
    { title: 'Add a new hotel', path: 'add-hotel' },
  ])

  useEffect(() => {
    if (location.pathname.includes('edit-hotel')) {
      setSideMenuItems((prevItems) => {
        const editHotelItem = {
          title: 'Update a hotel',
          path: location.pathname,
        }
        const existingItem = prevItems.find(
          (item) => item.title === 'Update a hotel'
        )
        if (existingItem) {
          return prevItems
        } else {
          return [...prevItems, editHotelItem]
        }
      })
    } else {
      setSideMenuItems((prevItems) =>
        prevItems.filter((item) => item.title !== 'Update a hotel')
      )
    }
  }, [location])

  return (
    <div className="custom-container py-6 w-full justify-center md:justify-between items-center md:items-start flex flex-col md:flex-row">
      <SideMenu sideMenuItems={sideMenuItems} />
      <div className="w-full md:w-4/5 flex justify-start">
        <ManageHotelsContent />
      </div>
    </div>
  )
}

const ManageHotelsContent = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="my-hotels" />} />
        <Route path="my-hotels" element={<MyHotels />} />
        <Route path="add-hotel" element={<AddHotel />} />
        <Route path="edit-hotel/:hotelId" element={<EditHotel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default ManageHotels
