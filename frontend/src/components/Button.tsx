import { IconType } from 'react-icons'
import { ReactNode } from 'react'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  isFormStatusChanged?: boolean
  isPending?: boolean
  pendingMessage?: string
  icon?: IconType
  children: ReactNode
}

const Button = ({
  type = 'button',
  onClick,
  isFormStatusChanged = true,
  isPending = false,
  pendingMessage = 'Pending...',
  icon: Icon,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`text-sm md:text-base px-4 py-1.5 flex justify-center md:self-center items-center tracking-tight font-medium rounded text-neutral-800 bg-neutral-200 hover:text-neutral-200 hover:bg-neutral-800 btn-transition ${
        isPending ? 'disabled:animate-pulse' : ''
      } disabled:hover:text-neutral-800 disabled:hover:bg-neutral-200`}
      type={type}
      onClick={onClick}
      disabled={!isFormStatusChanged || isPending}
    >
      {Icon && (
        <span className="mr-2 text-sm md:text-base items-center">
          {<Icon />}
        </span>
      )}
      {isPending ? pendingMessage : children}
    </button>
  )
}

export default Button
