export default function CategoryFilter({
  categories,
  selectedCategories,
  onToggle,
  onClear,
  disabled,
}: {
  categories: string[]
  selectedCategories: string[]
  onToggle: (category: string) => void
  onClear: () => void
  disabled?: boolean
}) {
  const selectedSet = new Set(selectedCategories)

  return (
    <div className="card">
      <div className="card-body">
        <div className="fw-semibold mb-2">Filter by category</div>

        {categories.length === 0 ? (
          <p className="text-muted mb-0">Loading categories...</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {categories.map((category) => {
              const checked = selectedSet.has(category)
              const safeId = category.replace(/[^a-z0-9]/gi, '-')
              return (
                <div key={category} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cat-${safeId}`}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onToggle(category)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`cat-${safeId}`}
                  >
                    {category}
                  </label>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-3 d-grid">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={disabled || categories.length === 0}
            onClick={onClear}
          >
            Clear filter
          </button>
        </div>
      </div>
    </div>
  )
}

