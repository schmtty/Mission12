export type Book = {
  bookId: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

export type BooksResponse = {
  books: Book[]
  totalBooks: number
}

export type CartItem = {
  bookId: number
  title: string
  // Store unit price so the cart totals can be computed quickly.
  price: number
  quantity: number
}

