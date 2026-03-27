/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Book, CartItem } from '../types'

type CartContextValue = {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addToCart: (book: Book) => void
  removeFromCart: (bookId: number) => void
  clearCart: () => void
}

const CART_STORAGE_KEY = 'bookstore_cart_v1'

const CartContext = createContext<CartContextValue | null>(null)

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((x) => x as CartItem)
      .filter(
        (i) =>
          typeof i.bookId === 'number' &&
          typeof i.title === 'string' &&
          typeof i.price === 'number' &&
          typeof i.quantity === 'number',
      )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    safeParseCart(typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem(CART_STORAGE_KEY)
      : null),
  )

  useEffect(() => {
    // Persist cart for the duration of the browser session.
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const addToCart = (book: Book) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === book.bookId)
      if (!existing) {
        return [
          ...prev,
          {
            bookId: book.bookId,
            title: book.title,
            price: book.price,
            quantity: 1,
          },
        ]
      }

      // Update quantity and refresh unit price from the latest API data.
      return prev.map((i) =>
        i.bookId === book.bookId
          ? { ...i, quantity: i.quantity + 1, price: book.price }
          : i,
      )
    })
  }

  const clearCart = () => setItems([])

  const removeFromCart = (bookId: number) => {
    // Removes the selected book entirely from the cart.
    setItems((prev) => prev.filter((i) => i.bookId !== bookId))
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}

