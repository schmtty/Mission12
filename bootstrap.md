# Bootstrap Bonus Features (Mission 12)

The Mission 12 assignment required using **two Bootstrap features we had not covered in class**. The app includes:

## Bonus Feature #1: Offcanvas Cart UI

The cart is implemented using Bootstrap **Offcanvas**, which slides in from the side so users can keep browsing the book list (single-page app friendly).

Bootstrap attributes used:
- `data-bs-toggle="offcanvas"` (activates the offcanvas behavior)
- `data-bs-target="#<offcanvas-id>"` (points to the offcanvas element to show)
- `aria-controls="<offcanvas-id>"` (accessibility relationship to the controlled element)

## Bonus Feature #2: Tooltips on Actions

Tooltips are used to provide quick help/feedback when the user interacts with key actions (for example, an “Add to cart” button).

Bootstrap attributes used:
- `data-bs-toggle="tooltip"` (enables tooltip behavior)
- `title="..."`
  - provides the tooltip text content
  - (Bootstrap reads the `title` attribute by default)

React note:
- Tooltips often require initialization in React (commonly done in a `useEffect` by creating a `Tooltip` instance for the elements that have `data-bs-toggle="tooltip"`).

