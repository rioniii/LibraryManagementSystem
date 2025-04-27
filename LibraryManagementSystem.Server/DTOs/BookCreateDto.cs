using LibraryManagementSystem.Server.Models;

namespace LibraryManagementSystem.Server.DTOs
{
    public class BookCreateDto
    {
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int PublicationYear { get; set; }
        public string Publisher { get; set; } = string.Empty;
        public int TotalCopies { get; set; }
        public string Description { get; set; } = string.Empty;
        public string CoverImageURL { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public int CategoryId { get; set; }
        public BookStatus Status { get; set; }
    }
}

