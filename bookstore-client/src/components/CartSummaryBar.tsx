import { useCart } from '../state/cart'

function formatMoney(amount: number) {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

export default function CartSummaryBar() {
  const { totalQuantity, totalPrice } = useCart()

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <div className="fw-semibold">Cart Summary</div>
        <div className="text-muted small">
          {totalQuantity === 0
            ? 'No items yet.'
            : `${totalQuantity} item(s) • ${formatMoney(totalPrice)}`}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-outline-primary"
          // Bootstrap bonus feature: Offcanvas
          // Uses `data-bs-toggle="offcanvas"` + `data-bs-target` to open the cart.
          data-bs-toggle="offcanvas"
          data-bs-target="#cartOffcanvas"
          aria-controls="cartOffcanvas"
        >
          {/* Simple cart icon (inline SVG so we don't need extra icon packages). */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="me-2"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.5H.5a.5.5 0 0 1-.5-.5Z" />
            <path d="M5.5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
          </svg>
          View Cart
        </button>

        {/* Running total displayed next to the cart button (required by the assignment). */}
        <div className="text-muted small">
          Total: {formatMoney(totalPrice)}
        </div>
      </div>
    </div>
  )
}

