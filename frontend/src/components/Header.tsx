import Logo from './Logo'
import Button from './Button'
import { useAppSelector, useAppDispatch, RootState } from '../store'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../api-client'
import { toast } from 'react-toastify'
import { clearCredentials } from '../slices/authSlice'
import { useState, useEffect } from 'react'
import HeaderDropDown from './HeaderDropDown'
import { MdOutlineLogout } from 'react-icons/md'

const Header = () => {
  const navigate = useNavigate()
  const userInfo = useAppSelector((state: RootState) => state.auth?.userInfo)
  const dispatch = useAppDispatch()
  const location = useLocation()

  const [path, setPath] = useState<string>('/')
  useEffect(() => {
    setPath(location.pathname)
  }, [location.pathname])

  const logoutMutation = useMutation({
    mutationFn: apiClient.signOut,
    onSuccess: async () => {
      dispatch(clearCredentials())
      toast.info('You have logged out')
    },
    onError: (err: Error) => {
      toast.info(err.message)
    },
  })

  const handleSignInClick = () => {
    navigate('/user/signin')
  }

  const handleSignOutClick = () => {
    if (
      path.includes('/user/manage-account') ||
      path.includes('/manage-hotels') ||
      path.includes('/manage-bookings')
    ) {
      navigate('/')
    }
    logoutMutation.mutate()
  }

  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const options = [
    {
      name: 'Manage account',
      onClick: () => navigate('user/manage-account'),
    },
    {
      name: 'Manage bookings',
      onClick: () => navigate('manage-bookings'),
    },
    {
      name: 'Manage hotels',
      onClick: () => navigate('manage-hotels'),
    },
    {
      name: 'Log out',
      icon: MdOutlineLogout,
      onClick: () => handleSignOutClick(),
    },
  ]

  return (
    <header
      className={`sticky top-0 py-3 px-6 bg-neutral-100 z-50 transition-all duration-500 ease-in-out hover:opacity-100 ${
        isScrolled ? 'lg:opacity-25' : ''
      }`}
    >
      <div className="custom-container justify-between">
        <Logo />
        <span className="flex space-x-2">
          {userInfo ? (
            <HeaderDropDown options={options} />
          ) : path.startsWith('/user') ? (
            <></>
          ) : (
            <Button onClick={handleSignInClick}>Sign In</Button>
          )}
        </span>
      </div>
    </header>
  )
}

export default Header
