import type { Book } from '../types'

export default function BookTable({
  books,
  onAddToCart,
}: {
  books: Book[]
  onAddToCart: (book: Book) => void
}) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.classification}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  // Bootstrap bonus feature: Offcanvas
                  // Uses `data-bs-toggle="offcanvas"` + `data-bs-target` to open the cart.
                  data-bs-toggle="offcanvas"
                  data-bs-target="#cartOffcanvas"
                  aria-controls="cartOffcanvas"
                  // Bootstrap bonus feature: Tooltips
                  // We use `title="..."` and mark it with `data-tooltip="add-to-cart"`
                  // so the page can initialize Bootstrap Tooltip for these buttons.
                  data-tooltip="add-to-cart"
                  title="Add to cart"
                  onClick={() => onAddToCart(book)}
                >
                  Add to cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

