type BadgeProps = {
  bgColor?: string
  textColor?: string
  isBig?: boolean
  badgeInfo: string
}

const Badge = ({
  bgColor = 'bg-green-200',
  textColor = 'text-green-800',
  isBig = false,
  badgeInfo,
}: BadgeProps) => {
  return (
    <span
      className={`${bgColor} ${textColor} ${
        isBig ? 'text-sm md:text-base px-2.5 py-1.5' : 'text-xs px-2 py-1'
      } text-center rounded whitespace-nowrap`}
    >
      {badgeInfo}
    </span>
  )
}

export default Badge
