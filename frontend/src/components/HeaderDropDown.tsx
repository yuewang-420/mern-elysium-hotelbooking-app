import { useState, useEffect, useRef } from 'react'
import { useAppSelector, RootState } from '../store'
import Button from './Button'
import { FaUserCircle } from 'react-icons/fa'
import { IconType } from 'react-icons'

type Option = {
  name: string
  icon?: IconType
  onClick: () => void
}

const HeaderDropDown = ({ options }: { options: Option[] }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleBtnClick = () => setIsExpanded(!isExpanded)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userInfo = useAppSelector((state: RootState) => state.auth.userInfo)

  let timeoutId: NodeJS.Timeout

  // Check if user click outside the dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsExpanded(false)
    }
  }

  // When leave the dropdown dropdown collapse
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsExpanded(false)
    }, 1000)
  }

  const handleMouseEnter = () => {
    clearTimeout(timeoutId)
  }

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div
      className="relative flex flex-col flex-grow"
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <Button onClick={handleBtnClick} icon={FaUserCircle}>
        {userInfo?.firstName}
      </Button>
      {isExpanded && (
        <div className="absolute top-0 right-0 translate-y-12 bg-white border border-neutral-300 rounded z-50 w-max divide-y">
          {options.map((option) => {
            const Icon = option?.icon
            return (
              <ul
                className="first:rounded-t last:rounded-b cursor-pointer text-sm md:text-base px-5 py-2 w-full flex justify-between items-center tracking-tight font-medium text-neutral-800 hover:text-neutral-200 hover:bg-neutral-800 btn-transition"
                key={option.name}
                onClick={option.onClick}
              >
                {option.name}
                {Icon && <span className="translate-y-0.5">{<Icon />}</span>}
              </ul>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HeaderDropDown
