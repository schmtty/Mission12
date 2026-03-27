using Bookstore.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Enables OpenAPI metadata for easier endpoint testing in development.
builder.Services.AddOpenApi();
// Registers EF Core so we can query Bookstore.sqlite through BookstoreContext.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreDb")));
// Allows the Vite client app to call this API from a different origin.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowClient");

// Returns a paged list of books plus total count for client-side pagination UI.
app.MapGet("/api/books", async (
    BookstoreContext context,
    int pageSize = 5,
    int pageNum = 1,
    string sort = "asc",
    // Comma-separated list of categories to filter by (e.g., "Biography,Self-Help").
    // If omitted or empty, results include all categories.
    string? categories = null) =>
{
    // Guards against invalid query values and very large page sizes.
    var normalizedPageSize = Math.Clamp(pageSize, 1, 100);
    var normalizedPageNum = Math.Max(pageNum, 1);
    var sortDescending = string.Equals(sort, "desc", StringComparison.OrdinalIgnoreCase);

    // Parses the categories filter into a list for LINQ "IN (...)" style filtering.
    var categoryList = string.IsNullOrWhiteSpace(categories)
        ? new List<string>()
        : categories.Split(',', StringSplitOptions.TrimEntries)
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .ToList();

    // Filters first, then sorts/paginates.
    var filteredQuery = context.Books.AsQueryable();
    if (categoryList.Count > 0)
    {
        filteredQuery = filteredQuery.Where(b => categoryList.Contains(b.Category));
    }

    var sortedQuery = sortDescending
        ? filteredQuery.OrderByDescending(b => b.Title)
        : filteredQuery.OrderBy(b => b.Title);

    // Count after filtering, then return only the requested page.
    var totalBooks = await filteredQuery.CountAsync();
    var books = await sortedQuery
        .Skip((normalizedPageNum - 1) * normalizedPageSize)
        .Take(normalizedPageSize)
        .ToListAsync();

    return Results.Ok(new
    {
        books,
        totalBooks
    });
});

// Used to populate the category filter UI.
app.MapGet("/api/categories", async (BookstoreContext context) =>
{
    var categories = await context.Books
        .Select(b => b.Category)
        .Distinct()
        .OrderBy(c => c)
        .ToListAsync();

    return Results.Ok(categories);
});

app.Run();
