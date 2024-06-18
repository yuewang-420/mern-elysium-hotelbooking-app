import { useNavigate, useLocation } from 'react-router-dom'

type SideMenuItem = {
  title: string
  path: string
}

const SideMenu = ({ sideMenuItems }: { sideMenuItems: SideMenuItem[] }) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="w-fit h-fit border rounded bg-neutral-50 divide-x md:divide-y md:divide-x-0 flex flex-row md:flex-col items-center">
      {sideMenuItems.map((item) => {
        const isActive = location.pathname.includes(item.path)
        return (
          <div
            key={item.title}
            className={` h-full first:rounded-l last:rounded-r md:first:rounded-bl-none md:last:rounded-tr-none md:first:rounded-t md:last:rounded-b whitespace-nowrap cursor-pointer text-xs md:text-base font-semibold px-5 py-3 w-full flex justify-between items-center tracking-tight hover:text-neutral-200 hover:bg-neutral-800 btn-transition ${
              isActive ? 'text-neutral-200 bg-neutral-800' : ''
            }`}
            onClick={() => {
              if (!isActive) {
                navigate(`./${item.path}`)
              }
            }}
          >
            {item.title}
          </div>
        )
      })}
    </div>
  )
}

export default SideMenu
