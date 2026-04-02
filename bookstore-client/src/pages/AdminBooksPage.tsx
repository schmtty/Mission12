import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/apiUrl'
import type { Book, BooksResponse } from '../types'

const emptyForm = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 1,
  price: 0,
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(
        apiUrl('/api/books?pageSize=500&pageNum=1&sort=asc'),
      )
      if (!response.ok) throw new Error('Failed to load books.')
      const data: BooksResponse = await response.json()
      setBooks(data.books)
    } catch {
      setError('Could not load books. Check that the API is running and CORS allows this origin.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadBooks()
  }, [loadBooks])

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const startEdit = (book: Book) => {
    setEditingId(book.bookId)
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    })
    setMessage('')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    const body = {
      title: form.title,
      author: form.author,
      publisher: form.publisher,
      isbn: form.isbn,
      classification: form.classification,
      category: form.category,
      pageCount: form.pageCount,
      price: form.price,
    }

    try {
      if (editingId === null) {
        const response = await fetch(apiUrl('/api/books'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!response.ok) {
          throw new Error(await readApiError(response, 'Create failed.'))
        }
        setMessage('Book added.')
        resetForm()
      } else {
        const response = await fetch(apiUrl(`/api/books/${editingId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!response.ok) {
          throw new Error(await readApiError(response, 'Update failed.'))
        }
        setMessage('Book updated.')
        resetForm()
      }
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.')
    }
  }

  async function readApiError(response: Response, fallback: string) {
    try {
      const data: unknown = await response.json()
      if (
        data &&
        typeof data === 'object' &&
        'error' in data &&
        typeof (data as { error: unknown }).error === 'string'
      ) {
        return (data as { error: string }).error
      }
    } catch {
      // ignore
    }
    return fallback
  }

  const remove = async (book: Book) => {
    if (!window.confirm(`Delete “${book.title}”?`)) return
    setMessage('')
    try {
      const response = await fetch(apiUrl(`/api/books/${book.bookId}`), {
        method: 'DELETE',
      })
      if (response.status === 404) {
        setError('Book was already removed.')
      } else if (!response.ok) {
        throw new Error('Delete failed.')
      } else {
        setMessage('Book deleted.')
      }
      if (editingId === book.bookId) resetForm()
      await loadBooks()
    } catch {
      setError('Delete failed.')
    }
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Admin — Books</h1>
        <Link to="/" className="btn btn-outline-secondary">
          Back to store
        </Link>
      </div>

      <p className="text-muted">
        Add, update, or remove books in the database. All fields are required.
      </p>

      {loading && <p>Loading…</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {message && !error && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 card-title">
                {editingId === null ? 'Add book' : `Edit book #${editingId}`}
              </h2>
              <form onSubmit={submit}>
                <div className="mb-2">
                  <label className="form-label" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    className="form-control"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="author">
                    Author
                  </label>
                  <input
                    id="author"
                    className="form-control"
                    value={form.author}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, author: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="publisher">
                    Publisher
                  </label>
                  <input
                    id="publisher"
                    className="form-control"
                    value={form.publisher}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, publisher: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="isbn">
                    ISBN
                  </label>
                  <input
                    id="isbn"
                    className="form-control"
                    value={form.isbn}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isbn: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="classification">
                    Classification
                  </label>
                  <input
                    id="classification"
                    className="form-control"
                    value={form.classification}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        classification: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <input
                    id="category"
                    className="form-control"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-6 mb-2">
                    <label className="form-label" htmlFor="pageCount">
                      Pages
                    </label>
                    <input
                      id="pageCount"
                      type="number"
                      min={1}
                      className="form-control"
                      value={form.pageCount}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          pageCount: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="col-6 mb-2">
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      min={0}
                      step="0.01"
                      className="form-control"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          price: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary">
                    {editingId === null ? 'Create' : 'Save changes'}
                  </button>
                  {editingId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="table-responsive">
            <table className="table table-sm table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th className="text-end">Price</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.bookId}>
                    <td>{b.bookId}</td>
                    <td>{b.title}</td>
                    <td>{b.category}</td>
                    <td className="text-end">${b.price.toFixed(2)}</td>
                    <td className="text-end text-nowrap">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => startEdit(b)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => void remove(b)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
