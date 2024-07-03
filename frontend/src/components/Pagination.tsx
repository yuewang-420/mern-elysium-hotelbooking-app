export type PaginationProps = {
  page: number
  pages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, pages, onPageChange }: PaginationProps) => {
  // Initialize an array
  const pageNumbers = []
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center">
      <ul className="flex gap-1">
        {pageNumbers.map((number) => {
          return (
            <li
              key={number}
              className={`w-6 h-6 items-center cursor-pointer flex justify-center rounded-full text-xs text-neutral-600 btn-transition ${
                page === number
                  ? 'bg-neutral-300'
                  : 'bg-neutral-100 hover:text-neutral-100 hover:bg-neutral-500'
              }`}
              onClick={() => {
                onPageChange(number)
              }}
            >
              <p className="self-center align-middle">{number}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Pagination
