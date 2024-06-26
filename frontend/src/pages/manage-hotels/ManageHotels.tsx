import SideMenu from '../../components/SideMenu'
import { Routes, Route, Navigate } from 'react-router-dom'
import MyHotels from './MyHotels'
import AddHotel from './AddHotel'
import EditHotel from './EditHotel'
import NotFound from '../NotFound'

const ManageHotels = () => {
  const sideMenuItems = [
    { title: 'Show my hotels', path: 'my-hotels' },
    { title: 'Add a new hotel', path: 'add-hotel' },
  ]

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
