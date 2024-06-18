import SideMenu from '../../components/SideMenu'
import { Routes, Route, Navigate } from 'react-router-dom'
import PersonalDetails from './PersonalDetails'
import PaymentMethods from './PaymentMethods'
import NotFound from '../NotFound'

const ManageAccount = () => {
  const sideMenuItems = [
    { title: 'Personal details', path: 'personal-details' },
    { title: 'Payment methods', path: 'payment-methods' },
  ]

  return (
    <div className="custom-container py-6 w-full justify-center md:justify-between items-center md:items-start flex flex-col md:flex-row">
      <SideMenu sideMenuItems={sideMenuItems} />
      <div className="w-full md:w-4/5 flex justify-start">
        <ManageAccountContent />
      </div>
    </div>
  )
}

const ManageAccountContent = () => {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="personal-details" />} />
        <Route path="personal-details" element={<PersonalDetails />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default ManageAccount
