import { useMemo } from 'react'

export default function Pagination({
  pageNum,
  totalPages,
  onPageChange,
}: {
  pageNum: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  )

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        className="btn btn-outline-primary"
        disabled={pageNum <= 1}
        onClick={() => onPageChange(pageNum - 1)}
      >
        Previous
      </button>

      <div className="d-flex align-items-center gap-1">
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`btn ${
              page === pageNum ? 'btn-primary' : 'btn-outline-primary'
            }`}
            disabled={page === pageNum}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="btn btn-outline-primary"
        disabled={pageNum >= totalPages}
        onClick={() => onPageChange(pageNum + 1)}
      >
        Next
      </button>
    </div>
  )
}

