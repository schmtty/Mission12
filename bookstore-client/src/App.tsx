import './App.css'
import CartOffcanvas from './components/CartOffcanvas'
import BookCatalogPage from './pages/BookCatalogPage'
import { CartProvider } from './state/cart'

function App() {
  // Keep the UI a simple composition root:
  // - CartProvider holds session-persistent cart state
  // - BookCatalogPage renders the book list + filters + pagination
  // - CartOffcanvas renders the offcanvas cart UI
  return (
    <CartProvider>
      <BookCatalogPage />
      <CartOffcanvas />
    </CartProvider>
  )
}

export default App
