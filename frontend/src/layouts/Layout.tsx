import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import { Outlet, useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation()

  const isHomePage = location.pathname === '/'
  const isSearchPage = location.pathname.includes('/search')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {(isHomePage || isSearchPage) && (
        <>
          <Hero />
          <SearchBar />
        </>
      )}
      <div className="flex-1 my-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
