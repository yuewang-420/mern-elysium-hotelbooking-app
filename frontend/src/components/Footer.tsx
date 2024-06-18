import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="px-8 py-6 bg-neutral-50">
      <div className="custom-container flex flex-col gap-1 md:gap-0 md:flex-row md:justify-between">
        <Logo />
        <span className="text-neutral-800 text-xs md:text-base md:font-medium tracking-tight flex gap-4 items-center">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms of Service</p>
        </span>
      </div>
    </footer>
  )
}
export default Footer
