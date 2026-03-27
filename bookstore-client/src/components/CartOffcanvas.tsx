import { useMemo } from 'react'
import { useCart } from '../state/cart'

function formatMoney(amount: number) {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

export default function CartOffcanvas() {
  const { items, totalPrice, totalQuantity, clearCart, removeFromCart } =
    useCart()

  const summaryLine = useMemo(() => {
    if (totalQuantity === 0) return 'Your cart is empty.'
    return `${totalQuantity} item(s) • Total ${formatMoney(totalPrice)}`
  }, [totalPrice, totalQuantity])

  return (
    // Bootstrap bonus feature: Offcanvas
    // Uses `data-bs-dismiss="offcanvas"` for the “Continue Shopping” button.
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="cartOffcanvas"
      aria-labelledby="cartOffcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="cartOffcanvasLabel">
          Shopping Cart
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>

      <div className="offcanvas-body">
        <p className="mb-3">{summaryLine}</p>

        {items.length === 0 ? (
          <p className="text-muted">Add books from the list to get started.</p>
        ) : (
          <div className="list-group">
            {items.map((item) => (
              <div
                key={item.bookId}
                className="list-group-item d-flex justify-content-between align-items-start gap-3"
              >
                <div className="me-auto">
                  <div className="fw-semibold">{item.title}</div>
                  <div className="text-muted small">
                    {formatMoney(item.price)} each
                  </div>
                </div>

                <div className="text-end">
                  <div className="small text-muted">Qty</div>
                  <div className="fw-semibold">{item.quantity}</div>
                  <div className="fw-semibold mt-1">
                    {formatMoney(item.price * item.quantity)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => removeFromCart(item.bookId)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 d-grid gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-dismiss="offcanvas"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            className="btn btn-danger"
            disabled={items.length === 0}
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}

