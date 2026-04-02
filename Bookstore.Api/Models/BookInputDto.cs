namespace Bookstore.Api.Models;

/// <summary>
/// Payload for creating or updating a book (all fields except identity).
/// </summary>
public class BookInputDto
{
    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string Publisher { get; set; } = string.Empty;

    public string Isbn { get; set; } = string.Empty;

    public string Classification { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int PageCount { get; set; }

    public double Price { get; set; }

    /// <summary>Returns null if valid; otherwise an error message.</summary>
    public string? GetValidationError()
    {
        if (string.IsNullOrWhiteSpace(Title)) return "Title is required.";
        if (string.IsNullOrWhiteSpace(Author)) return "Author is required.";
        if (string.IsNullOrWhiteSpace(Publisher)) return "Publisher is required.";
        if (string.IsNullOrWhiteSpace(Isbn)) return "ISBN is required.";
        if (string.IsNullOrWhiteSpace(Classification)) return "Classification is required.";
        if (string.IsNullOrWhiteSpace(Category)) return "Category is required.";
        if (PageCount <= 0) return "Page count must be greater than zero.";
        if (Price < 0) return "Price cannot be negative.";
        return null;
    }
}
