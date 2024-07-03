type BadgeProps = {
  bgColor?: string
  textColor?: string
  badgeInfo: string
}

const Badge = ({
  bgColor = 'bg-green-200',
  textColor = 'text-green-800',
  badgeInfo,
}: BadgeProps) => {
  return (
    <span
      className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded whitespace-nowrap`}
    >
      {badgeInfo}
    </span>
  )
}

export default Badge
