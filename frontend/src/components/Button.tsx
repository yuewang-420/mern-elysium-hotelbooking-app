import { IconType } from 'react-icons'
import { ReactNode } from 'react'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  isFormStatusChanged?: boolean
  isPending?: boolean
  pendingMessage?: string
  icon?: IconType
  isPureIconButton?: boolean
  textColor?: string
  bgColor?: string
  textHoverColor?: string
  bgHoverColor?: string
  children?: ReactNode
}

const Button = ({
  type = 'button',
  onClick,
  isFormStatusChanged = true,
  isPending = false,
  pendingMessage = 'Pending...',
  icon: Icon,
  isPureIconButton = false,
  textColor = 'text-neutral-800',
  bgColor = 'bg-neutral-200',
  textHoverColor = 'hover:text-neutral-200',
  bgHoverColor = 'hover:bg-neutral-800',
  children,
}: ButtonProps) => {
  return (
    <button
      className={`text-sm md:text-base px-4 py-1.5 flex justify-center md:self-center items-center tracking-tight font-medium rounded ${textColor} ${bgColor} ${textHoverColor} ${bgHoverColor} btn-transition ${
        isPending ? 'disabled:animate-pulse' : ''
      } disabled:hover:text-neutral-800 disabled:hover:bg-neutral-200`}
      type={type}
      onClick={onClick}
      disabled={!isFormStatusChanged || isPending}
    >
      {Icon && (
        <span
          className={`${
            isPureIconButton ? 'px-6' : 'mr-2'
          } text-base md:text-lg items-center`}
        >
          {<Icon />}
        </span>
      )}
      {isPending ? pendingMessage : children}
    </button>
  )
}

export default Button
