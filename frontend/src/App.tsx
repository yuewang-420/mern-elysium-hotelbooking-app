import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import Homepage from './pages/Homepage'
import Register from './pages/user/Register'
import SignIn from './pages/user/SignIn'
import VerifyEmail from './pages/user/VerifyEmail'
import ForgotPassword from './pages/user/ForgotPassword'
import ManageAccount from './pages/user/ManageAccount'
import ResetPassword from './pages/user/ResetPassword'
import ManageHotels from './pages/manage-hotels/ManageHotels'
import SearchResults from './pages/SearchResults'
import NotFound from './pages/NotFound'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppSelector, RootState } from './store'
import HotelDetail from './pages/HotelDetail'

function App() {
  const userInfo = useAppSelector((state: RootState) => state.auth?.userInfo)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="detail/:hotelId" element={<HotelDetail />} />
            <Route path="user">
              <Route index element={<Navigate to="/" />} />
              <Route path="register" element={<Register />} />
              {userInfo ? (
                <Route path="signin" element={<Navigate to="/" />} />
              ) : (
                <Route path="signin" element={<SignIn />} />
              )}
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route
                path="verify-email/:emailToken"
                element={<VerifyEmail />}
              />
              {userInfo && (
                <Route path="manage-account/*" element={<ManageAccount />} />
              )}
            </Route>
            {userInfo && (
              <>
                <Route path="manage-hotels/*" element={<ManageHotels />} />
                <Route
                  path="manage-bookings"
                  element={<h1 className="custom-container">bookings</h1>}
                />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>
  )
}

export default App
