import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <span className="font-semibold text-2xl md:text-3xl text-neutral-800 tracking-tighter">
      <Link to="/">Elysium</Link>
    </span>
  )
}

export default Logo
