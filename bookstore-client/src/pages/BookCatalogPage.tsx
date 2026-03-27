import { Tooltip } from 'bootstrap'
import { useEffect, useMemo, useState } from 'react'
import type { Book, BooksResponse } from '../types'
import { useCart } from '../state/cart'
import BookTable from '../components/BookTable'
import CategoryFilter from '../components/CategoryFilter'
import Pagination from '../components/Pagination'
import CartSummaryBar from '../components/CartSummaryBar'

export default function BookCatalogPage() {
  const { addToCart } = useCart()

  const [books, setBooks] = useState<Book[]>([])
  const [totalBooks, setTotalBooks] = useState(0)

  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [loadingBooks, setLoadingBooks] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState('')

  const selectedCategoriesKey = useMemo(
    () => selectedCategories.slice().sort().join(','),
    [selectedCategories],
  )

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalBooks / pageSize)),
    [totalBooks, pageSize],
  )

  // Reset to page 1 whenever category filter changes.
  useEffect(() => {
    setPageNum(1)
  }, [selectedCategoriesKey])

  // Fetch the list of categories to show in the filter UI.
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        setError('')

        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to load categories.')
        }

        const data: string[] = await response.json()
        setCategories(data)
      } catch {
        setError('Could not load categories. Make sure the API is running.')
      } finally {
        setLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [])

  // Fetch books any time paging/sorting/filter changes.
  useEffect(() => {
    const abortController = new AbortController()

    const loadBooks = async () => {
      try {
        setLoadingBooks(true)
        setError('')

        let url = `/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sort=${sortOrder}`
        if (selectedCategoriesKey) {
          // Backend expects `categories` as comma-separated values.
          url += `&categories=${encodeURIComponent(selectedCategoriesKey)}`
        }

        const response = await fetch(url, { signal: abortController.signal })

        if (!response.ok) {
          throw new Error('Failed to load books.')
        }

        const data: BooksResponse = await response.json()
        setBooks(data.books)
        setTotalBooks(data.totalBooks)
      } catch (err) {
        // Ignore abort errors since they occur during cleanup.
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Could not load books. Make sure the API is running.')
      } finally {
        setLoadingBooks(false)
      }
    }

    void loadBooks()

    return () => abortController.abort()
  }, [pageNum, pageSize, sortOrder, selectedCategoriesKey])

  // Keep current page valid if the filtered result count shrinks.
  useEffect(() => {
    if (pageNum > totalPages) setPageNum(totalPages)
  }, [pageNum, totalPages])

  // Initialize Bootstrap tooltips for dynamically rendered “Add to cart” buttons.
  useEffect(() => {
    // Bootstrap bonus feature: Tooltips
    // Buttons are marked using `data-tooltip="add-to-cart"` and `title="..."`.
    const tooltipElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tooltip="add-to-cart"]'),
    )

    tooltipElements.forEach((el) => {
      Tooltip.getOrCreateInstance(el)
    })

    return () => {
      tooltipElements.forEach((el) => {
        Tooltip.getInstance(el)?.dispose()
      })
    }
  }, [books])

  return (
    <main className="container py-4">
      <h1 className="mb-4">Online Bookstore</h1>

      {/* Bootstrap Grid: use row + col-* to create a clean two-column layout */}
      <div className="row g-4">
        <div className="col-lg-3">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            disabled={loadingCategories}
            onToggle={(category) => {
              setSelectedCategories((prev) =>
                prev.includes(category)
                  ? prev.filter((c) => c !== category)
                  : [...prev, category],
              )
            }}
            onClear={() => setSelectedCategories([])}
          />
        </div>

        <div className="col-lg-9">
          <CartSummaryBar />

          <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
            <div>
              <label htmlFor="page-size" className="form-label mb-1">
                Results per page
              </label>
              <select
                id="page-size"
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPageNum(1)
                }}
              >
                {[5, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-order" className="form-label mb-1">
                Sort by title
              </label>
              <select
                id="sort-order"
                className="form-select"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'asc' | 'desc')
                  setPageNum(1)
                }}
              >
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </select>
            </div>
          </div>

          {loadingBooks && <p>Loading books...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          <BookTable books={books} onAddToCart={addToCart} />

          <div className="mt-3">
            <Pagination
              pageNum={pageNum}
              totalPages={totalPages}
              onPageChange={(nextPage) => setPageNum(nextPage)}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

