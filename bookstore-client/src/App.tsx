import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import CartOffcanvas from './components/CartOffcanvas'
import AdminBooksPage from './pages/AdminBooksPage'
import BookCatalogPage from './pages/BookCatalogPage'
import { CartProvider } from './state/cart'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <nav className="navbar navbar-expand navbar-dark bg-dark mb-0">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              Bookstore
            </NavLink>
            <div className="navbar-nav">
              <NavLink className="nav-link" to="/">
                Shop
              </NavLink>
              <NavLink className="nav-link" to="/adminbooks">
                Admin
              </NavLink>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<BookCatalogPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
        <CartOffcanvas />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
